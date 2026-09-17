# Go quality-depth validation receipt

Authoring date: 2026-09-17. Research/base revision:
`f5a67021bbc54995648fe032d07bccdb88a32fa6`.
This is an evaluation-only patch, not a measured runtime instruction improvement.

## Actual evidence

| Check | Outcome | Scope and limitations |
| --- | --- | --- |
| GitHub source acquisition | PASS | Branch and relevant files read through the GitHub connector at the pinned SHA. The two modified pre-existing files were verified against their Git blob identities before editing. |
| `python3 tests/go_quality_depth_test.py` | PASS | 7 integrity tests: schema/sections, raw assignments, complete safe source blocks, contrasts/guards, source references, version boundaries and language-scope regression. Python 3.13.5. |
| Isolated `go build ./...` | PASS | 19 module builds from 18 raw packets, Go 1.23.2 linux/amd64. GD14 has two modules. No fixture executable, SQL query, handler or goroutine was run. |
| GD13 fallback file-list compilation | PASS | `go build list.go keys_legacy.go` with Go 1.23.2, ignoring selection constraints for this syntax check. This is NOT execution/selection on Go 1.22. |
| `bun test tests/go-quality-depth.test.ts` | NOT RUN | Attempt returned `bun: command not found`. The same Python suite called by this thin wrapper passed directly. |
| `bun run typecheck` | NOT RUN | Attempt returned `bun: command not found`. No TypeScript typecheck result is claimed. |
| Go 1.22 consumer/compiler execution | NOT RUN | That compiler is not installed. Source/tag/consumer contracts were inspected; a newer compiler cannot establish the oldest supported baseline. |
| Independent agents / model evaluations | NOT RUN | No native independent-worker tool was available. No task/model IDs, raw model outputs, inferred quality scores or latency claims were invented. |
| Full package build/validation | NOT RUN | No canonical instruction, packaged resource, adapter or package dependency changed. This is not evidence of a full release gate. |

Local unauthenticated clone failed because the container could not resolve
`github.com`; it did not change the repository. Authorized GitHub reads/writes
remain available through the connector. Local checks used the fetched/verified
changed-file subset, not a claimed complete checkout. No credentials were read.
CI outcomes belong to the PR checks and are not predicted by this receipt.

The pre-edit blob IDs were `b0a4456acc0bc3c5325bc314b4e822e34c924fbf`
for `evals/go/cases.json` and `0c4f29cb03ab86e77964ae99df89ee5fdb55081c`
for `evals/go/README.md`. Changes to the legacy corpus are limited to the routing
contrast and its entry-point documentation; no old source packet was rewritten.

## Compilation procedure

Use the numbered sections and the `### path`/fenced-file parser in
`tests/go_quality_depth_test.py` (`sections` and `SOURCE_BLOCK`). Materialize each
section into its own fresh temporary directory. For each `go.mod` in that section,
run `go build ./...` from its parent with `GOTOOLCHAIN=local`, `GOPROXY=off`,
`GOSUMDB=off`, `GOWORK=off`, and `CGO_ENABLED=0`. No dependencies are downloaded.
Do not merge identically named files from different sections. GD13 additionally
received the explicit fallback file-list compilation noted above. These checks
compiled the supplied source, not every possible reviewer-proposed replacement,
and do not prove behavioral equivalence or a quality judgment.

## Evidence identity

SHA-256 identifies the checked input/test text, not model execution. The receipt
itself is intentionally not self-hashed. Repo paths are relative to the PR root.

| File | SHA-256 |
| --- | --- |
| `evals/go/quality-depth/packets.md` | `83ff510e8a29797a6824f3fbb1cfea112fdb863d5544a0759d3ac76630454805` |
| `evals/go/quality-depth/cases.json` | `d6141fcda097eed3f05ee23ff70b7f5eb96b8bef23f00728cb2ff3d847069396` |
| `tests/go_quality_depth_test.py` | `ade1dc393f7bc19e022ae9422ab21e91fefe67c61d5a1e774aba5831fd4b91fe` |
| `tests/go-quality-depth.test.ts` | `e1c3ada3c3e60e3a72bbd8b1af417430b624af7ad4f6fdd8df1db730737c7242` |
| `evals/go/cases.json` | `b444d33bc92fe38d6b3eab675c12f7d45445d543171ebed4b58bc76d2405a699` |

## Behavioral claims withheld

`quality-depth/cases.json` remains `proposed-not-model-executed`. New inputs must
first exercise unchanged baseline instructions. A future candidate comparison
requires identical source/scope/policy/tools, actual model/effort, independent
contexts, raw outputs including failures, and retained clear-code controls.
Mechanical passing results establish fixture integrity only. Neither this patch
nor source-backed correction of the stale routing expectation establishes a
Go-specific model-quality gain, live delegation or a general improvement score.
