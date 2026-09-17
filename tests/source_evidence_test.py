"""Fixture integrity and native Git semantics, not model-behavior tests.

Only disposable test repositories are mutated. No reviewed project is executed.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
EVAL = ROOT / "evals/source-evidence"


class FixtureIntegrity(unittest.TestCase):
    def test_case_mapping_and_grader_separation(self):
        suite = json.loads((EVAL / "cases.json").read_text())
        packet = (EVAL / "packets.md").read_text()
        self.assertEqual(suite["status"], "NOT RUN")
        self.assertRegex(suite["base_revision"], r"^[0-9a-f]{40}$")
        ids = [case["id"] for case in suite["cases"]]
        self.assertEqual(len(ids), len(set(ids)))
        sections = re.findall(r"^## (E\d{2})$", packet, re.M)
        self.assertCountEqual(ids, sections)
        members = [item for pair in suite["contrast_pairs"] for item in pair]
        self.assertCountEqual(members, ids)
        self.assertTrue(all(len(pair) == 2 for pair in suite["contrast_pairs"]))
        manifest = json.loads((EVAL / suite["source_manifest"]).read_text())
        for case in suite["cases"]:
            self.assertEqual(case["input"]["packet"], "packets.md")
            self.assertEqual(case["input"]["section"], case["id"])
            body = packet.split("## " + case["id"] + "\n")[1].split("\n## ")[0]
            self.assertTrue(body.strip() and case["expect"] and case["stage"])
            self.assertNotRegex(body, r"\bE\d{2}\b")
            for expectation in case["expect"]:
                self.assertNotIn(expectation, body)
            self.assertEqual(len(case["input"]["source"]), len(set(case["input"]["source"])))
            for path in case["input"]["source"]:
                self.assertIn(path, manifest["files"])

    def test_fixture_paths_and_byte_identities(self):
        manifest = json.loads((EVAL / "source-manifest.json").read_text())
        self.assertEqual(manifest["algorithm"], "sha256")
        actual = {p.relative_to(EVAL).as_posix() for p in (EVAL / "fixtures").rglob("*") if p.is_file()}
        self.assertEqual(actual, set(manifest["files"]))
        for name, expected in manifest["files"].items():
            file = EVAL / name
            self.assertFalse(file.is_symlink())
            self.assertTrue(file.resolve().is_relative_to(EVAL.resolve()))
            self.assertRegex(expected, r"^[0-9a-f]{64}$")
            self.assertEqual(hashlib.sha256(file.read_bytes()).hexdigest(), expected)

    def test_evaluator_files_are_not_delivered(self):
        for directory in ["skills/super-review", "adapters/claude/plugin", "adapters/codex/super-review"]:
            root = ROOT / directory
            self.assertTrue(root.is_dir(), directory)
            for path in root.rglob("*"):
                self.assertNotIn(path.name, {"source-evidence", "cases.json", "packets.md", "source-manifest.json"})


class GitSemantics(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="super-review-evidence-")
        self.addCleanup(self.temporary.cleanup)
        self.scratch = Path(self.temporary.name)
        self.repo = self.scratch / "repo"
        self.repo.mkdir()
        self.hooks = self.scratch / "empty-hooks"
        self.hooks.mkdir()
        self.env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
        self.env.update({
            "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
            "GIT_TERMINAL_PROMPT": "0", "GIT_AUTHOR_NAME": "Fixture",
            "GIT_AUTHOR_EMAIL": "fixture@example.invalid", "GIT_COMMITTER_NAME": "Fixture",
            "GIT_COMMITTER_EMAIL": "fixture@example.invalid", "LC_ALL": "C",
        })
        self.git("init", "-q", "--initial-branch=main")

    def git(self, *args: str, check: bool = True) -> subprocess.CompletedProcess:
        return subprocess.run([
            "git", "--no-pager", "--literal-pathspecs", "-c", "core.fsmonitor=false",
            "-c", f"core.hooksPath={self.hooks}", "-c", "commit.gpgsign=false",
            "-c", "core.autocrlf=false", *args,
        ], cwd=self.repo, env=self.env, capture_output=True, check=check, timeout=10)

    def write(self, path: str, text: str):
        file = self.repo / path
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_text(text)

    def commit(self) -> str:
        self.git("add", "--all")
        self.git("commit", "-qm", "fixture")
        return self.git("rev-parse", "HEAD").stdout.decode().strip()

    def seed(self) -> str:
        self.write("format.go", "package labels\n\nfunc Label(value string) string { return value }\n")
        return self.commit()

    def index_entries(self) -> dict[bytes, list[tuple[bytes, bytes, bytes]]]:
        entries: dict[bytes, list[tuple[bytes, bytes, bytes]]] = {}
        for record in self.git("ls-files", "--stage", "-z").stdout.split(b"\0"):
            if record:
                metadata, name = record.split(b"\t", 1)
                mode, oid, stage = metadata.split()
                entries.setdefault(name, []).append((mode, oid, stage))
        return entries

    def diff(self, *args: str) -> bytes:
        return self.git("diff", "--no-ext-diff", "--no-textconv", *args).stdout

    def test_staged_and_unstaged_use_distinct_endpoints(self):
        head = self.seed()
        old = self.git("show", f"{head}:format.go").stdout
        self.write("format.go", "package labels\n// staged version\n")
        self.git("add", "--", "format.go")
        _, oid, stage = self.index_entries()[b"format.go"][0]
        self.write("format.go", "package labels\n// working version\n")
        index = self.git("cat-file", "blob", oid.decode()).stdout
        working = (self.repo / "format.go").read_bytes()
        self.assertEqual(stage, b"0")
        self.assertEqual(len({old, index, working}), 3)
        self.assertIn(b"+// staged version", self.diff("--cached", head))
        unstaged = self.diff()
        self.assertIn(b"-// staged version", unstaged)
        self.assertIn(b"+// working version", unstaged)
        self.assertNotIn(b"func Label", unstaged)

    def test_combined_view_is_net_change_not_layer_union(self):
        head = self.seed()
        original = (self.repo / "format.go").read_text()
        self.write("format.go", "package labels\n// intermediate staged version\n")
        self.git("add", "--", "format.go")
        self.write("format.go", original)
        self.assertTrue(self.diff("--cached", head))
        self.assertTrue(self.diff())
        self.assertEqual(self.diff(head), b"")

    def test_captured_index_blob_survives_index_movement(self):
        self.seed()
        oid = self.index_entries()[b"format.go"][0][1].decode()
        captured = self.git("cat-file", "blob", oid).stdout
        self.write("format.go", "package labels\n// later index\n")
        self.git("add", "--", "format.go")
        self.assertNotEqual(self.index_entries()[b"format.go"][0][1].decode(), oid)
        self.assertEqual(self.git("cat-file", "blob", oid).stdout, captured)

    def test_untracked_inventory_preserves_literal_unusual_paths(self):
        self.write(".gitignore", "ignored.go\n")
        self.commit()
        names = ["-dash.go", "with space.go", "literal[ab].go"]
        if os.name != "nt":
            names.append("line\nbreak.go")
        for name in names + ["ignored.go"]:
            self.write(name, "package labels\n")
        records = self.git("ls-files", "--others", "--exclude-standard", "-z", "--").stdout.split(b"\0")
        self.assertEqual(set(records[:-1]), {os.fsencode(name) for name in names})
        self.git("add", "--", "literal[ab].go", "-dash.go")
        self.assertIn(b"literal[ab].go", self.index_entries())
        self.assertIn(b"-dash.go", self.index_entries())

    def test_rename_and_deletion_retain_old_paths(self):
        self.seed()
        self.write("obsolete.go", "package old\n\nconst OldLabel = 7\n")
        old = self.commit()
        self.git("mv", "--", "format.go", "renamed.go")
        self.git("rm", "--", "obsolete.go")
        fields = self.diff("--cached", "--name-status", "-M", "-z", old).split(b"\0")[:-1]
        changes = []
        while fields:
            status = fields.pop(0)
            width = 2 if status.startswith((b"R", b"C")) else 1
            changes.append((status, *fields[:width]))
            del fields[:width]
        self.assertCountEqual(changes, [(b"R100", b"format.go", b"renamed.go"), (b"D", b"obsolete.go")])
        self.assertIn(b"func Label", self.git("show", f"{old}:format.go").stdout)
        self.assertNotIn(b"format.go", self.index_entries())
        self.assertNotIn(b"obsolete.go", self.index_entries())

    def test_merge_base_is_not_target_tip(self):
        ancestor = self.seed()
        self.git("branch", "feature")
        self.write("target-only.go", "package labels\n")
        target = self.commit()
        self.git("checkout", "-q", "feature")
        self.write("format.go", "package labels\n// feature change\n")
        head = self.commit()
        comparison = self.git("merge-base", target, head).stdout.decode().strip()
        self.assertEqual(comparison, ancestor)
        self.assertNotEqual(comparison, target)
        self.assertEqual(self.diff("--name-only", "-z", comparison, head), b"format.go\0")
        self.assertIn(b"target-only.go", self.diff("--name-only", "-z", target, head))

    def test_unmerged_index_has_no_resolved_stage_zero(self):
        ancestor = self.seed()
        self.write("format.go", "package main_version\n")
        target = self.commit()
        self.git("checkout", "-qb", "feature", ancestor)
        self.write("format.go", "package other_version\n")
        self.commit()
        merged = self.git("merge", "--no-edit", target, check=False)
        self.assertEqual(merged.returncode, 1, merged.stderr.decode())
        self.assertEqual({entry[2] for entry in self.index_entries()[b"format.go"]}, {b"1", b"2", b"3"})

    def test_unborn_head_still_has_staged_source(self):
        self.write("format.go", "package labels\n")
        self.git("add", "--", "format.go")
        self.assertNotEqual(self.git("rev-parse", "--verify", "HEAD", check=False).returncode, 0)
        self.assertEqual(self.index_entries()[b"format.go"][0][2], b"0")
        self.assertEqual(self.diff("--cached", "--name-only", "-z"), b"format.go\0")

    @unittest.skipIf(os.name == "nt", "POSIX symlink fixture; Linux CI exercises this")
    def test_symlink_blob_is_link_metadata_not_target_source(self):
        self.seed()
        outside = self.scratch / "outside.txt"
        outside.write_text("external contents not authorized as source")
        link = self.repo / "link.go"
        link.symlink_to(outside)
        self.git("add", "--", "link.go")
        mode, oid, _ = self.index_entries()[b"link.go"][0]
        self.assertEqual(mode, b"120000")
        self.assertEqual(self.git("cat-file", "blob", oid.decode()).stdout, os.fsencode(outside))
        self.assertFalse(link.resolve().is_relative_to(self.repo.resolve()))

    def test_gitlink_does_not_supply_submodule_contents(self):
        head = self.seed()
        self.git("update-index", "--add", "--cacheinfo", f"160000,{head},module")
        mode, oid, stage = self.index_entries()[b"module"][0]
        self.assertEqual((mode, oid.decode(), stage), (b"160000", head, b"0"))
        self.assertFalse((self.repo / "module").exists())

    @unittest.skipIf(os.name == "nt", "POSIX helper fixture; Linux CI exercises this")
    def test_inspection_disables_external_diff_and_textconv(self):
        head = self.seed()
        marker = self.scratch / "executed"
        helper = self.scratch / "helper.sh"
        self.env["SUPER_REVIEW_TEST_MARKER"] = str(marker)
        helper.write_text('#!/bin/sh\n: > "$SUPER_REVIEW_TEST_MARKER"\nprintf "%s\\n" converted\n')
        helper.chmod(0o700)
        self.write("format.go", "package changed\n")
        self.git("config", "diff.external", str(helper))
        self.assertIn(b"package changed", self.diff(head))
        self.assertFalse(marker.exists())
        # Positive control is our own disposable helper, not reviewed project code.
        self.git("diff", "--ext-diff", head)
        self.assertTrue(marker.exists())
        marker.unlink()
        self.git("config", "--unset", "diff.external")
        self.write(".gitattributes", "*.go diff=fixture\n")
        self.git("config", "diff.fixture.textconv", str(helper))
        self.assertIn(b"package changed", self.diff(head))
        self.assertFalse(marker.exists())
        self.git("diff", "--textconv", head)
        self.assertTrue(marker.exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
