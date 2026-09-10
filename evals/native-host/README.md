# Native host review probe — 3.0.0

This is a single bounded local naming review, not a general recommendation-quality
benchmark or a complete eight-lens PR review. It exercises native source reads,
independent child execution and final reconciliation after removing Super Review's
MCP transport and stores. Inputs and results are not installed with the skill.

The fixture is an unreleased internal mixed-language project with complete local
consumers. Its initial files were committed, then a comment was appended to
engine.rs. The request was whole-project production naming review, excluding
tests. The reviewer received the fixture path and installed skill path, no expected
findings or peer results. `setup.json` records the local snapshot; `fixture/` keeps
the reviewed bytes. The comment-only dirty change must not narrow whole-project
coverage. No fixture code was executed.

## Execution and outcome

- Orchestrator: Astra/medium; three fresh Terra/medium specialists, one per language.
- Native spawn, completion waits and result collection completed. No Super Review
  MCP calls were made; the orchestrator's native tool trace contained no MCP calls.
- All three production files were inspected with matching before/after hashes;
  worker_test.go was excluded. The report recorded HEAD and working-file identity.
- Three supported naming candidates reached the final report. The parent refined
  the Go proposal to express a timestamp result instead of a duration input.
- Original fixture bytes and working status were preserved. The report made no
  claims of compilation, bug-finding or tested behavioral equivalence.

Raw final reports, model identities and hashes of the installed resources used
by the probe are in `results/`. Two subsequent policy edits only reflowed the
contract and clarified that local policy uses its recorded revision in place of B;
this fixture had no team policy, so that clarification was not behaviorally tested.

## Mechanical and native configuration evidence

The new package checks passed (17 tests), along with TypeScript diagnostics,
skill validation, rule/resource validation, ShellCheck, actionlint, dependency
audit and deterministic packaging. All four ZIPs passed CRC/hash checks and
contained no MCP declarations, custom runtime or evaluator packets.

Claude's installed CLI accepted the native plugin manifest. OpenCode 1.18.29
resolved the intended roles, model configuration, skill and command; read/search/
Bash tools were enabled, edit/write tools disabled, and the specialist could not
delegate. These are configuration probes, not live Claude/OpenCode model reviews.
The native shell is not an enforced read-only sandbox; this change intentionally
replaces the old fixed source-reader permission boundary with host permissions.

Tests specific to the removed reader, caches and completion protocol were retired.
Language rule/profile identities, evaluation-section integrity and exact native
policy copies remain checked. The historical routing-first experiment still
targets its 2.x workflow and is no longer tested as a replacement of the 3.x text.

This probe does not establish remote GitHub acquisition under API caps, every
language/lens combination, cancellation, long-report recovery, or behavior after
host context loss. Those limitations remain explicit in the review workflow.
