# Evidence-boundary stage comparisons

Status: **NOT RUN**. These are neutral stage inputs and separate grading criteria,
not recorded model results. Follow the [evaluation protocol](../README.md).
Compare base `51b34f3a8b4ce0e828f344bf90a08f2e7044dfb3` with the exact candidate
identity; use the same model, effort, source bytes, tools and repeat budget.

Supply only the common preamble and selected section of `packets.md`, the source
files listed by that case, and its selected `fixtures/observations.json` entry.
Do not send `cases.json`, this protocol, other observations, or expected answers.
The evaluator manifest verifies fixture bytes; snapshot paths below are controlled
stage roots, not claimed Git commits. Resolve them inside the temporary fixture
root, outside user checkouts. The native observations are injected stage inputs,
not results obtained from a live child or filesystem inspection.

Collections intentionally include a supplied child result because that is the
orchestrator's input at this stage. They are not discovery packets for specialists.
Symlinks and special files are metadata fixtures: do not create escaping links,
open a real device/pipe, or read an external private path. A controlled host should
record attempted reads and refuse accesses beyond the selected source allowlist.
This suite does not test a real filesystem sandbox or submodule acquisition.

Integrity tests verify IDs, contrasting observations, source hashes and packaging
isolation. Grade actual behavior only from separately recorded model transcripts.
Follow with realistic language-specific and native end-to-end cases before claiming
improved review quality. No model, timing or token improvement has been measured.
