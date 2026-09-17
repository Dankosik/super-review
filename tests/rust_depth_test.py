"""Mechanical integrity only: never compile fixtures or infer model quality."""
import json
import re
import tomllib
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/super-review"
DEPTH = ROOT / "evals/rust/depth"
DELIVERIES = (
    ROOT / "adapters/claude/plugin/resources/super-review",
    ROOT / "adapters/codex/super-review/skills/super-review",
    ROOT / "adapters/cursor/plugin/resources/super-review",
)
MECHANISMS = ("tokio", "serde", "clap", "axum")
TOUCHED = (
    "references/languages/rust.md",
    "references/lenses/rust/api-clarity.md",
    "references/lenses/rust/abstractions.md",
    "references/lenses/rust/control-flow.md",
    "references/profiles/rust/error-expression.md",
    *(f"references/rust/{name}.md" for name in MECHANISMS),
)


class RustDepthIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inputs = json.loads((DEPTH / "inputs.json").read_text())["inputs"]
        cls.cases = json.loads((DEPTH / "cases.json").read_text())["cases"]

    def test_input_grader_identity_and_contrasts(self):
        ids = [entry["id"] for entry in self.inputs]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertTrue(all(re.fullmatch(r"RD[0-9]{2}", key) for key in ids))
        graders = {entry["id"]: entry for entry in self.cases}
        self.assertEqual(len(graders), len(self.cases))
        self.assertEqual(set(ids), set(graders))
        for key, case in graders.items():
            self.assertTrue(case["expect"])
            self.assertTrue(case["contrasts"])
            for other in case["contrasts"]:
                self.assertNotEqual(key, other)
                self.assertIn(other, graders)
                self.assertIn(key, graders[other]["contrasts"])

    def test_each_packet_has_own_context_and_safe_source_paths(self):
        for packet in self.inputs:
            self.assertNotIn("expect", packet)
            self.assertNotIn("contrasts", packet)
            self.assertTrue(packet["request"] and packet["scope"] and packet["context"])
            manifest = tomllib.loads(packet["files"]["Cargo.toml"])
            self.assertIn(manifest["package"]["edition"], ("2015", "2018", "2021", "2024"))
            self.assertRegex(manifest["package"]["rust-version"], r"^1\.[0-9]+$")
            self.assertTrue(any(path.endswith(".rs") for path in packet["files"]))
            for path, text in packet["files"].items():
                self.assertFalse(Path(path).is_absolute())
                self.assertNotIn("..", Path(path).parts)
                self.assertTrue(text.endswith("\n"))

    def test_owner_ids_and_resources_exist(self):
        stable = set(json.loads((ROOT / "evals/rust/rule-ids.json").read_text()))
        for packet, case in zip(self.inputs, self.cases, strict=True):
            self.assertEqual(packet["id"], case["id"])
            self.assertIn(case["rule"], stable)
            lens = SKILL / f"references/lenses/rust/{packet['lens']}.md"
            self.assertIn(f"## {case['rule']}", lens.read_text())
            for profile in packet["profiles"]:
                text = (SKILL / f"references/profiles/rust/{profile}.md").read_text()
                self.assertIn(f"Owner: {packet['lens']}", text)
                self.assertIn(f"Rule: {case['rule']}", text)
        context = (SKILL / "references/languages/rust.md").read_text()
        for name in MECHANISMS:
            self.assertIn(f"../rust/{name}.md", context)
            self.assertTrue((SKILL / f"references/rust/{name}.md").is_file())

    def test_touched_skill_delivery_is_byte_identical(self):
        for path in TOUCHED:
            content = (SKILL / path).read_bytes()
            for delivery in DELIVERIES:
                self.assertEqual(content, (delivery / path).read_bytes(), str(delivery / path))

    def test_grader_material_is_not_installed(self):
        for tree in (SKILL, *DELIVERIES):
            self.assertFalse((tree / "evals").exists())
            for path in tree.rglob("*"):
                if path.is_file():
                    self.assertNotIn(path.name, ("cases.json", "inputs.json"))


if __name__ == "__main__":
    unittest.main()
