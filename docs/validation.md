# Validation

## 2.0.0 — explicit specialist profiles

The [model study](model-study.md) records 24 blind-graded Codex screen replies,
two complete live smaller-worker reviews, the final Terra/medium candidate
review, and the Claude nested routing probe. All eight candidate child records
confirm Terra/medium; the parent retains Astra/medium. The candidate completed
in 338.23 seconds. Claude model inference remains unverified. The OpenCode
launcher rejects missing/malformed worker IDs and preserves saved/overridden
selections. Native OpenCode discovery confirms the supplied worker model.

Mechanical checks: 21 tests, 84 assertions, TypeScript diagnostics, native
payload/link checks, shellcheck, and native MCP/OpenCode configuration checks
pass. These checks do not prove model recommendation quality.


## 1.1.0 — native installation and workflow

Recorded 2026-09-09. The runtime reader and core workflow used by the completed
Codex review match the release candidate byte-for-byte.

- **Codex CLI 0.153.4, GPT-6 Astra:** the installed plugin completed all eight
  independent specialist passes for PR 300, scoped to
  `internal/infra/httpclient/propagation.go` and necessary context. Exit 0 after
  **395.5 seconds**. The report correctly included version 1.1.0 and began with
  its no-recommendations outcome.
- **Source sharing:** an initial native child failed on the original process-local
  receipt. After adding the private shared cache, a fresh independent child read
  head `go.mod` using its parent's receipt and returned the exact pinned H. That
  focused native check exited 0 after 70.5 seconds.
- **Claude Code 2.1.227:** native validation and component inspection recognized
  one `review` skill, two agents, and one reader. Native startup connected the
  reader and exposed only delegation plus reader tools to the orchestrator,
  and four reader operations to the specialist. No shell/edit/unrelated MCP
  tool appeared in either review role.
- **Claude model execution remains unverified:** the local CLI had no usable model
  authentication. Native plugin startup and tool discovery succeeded, but no
  model-backed Claude review was executed. These startup checks are not a
  completed Claude review.
- **Behavior:** an independent Codex agent received ten raw stage requests without
  a rubric or prior results. Policy resolution, conflict handling, incomplete
  coverage, reconciliation, all twelve accepted report entries, targeted lenses,
  first-use guidance, and truthful batch progress met their tested expectations.
  These are stage tests, not ten end-to-end reviews or an external benchmark.
- **Mechanics:** 21 tests and 82 assertions passed, including cross-reader snapshot
  reuse, expiry, unissued receipts, source/path restrictions, private cache access,
  symlink refusal, MCP discovery, and resource traversal rejection. Node stdio
  transport loaded the bundled reader without installing consumer dependencies.
- **OpenCode:** the launcher preserved arguments and selected the installed config
  and trusted working directory. Native permission/routing checks are retained.

Evidence:

- [Codex report](https://github.com/Dankosik/super-review/blob/v1.1.0/evals/results/codex-pr-300-1.1.0.md)
  and [native receipt](https://github.com/Dankosik/super-review/blob/v1.1.0/evals/results/native-receipt-1.1.0.json).
- [Stage inputs](https://github.com/Dankosik/super-review/blob/v1.1.0/evals/go/packets/workflow-ux.md)
  and [actual outputs](https://github.com/Dankosik/super-review/blob/v1.1.0/evals/results/ux-forward-1.1.0.md).

Timing comes from one scoped run on one machine and model; it is not a speed
comparison with 1.0.0 or a completion guarantee for arbitrary PRs. No recommendation
quality score is established by this small case set. Authentication, native
configuration, source acquisition, model behavior, and release integrity remain
separate claims.

---

# 1.0.0 evidence (historical)

Recorded on 2026-09-09 (Europe/Moscow) for Super Review 1.0.0. Mechanical
checks, model behavior, and native execution are separate evidence.

## Mechanical checks

- Bun 1.4.1: 16 source-reader tests, 61 assertions, all passed.
- TypeScript diagnostics, skill/resource links, nine stable rule IDs, version
  alignment, command routing, and GitHub Actions syntax passed.
- `bun audit`: no known vulnerabilities reported across 57 packages at check time.
- Source-reader tests cover distinct B/H/D, fork and closed PRs, moving heads,
  immutable policy, pagination, API caps, exclusions, literal search, invalid
  paths/endpoints, explicit missing context, and expired receipts.
- Both release ZIPs passed archive integrity and internal Markdown-link checks;
  the complete adapter contains the exact standalone skill payload.
- Cache regression: two scans of 80 distinct small files perform 80 blob reads
  in total; one search page has at most four concurrent uncached reads.

These are adapter tests, not a score for review quality.

## Blind behavioral fixtures

Independent Codex agents used the default GPT-6 Astra model, without receiving
`cases.json`, expected answers, or development history. The offline PR review
used eight fresh specialist contexts, one per lens. Separate stage requests
exercised policy, incomplete execution, reconciliation, and report assembly.
The implementing agent inspected and graded the saved outputs against the rubric;
this is development evaluation, not a blinded external benchmark.

| Case | Observed result |
| --- | --- |
| Clear code | Left `DisplayName` alone. |
| Local control flow | Accepted the local `CanSend` boolean simplification. |
| Real boundary | Retained the consumer interface and useful error context. |
| Different knowledge | Did not merge independently owned matching predicates. |
| Team actions | Applied add/refine/override/disable only in matching scopes. |
| Rule conflict | Reported overlap, deferred affected advice, continued unaffected lenses. |
| Head policy | Applied B policy; disclosed and ignored the proposed H instructions. |
| Unfinished specialist | Kept the missing task unfinished and the report partial. |
| No delegation | Identified the missing capability; did not pretend independence. |
| Mixed language | Included Go and disclosed test/generated/vendor/binary/language exclusions. |
| Reconciliation | Accepted one change, merged its duplicate, rejected the conflicting extraction. |
| Report completeness | Kept all twelve accepted IDs in the detailed report and file map. |

All twelve named scenarios met their tested semantic expectations. The team
policy scenario tests rule resolution; installation/update preservation is a
separate packaging and tool-permission property. The seven stage requests are
stage-level evidence, not seven complete PR reviews. The offline packet uses
synthetic revisions and does not exercise GitHub acquisition.

Inputs and unabridged outputs:

- [Offline PR input](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/go/packets/pr-1.md)
  and [report](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/results/offline-pr-1.md).
- [Stage inputs](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/go/packets/workflow-stages.md)
  and [outputs](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/results/workflow-forward.md).

The offline PR run preceded the final three-line clarification to gather shared
context before delegation; its contract, lenses, team policy, and verification
resources match the release. The stage run used the final core workflow. The
native run below used the final core and source-reader implementation; version
exposure was corrected afterward and checked separately. Runtime
file hashes are retained in the evaluation receipt.

## Native OpenCode execution

OpenCode **1.18.29** was checked on macOS; CI also runs the native configuration
check on Linux. Native inspection confirms packaged skill discovery, the primary
command, delegation availability, and denial of shell/read/edit/web tools plus
an unknown custom tool. Specialists cannot delegate or open another PR.

The completed live run used existing harness authentication and **xai/grok-4.6**
on [PR 300](https://github.com/Dankosik/go-service-template-rest/pull/300), scoped
to `internal/infra/httpclient/propagation.go` and required source context:

- Exit 0 after **519.2 seconds**; all eight distinct native Task children returned.
- Two batches of four specialists; final scoped report had no candidates.
- Test-only caps were 96 primary steps, 18 specialist steps, and 600 seconds.
  The abstractions child reached its step cap but returned its inspected evidence
  and completed lens result; optional global constructor paging remained disclosed.
- The report failed to show the skill version because native skill loading omits
  frontmatter. The existing resource tool now exposes `SKILL.md`, and the primary
  role reads its metadata. A separate native check loaded that resource and
  reported **1.0.0**, exiting 0 after 22.4 seconds.
- [Original report](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/results/opencode-pr-300.md)
  and [execution receipt](https://github.com/Dankosik/super-review/blob/v1.0.0/evals/results/opencode-receipt.json)
  retain the observed outcome, including that version defect.

Two earlier trials with `xai/grok-build-0.1` did **not** complete the full plan:
one reached its 48-step cap and one hit the 600-second timeout. They also exposed
repeated sequential source fetching, which led to the cache/concurrency correction.
Model choice and step limits materially affect completion. These differently
configured trials are not a controlled model or performance comparison.

## Limits

This case set is small and mostly synthetic; it does not establish a general
quality score or dependable completion for arbitrary models and PR sizes.
Other harnesses and GitHub Enterprise are unverified. GitHub inventory/tree caps,
missing context, or failed specialists must still produce partial coverage.
Read-only tool permissions are not an OS sandbox. No behavioral equivalence,
security assessment, test coverage, or deployment correctness is claimed.
