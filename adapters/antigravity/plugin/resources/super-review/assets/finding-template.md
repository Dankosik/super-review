# Specialist result

Return compact Markdown: one task header, then candidate blocks. Common fields
apply to every candidate; do not repeat them per block. Keep this header attached
when forwarding a candidate, or include its identity when the block travels alone.

## Task result: <task ID>

- Snapshot: PR and B/H/D, or local target, selected view and both endpoint
  identities (commit, index blobs or working-file hashes); source location.
- Instructions: version and trusted package revision/resource digest when exposed,
  or `content identity unverified`, under the contract's instruction-identity rules.
- Assignment: lens or compact pair, selected profiles, exact scope and effective
  policy references.
- Status: `completed`, `not applicable`, or `unfinished`; adapter enums keep their
  native spelling. For non-applicability give a structural reason.
- Inspected evidence: verified paths/revisions, complete symbols and relevant uses.
- Coverage: base/profile results, actual completed subcoverage, and missing required
  evidence/capability, for each lens of a pair separately. A profile-only task is
  not a full owner pass.
- New applicability signals: aspect, path/symbol, observed fact and missing question,
  or `none`. Signals are not findings or completed checks.

With no candidates, state that explicitly after the header. Missing required
coverage remains `unfinished`, never an empty clean result.

## C-<task>-<number>: <concrete observation>

- Change anchor: verified path, symbol and [endpoint](../references/harnesses/source-access.md#file-boundaries-and-source-anchors) (`H`/new for surviving code, `D`/old for deletions, both on renames, or declared local/snapshot view), with source lines or a short verbatim span, plus how the change introduces or exposes the burden.
- Basis: effective rule IDs and contributing profiles; mark convention-only advice.
- Observation: quoted source evidence and the concrete reading or maintenance burden, using [the contract's vocabulary](../references/review-contract.md#vocabulary) (`load-bearing`, `seam`, `shallow`, smells) where a term fits.
- Remedy: direct supported improvement (with a minimal type/signature sketch when shape is the point, and the strongest source-backed reason to keep the current form), or `unresolved` naming the exact missing fact or team decision.
- Next change (structural or cross-file recommendations only; omit for local edits): one realistic change from existing variation (for example, adding a state, rule, or outcome), edit sites before -> after, and whether the compiler catches missed sites.
- Preserve: implicated contracts, effects, observable changes (`none` or what callers/operators/logs see differently) and any precondition.
- Affected files: verified edit sites (including excluded tests or callers forced to update), distinguishing inspected consumers from still-needed context, or `none`.

Prefer verified paths and symbols to guessed lines. State evidence and tradeoffs, not a reasoning transcript.
