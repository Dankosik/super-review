"""Frontend fixture and delivery integrity only; no model or fixture code execution."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/super-review"
PACKAGES = (
    ROOT / "adapters/claude/plugin/resources/super-review",
    ROOT / "adapters/codex/super-review/skills/super-review",
    ROOT / "adapters/cursor/plugin/resources/super-review",
)
PROFILES = {
    "react-state": ("data-flow", "ts.data.make-transformations-visible"),
    "react-effects": ("function-cohesion", "ts.functions.coherent-purpose"),
    "react-composition": ("api-clarity", "ts.api.express-the-call"),
    "next-boundaries": ("abstractions", "ts.abstractions.earn-the-boundary"),
    "next-data-ownership": ("data-flow", "ts.data.make-transformations-visible"),
    "tailwind-variants": ("duplication", "ts.duplication.share-knowledge"),
    "shadcn-composition": ("api-clarity", "ts.api.express-the-call"),
}


def read(path):
    return path.read_text(encoding="utf-8")


class FrontendIntegrity(unittest.TestCase):
    def test_profile_ownership_and_routing(self):
        router = read(SKILL / "references/frontend.md")
        ids = json.loads(read(ROOT / "evals/typescript/rule-ids.json"))
        for name, (owner, rule) in PROFILES.items():
            with self.subTest(profile=name):
                path = f"references/profiles/typescript/{name}.md"
                text = read(SKILL / path)
                self.assertIn(f"Owner: {owner}\n", text)
                self.assertIn(f"Rule: {rule}\n", text)
                self.assertIn(rule, ids)
                self.assertIn(f"[{name}](profiles/typescript/{name}.md) | {owner} |", router)
        for path in ("references/languages.md", "references/aspects.md"):
            self.assertIn("](frontend.md)", read(SKILL / path))
        self.assertIn("](../frontend.md)", read(SKILL / "references/languages/typescript.md"))

    def test_added_resource_links(self):
        paths = [SKILL / "references/frontend.md", SKILL / "references/frontend/context.md"]
        paths.extend(SKILL / f"references/profiles/typescript/{name}.md" for name in PROFILES)
        for path in paths:
            for target in re.findall(r"\]\(([^)]+)\)", read(path)):
                if re.match(r"[a-z]+://", target):
                    continue
                target = target.split("#", 1)[0]
                destination = (path.parent / target).resolve()
                self.assertTrue(destination.is_relative_to(SKILL), (path, target))
                self.assertTrue(destination.is_file(), (path, target))

    def test_byte_identical_delivery(self):
        # All skill files present in the checkout, not just the frontend additions.
        for path in SKILL.rglob("*"):
            if path.is_file():
                for package in PACKAGES:
                    with self.subTest(path=str(path), package=str(package)):
                        self.assertEqual(path.read_bytes(), (package / path.relative_to(SKILL)).read_bytes())
        self.assertEqual((ROOT / "README.md").read_bytes(),
                         (ROOT / "adapters/codex/super-review/README.md").read_bytes())

    def test_neutral_inputs_and_source_identities(self):
        inputs = json.loads(read(ROOT / "evals/frontend/inputs.json"))
        cases = json.loads(read(ROOT / "evals/frontend/cases.json"))
        self.assertEqual(len(inputs), len({item["id"] for item in inputs}))
        self.assertEqual(len(cases), len({item["id"] for item in cases}))
        self.assertEqual({item["id"] for item in inputs}, {item["id"] for item in cases})
        for item in inputs:
            self.assertEqual(set(item), {"id", "request", "snapshot", "source_extent", "source_notes", "files"})
            self.assertTrue(item["request"])
            self.assertEqual(item["snapshot"], "frontend-fixture-" + item["id"])
            self.assertTrue(item["files"])
            self.assertEqual(len(item["files"]), len({f["path"] for f in item["files"]}))
            for source in item["files"]:
                self.assertEqual(set(source), {"path", "content", "sha256"})
                path = PurePosixPath(source["path"])
                self.assertFalse(path.is_absolute())
                self.assertNotIn("..", path.parts)
                self.assertNotIn("\\", source["path"])
                self.assertEqual(source["sha256"], hashlib.sha256(source["content"].encode("utf-8")).hexdigest())
        for case in cases:
            self.assertTrue(case["expect"])
            self.assertTrue(all(isinstance(value, str) and value.strip() for value in case["expect"]))
            self.assertTrue(set(case["profiles"]).issubset(PROFILES))
        for profile in PROFILES:
            kinds = {case["kind"] for case in cases if profile in case["profiles"]}
            self.assertTrue({"improvement", "retain"}.issubset(kinds), profile)
        self.assertEqual({case["id"] for case in cases if case["kind"] == "guard"},
                         {"F15", "F16", "F17", "F18", "F19", "F20"})

    def test_evaluations_are_not_installed(self):
        for directory in (SKILL, ROOT / "adapters/claude/plugin", ROOT / "adapters/codex/super-review",
                          ROOT / "adapters/cursor/plugin"):
            self.assertFalse(any(path.name == "evals" for path in directory.rglob("*")))
        # Never add development expectations to runtime resources via a relative link.
        for path in SKILL.rglob("*.md"):
            self.assertNotRegex(read(path), r"\]\([^)]*evals/frontend")


if __name__ == "__main__":
    unittest.main(verbosity=2)
