"""Go evaluation integrity only: no fixture execution or model inference."""
from collections import defaultdict
from pathlib import Path, PurePosixPath
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
DEPTH = ROOT / "evals/go/quality-depth"
PROFILE_OWNERS = {
    "lifecycle-ownership": "data-flow",
    "dependency-boundaries": "abstractions",
}
LENSES = {"api-clarity", "abstractions", "data-flow"}
PAIRS = {
    "configuration", "iteration", "io-operation", "background-ownership",
    "transaction-ownership", "transport-boundary", "version-boundary", "map-copy",
}
SOURCE_BLOCK = re.compile(r"^### ([^\n]+)\n\n```(go|text)\n([\s\S]*?)^```$", re.MULTILINE)


def read(path):
    return path.read_text(encoding="utf-8")


def sections():
    chunks = re.split(r"^## (GD\d+)\n", read(DEPTH / "packets.md"), flags=re.MULTILINE)
    return list(zip(chunks[1::2], chunks[2::2]))


class GoQualityDepth(unittest.TestCase):
    def setUp(self):
        self.corpus = json.loads(read(DEPTH / "cases.json"))
        self.cases = self.corpus["cases"]

    def test_sections_and_schema(self):
        ids = [case["id"] for case in self.cases]
        raw_ids = [case_id for case_id, _ in sections()]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(len(raw_ids), len(set(raw_ids)))
        self.assertEqual(ids, raw_ids)
        self.assertRegex(self.corpus["baseline_commit"], r"^[0-9a-f]{40}$")
        self.assertEqual(self.corpus["status"], "proposed-not-model-executed")
        for case in self.cases:
            with self.subTest(case=case["id"]):
                self.assertEqual(set(case), {"id", "topic", "kind", "stage", "lens", "profile", "expect", "constraints", "sources"})
                for key in ("expect", "constraints", "sources"):
                    self.assertIsInstance(case[key], list)
                    self.assertTrue(case[key])
                    self.assertTrue(all(isinstance(value, str) and value.strip() for value in case[key]))
                self.assertIn(case["stage"], {"specialist", "verification"})
                self.assertIn(case["lens"], LENSES)
                if case["profile"] is not None:
                    self.assertEqual(PROFILE_OWNERS[case["profile"]], case["lens"])

    def test_raw_metadata_matches_assignments(self):
        for case, (case_id, body) in zip(self.cases, sections()):
            with self.subTest(case=case_id):
                for field in ("stage", "lens"):
                    self.assertEqual(re.findall(rf"^{field.title()}: (.+)$", body, re.MULTILINE), [case[field]])
                self.assertEqual(re.findall(r"^Profile: (.+)$", body, re.MULTILINE), [case["profile"]] if case["profile"] else [])
                for field in ("Baseline", "Request"):
                    self.assertEqual(len(re.findall(rf"^{field}: .+$", body, re.MULTILINE)), 1)
                self.assertNotIn("Expected outcome:", body)
                self.assertNotRegex(body, r"(?m)^(Kind|Expect|Sources):")
                for expectation in case["expect"]:
                    self.assertNotIn(expectation, body)
                # Actual prompts name only their case, never the counterexample or peer verdict.
                self.assertFalse(re.search(r"\bGD\d+\b", body))

    def test_complete_safe_source_blocks(self):
        for case_id, body in sections():
            with self.subTest(case=case_id):
                blocks = SOURCE_BLOCK.findall(body)
                paths = [path for path, _, _ in blocks]
                self.assertTrue(blocks)
                self.assertEqual(paths, re.findall(r"^### (.+)$", body, re.MULTILINE))
                self.assertEqual(len(paths), len(set(paths)))
                self.assertEqual(body.count("```"), len(blocks) * 2)
                self.assertIn("go.mod", paths)
                self.assertTrue(any(path.endswith(".go") for path in paths))
                for name, language, content in blocks:
                    path = PurePosixPath(name)
                    self.assertFalse(path.is_absolute())
                    self.assertNotIn("..", path.parts)
                    self.assertNotIn("\\", name)
                    self.assertTrue(content.strip())
                    if name.endswith(".go"):
                        self.assertEqual(language, "go")
                        self.assertRegex(content, r"(?m)^package \w+$")
                        self.assertFalse(name.endswith("_test.go"))
                    else:
                        self.assertEqual(path.name, "go.mod")
                        self.assertEqual(language, "text")
                        self.assertRegex(content, r"(?m)^module example\.com/[a-z]+$")
                        self.assertRegex(content, r"(?m)^go 1\.2[23]$")
                        self.assertNotRegex(content, r"(?m)^(require|replace)\b")

    def test_pairs_and_guards(self):
        topics = defaultdict(list)
        for case in self.cases:
            self.assertIn(case["kind"], {"opportunity", "retain", "guard"})
            topics[case["topic"]].append(case["kind"])
        self.assertEqual({topic for topic, kinds in topics.items() if kinds != ["guard"]}, PAIRS)
        for topic in PAIRS:
            self.assertEqual(sorted(topics[topic]), ["opportunity", "retain"])
        self.assertEqual({case["topic"] for case in self.cases if case["kind"] == "guard"}, {"iterator-lifetime", "slice-aliasing"})

    def test_source_references(self):
        source_ids = re.findall(r"^\[([^]]+)\]: https://\S+$", read(DEPTH / "README.md"), re.MULTILINE)
        self.assertEqual(len(source_ids), len(set(source_ids)))
        for case in self.cases:
            self.assertTrue(set(case["sources"]).issubset(source_ids), case["id"])

    def test_version_contrasts(self):
        raw = dict(sections())
        modern = {path: source for path, _, source in SOURCE_BLOCK.findall(raw["GD13"])}
        self.assertIn("go 1.22", modern["go.mod"])
        self.assertTrue(modern["keys_modern.go"].startswith("//go:build go1.23\n\n"))
        self.assertTrue(modern["keys_legacy.go"].startswith("//go:build !go1.23\n\n"))
        self.assertIn("[]string", modern["list.go"])
        self.assertNotIn('"iter"', modern["list.go"])
        self.assertIn("consumer/use.go", modern)
        legacy = {path: source for path, _, source in SOURCE_BLOCK.findall(raw["GD14"])}
        self.assertIn("go 1.23", legacy["go.mod"])
        self.assertIn("toolchain go1.23.2", legacy["go.mod"])
        self.assertIn("go 1.22", legacy["legacy/go.mod"])
        self.assertNotIn("//go:build", legacy["legacy/list.go"])

    def test_current_routing_and_explicit_scope(self):
        cases = json.loads(read(ROOT / "evals/go/cases.json"))
        self.assertEqual(len(cases), len({case["id"] for case in cases}))
        by_id = {case["id"]: case for case in cases}
        default, narrow = (by_id[name] for name in ("mixed-language", "go-only-language"))
        self.assertEqual(default["input"]["files"], narrow["input"]["files"])
        for case in (default, narrow):
            self.assertEqual(case["input"]["stage"], "routing")
            self.assertIn("web/client.ts", case["input"]["files"])
            self.assertIn("web/legacy.js", case["input"]["files"])
        self.assertIn("no language narrowing", default["input"]["scope"])
        self.assertIn("Go and TypeScript", " ".join(default["expect"]))
        self.assertNotIn("Review supported Go only.", default["expect"])
        self.assertIn("only Go", narrow["input"]["scope"])
        self.assertIn("not requested", " ".join(narrow["expect"]))
        self.assertIn("thirteen semantic cases", read(ROOT / "evals/go/README.md"))
        self.assertEqual(len(cases), 13)


if __name__ == "__main__":
    unittest.main(verbosity=2)
