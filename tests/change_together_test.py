"""Mechanical integrity only: never compile fixtures or infer model quality."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "evals/change-together"
SKILL = ROOT / "skills/super-review"


class ChangeTogetherIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inputs = json.loads((CORPUS / "inputs.json").read_text())["inputs"]
        cls.cases = json.loads((CORPUS / "cases.json").read_text())["cases"]

    def test_inputs_and_graders_match_and_contrast(self):
        input_ids = {entry["id"] for entry in self.inputs}
        graders = {entry["id"]: entry for entry in self.cases}
        self.assertEqual(input_ids, set(graders))
        for case in self.cases:
            self.assertTrue(case["contrasts"])
            self.assertLessEqual(set(case["contrasts"]), input_ids)

    def test_packets_hold_no_grader_material(self):
        forbidden = {entry["kind"] for entry in self.cases} | {"expect", "contrasts"}
        for packet in self.inputs:
            self.assertFalse(forbidden & set(packet))

    def test_lenses_hold_their_decisions(self):
        lenses = SKILL / "references/lenses"
        for directory in ("", "rust/", "typescript/", "java/"):
            self.assertIn("beyond the assigned area", (lenses / directory / "duplication.md").read_text())
        for directory in ("rust/", "typescript/", "java/"):
            text = (lenses / directory / "duplication.md").read_text().replace("\n", " ")
            self.assertIn("compile error", text)


if __name__ == "__main__":
    unittest.main()
