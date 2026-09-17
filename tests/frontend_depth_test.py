"""Instruction/fixture integrity, not model judgment or fixture-code execution."""
from collections import defaultdict
from pathlib import Path, PurePosixPath
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/super-review"
DEPTH = ROOT / "evals/frontend/depth"
NEW_PROFILES = {
    "react-state-transitions": ("representation", "ts.representation.express-concepts"),
    "next-ui-boundaries": ("control-flow", "ts.flow.show-main-path"),
    "tailwind-state": ("data-flow", "ts.data.make-transformations-visible"),
    "tailwind-layout": ("abstractions", "ts.abstractions.earn-the-boundary"),
}
EXISTING_PROFILES = {
    "react-state", "react-effects", "react-composition", "next-boundaries",
    "next-data-ownership", "tailwind-variants", "shadcn-composition",
}


def read(path):
    return path.read_text(encoding="utf-8")


class FrontendDepth(unittest.TestCase):
    def test_packet_sections(self):
        text = read(DEPTH / "packets.md")
        sections = re.split(r"^## (D\d+)\n", text, flags=re.MULTILINE)
        ids = sections[1::2]
        cases = json.loads(read(DEPTH / "cases.json"))
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(set(ids), {case["id"] for case in cases})
        for case_id, section in zip(ids, sections[2::2]):
            with self.subTest(case=case_id):
                self.assertRegex(section, r"\nRequest: .+")
                self.assertRegex(section, r"\nBaseline: .+")
                paths = re.findall(r"^### (.+)$", section, re.MULTILINE)
                self.assertTrue(paths)
                self.assertEqual(len(paths), len(set(paths)))
                for name in paths:
                    path = PurePosixPath(name)
                    self.assertFalse(path.is_absolute())
                    self.assertNotIn("..", path.parts)
                    self.assertNotIn("\\", name)
                blocks = re.findall(r"^```(?:tsx|ts|vue|markdown)\n([\s\S]*?)^```$", section, re.MULTILINE)
                self.assertEqual(len(blocks), len(paths))
                self.assertTrue(all(block.strip() for block in blocks))
                self.assertNotIn("Expected outcome:", section)

    def test_contrasts_and_guards(self):
        cases = json.loads(read(DEPTH / "cases.json"))
        self.assertEqual(len(cases), len({case["id"] for case in cases}))
        topics = defaultdict(set)
        profiles = set(NEW_PROFILES) | EXISTING_PROFILES
        for case in cases:
            self.assertEqual(set(case), {"id", "topic", "kind", "profiles", "expect"})
            self.assertTrue(set(case["profiles"]).issubset(profiles))
            self.assertTrue(case["expect"])
            self.assertTrue(all(isinstance(item, str) and item.strip() for item in case["expect"]))
            self.assertIn(case["kind"], {"opportunity", "retain", "guard"})
            topics[case["topic"]].add(case["kind"])
        pairs = {topic for topic, kinds in topics.items() if kinds != {"guard"}}
        self.assertEqual(pairs, {
            "effect-event", "state-transitions", "child-roles", "provider",
            "browser-gate", "ui-flow", "next-recovery", "route-types",
            "navigation-lifetime", "presentation-state", "container-layout", "aria-composition",
        })
        for topic in pairs:
            self.assertEqual(topics[topic], {"opportunity", "retain"})
        self.assertEqual({case["id"] for case in cases if case["kind"] == "guard"},
                         {"D25", "D26", "D27", "D28", "D29", "D30"})

    def test_new_profile_ownership(self):
        router = read(SKILL / "references/frontend.md")
        stable_ids = json.loads(read(ROOT / "evals/typescript/rule-ids.json"))
        for profile, (owner, rule) in NEW_PROFILES.items():
            text = read(SKILL / f"references/profiles/typescript/{profile}.md")
            self.assertEqual(re.findall(r"^Owner: (.+)$", text, re.MULTILINE), [owner])
            self.assertEqual(re.findall(r"^Rule: (.+)$", text, re.MULTILINE), [rule])
            self.assertIn(rule, stable_ids)
            self.assertIn("## " + rule, read(SKILL / f"references/lenses/typescript/{owner}.md"))
            self.assertIn(f"[{profile}](profiles/typescript/{profile}.md) | {owner} |", router)
        for case in json.loads(read(DEPTH / "cases.json")):
            for profile in case["profiles"]:
                self.assertIn(f"[{profile}](profiles/typescript/{profile}.md)", router)

    def test_new_profiles_are_installed_without_grading_material(self):
        for package in (
            ROOT / "adapters/claude/plugin/resources/super-review",
            ROOT / "adapters/codex/super-review/skills/super-review",
            ROOT / "adapters/cursor/plugin/resources/super-review",
        ):
            for profile in NEW_PROFILES:
                path = Path(f"references/profiles/typescript/{profile}.md")
                self.assertEqual((SKILL / path).read_bytes(), (package / path).read_bytes())
            self.assertFalse(any(path.name == "evals" for path in package.rglob("*")))
            for path in package.rglob("*.md"):
                self.assertNotRegex(read(path), re.compile(r"^## D\d+\s*$", re.MULTILINE))
                self.assertNotIn("evals/frontend/depth", read(path))


if __name__ == "__main__":
    unittest.main(verbosity=2)
