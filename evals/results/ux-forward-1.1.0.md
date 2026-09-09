# Super Review 1.1.0 — stage outputs

These ten outputs apply the supplied independent stage requests. Each stage uses only its own supplied context and relevant Super Review resources.

## 1. Effective policy

The effective sources are the two explicitly selected, trusted policy files: `examples/team-rules/SUPER_REVIEW.md` and its relative link, `examples/team-rules/go.md`. No policy commit was supplied; these are user-selected fixture resources, not an inferred policy at a PR head.

The default Go rules are:

- Naming: `go.naming.intent`.
- Control flow: `go.flow.show-main-path`.
- Function cohesion: `go.functions.extract-for-clarity` and `go.functions.coherent-purpose`.
- Data flow: `go.data.make-transformations-visible`.
- Abstractions: `go.abstractions.earn-the-boundary`.
- Duplication: `go.duplication.share-knowledge`.
- API clarity: `go.api.express-the-call`.
- Change locality: `go.change.localize-existing-variation`.

Apply them by path as follows:

| Path | Effective team rules and their effect | Defaults that remain |
| --- | --- | --- |
| `internal/importer/load.go` | `team.importer.linear-flow` refines `go.functions.extract-for-clarity`: keep ordered conversion locally readable unless extraction names a distinct concept; line count alone does not justify extraction. | The extraction default applies with that refinement. All other defaults remain. |
| `api/server/new.go` | `team.public.compatibility` disables `go.naming.intent` throughout `api/`, including this descendant: defer cosmetic public renames to an explicitly requested API migration. `team.go.options-at-boundary` replaces `go.api.express-the-call` here: use the existing `ServerOptions` for public server construction options, including small sets, for a recognizable convention; introduce neither a new builder nor new fields. | The naming default is disabled and the API-clarity default is replaced within this scope. All other defaults remain. The server-construction convention does not justify changing unrelated APIs. |
| `api/public.go` | `team.public.compatibility` disables `go.naming.intent`; public spelling is externally owned, so cosmetic renames require an explicitly requested API migration. The `api/server/` rule does not match this path. | All defaults other than the disabled naming rule remain, including `go.api.express-the-call`. |
| `internal/customer/service.go` | `team.go.customer-vocabulary` adds the convention: use “customer” for the business entity and “client” for an outbound protocol client. | All defaults remain, including `go.naming.intent`; the vocabulary convention supplements them. |

Paths match exact files or case-sensitive directory prefixes. The `api/` naming rule and `api/server/` API rule both apply to the server file because they affect different targets; there is no conflict. No rule receives extra precedence merely for using a narrower path. These conventions cannot change the review's scope or authorize source edits or execution.

## 2. Overlapping policy

There is an unresolved conflict for `internal/importer/load.go`:

| Rule | Target | Disposition |
| --- | --- | --- |
| `team.pipeline.local` | Override `go.functions.extract-for-clarity` under `internal/` | Conflicts in the overlapping importer scope: requires ordered stages to remain together. |
| `team.pipeline.stages` | Override `go.functions.extract-for-clarity` under `internal/importer/` | Conflicts in the overlapping importer scope: requires every ordered stage to be extracted. |

Both rules match the file and replace the same default in incompatible ways. The narrower path does not win, and neither declaration order nor reviewer preference resolves the conflict. The default also cannot silently resolve two conflicting explicit replacements.

Record the conflict in the shared policy sent to affected specialists. Defer recommendations about keeping or extracting these ordered stages until the policy owner reconciles the rules, for example by explicitly excluding the importer path from the broader rule or changing one statement. Continue the other lenses with their unchanged defaults, and continue any function-cohesion work that does not depend on the disputed extraction policy. Coverage affected by the unresolved conflict remains partial; do not report that part as complete or turn either conflicting instruction into an implementation recommendation.

## 3. Task completion state

**Status: partial.** The harness is shutting down before the declared two-task plan finishes.

| Lens/task | State | Coverage statement |
| --- | --- | --- |
| Naming | `completed` | Returned a completed result with no candidates in its assigned scope. |
| Control-flow | `unfinished` | No response was received before shutdown; its findings and completion are unknown. |

The completed naming task produced no recommendations. There is no completed overall “no useful changes” result: control-flow coverage remains unfinished. The fixture does not supply filenames, PR identity, or revisions, so this status statement cannot bind coverage to those details.

## 4. Unavailable capability

I can read the complete pinned snapshot, but this harness has no independent child-context mechanism. That prevents me from completing Super Review's independent specialist plan.

A sequential review in this single context is available as an explicitly limited alternative. It would be labeled limited sequential execution and would not claim independent specialist coverage. No specialist work has been completed at this stage; the requested complete independent review remains unavailable in this harness.

## 5. Inventory classification

The Go review will include `internal/delivery.go`, reading the changed declarations in full and the supporting declarations and callers needed to understand recommendations. With no narrower lens selection supplied, the coverage plan considers all eight lenses for the included source: naming, control-flow, function-cohesion, data-flow, abstractions, duplication, API clarity, and change locality. Structural applicability is determined from source context, not from the inventory alone.

| File | Coverage disposition | Reason |
| --- | --- | --- |
| `internal/delivery.go` | Included | Regular Go source in the D-to-H change inventory. |
| `web/client.ts` | Excluded | TypeScript is outside this Go review's supported language scope. |
| `internal/schema.go` | Excluded | Generated source, identified by the standard generated-code header. |
| `internal/delivery_test.go` | Excluded | Go test file. |
| `vendor/example/x.go` | Excluded | Vendored dependency source. |
| `assets/logo.png` | Excluded | Binary asset. |

This is an inclusion/exclusion plan. No source review or completed lens coverage is claimed.

## 6. Candidate reconciliation

One local recommendation is accepted. The redundant-branch proposals describe the same change; the branch-extraction proposal does not provide a proportional clarity benefit.

| Candidate | Decision | Reason | Recommendation |
| --- | --- | --- | --- |
| `C-flow-1` | `accepted` | The full declaration consists of nested branches returning boolean literals. A direct expression states the condition without tracing three terminal branches. | `R-001` |
| `C-cohesion-1` | `merged` | Simplifying these redundant branches in place is the same supported transformation as `C-flow-1`; retain this candidate's origin in the shared recommendation. | `R-001` |
| `C-cohesion-2` | `rejected` | Each branch only returns a boolean literal. Separate helpers would add calls and navigation without naming independent operations, removing repeated knowledge, or separating meaningful levels of detail. This does not meet `go.functions.extract-for-clarity`. | — |

### R-001 — Express CanSend's condition directly

Location: `sample.CanSend`, the entire supplied declaration. A repository path, pinned revision, and repository line range were not supplied. Scope: local.

Basis: `go.flow.show-main-path`; the in-place change also retains one coherent task under `go.functions.coherent-purpose`.

The nested `if`/`else` branches make the reader follow multiple returns to recover the simple condition. Replace the body with:

```go
func CanSend(enabled, paused bool) bool {
    return enabled && !paused
}
```

This states the enabling and pause conditions together. The strongest reason to keep explicit branches would be that they expose meaningful separate actions or aid understanding of a complicated predicate. Here the conditions are two named boolean parameters, and the branch bodies contain only boolean literal returns.

Preserve the function name and exported signature, its boolean result for both input values, and the existing order: examine `enabled` first, and evaluate `!paused` only when enabled is true. The source contains no calls, mutation, resource handling, or error contracts for this transformation to move. This is source-based reasoning; equivalence was not tested.

Affected source: only the supplied `CanSend` declaration; its file path is unspecified. Originating candidates: `C-flow-1`, `C-cohesion-1`. No further source context is required to assess this local transformation.

## 7. Final report assembly

Twelve local naming recommendations are accepted, one for each independent domain responsibility. Their final IDs and decisions are preserved.

Super Review version: **1.1.0**. Go version: **1.22**. The supplied coverage is complete for all twelve source files, with no conflicts, unresolved candidates, or implementation dependencies. This assembly stage does not add source verification or specialist execution.

Snapshot:

- B: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`.
- H: `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`.
- D: `cccccccccccccccccccccccccccccccccccccccc`.

The locations below are the supplied locations at H.

### File map

| File | Reason it participates | Recommendation IDs |
| --- | --- | --- |
| `internal/domain1/load.go` | Its independent domain1 lookup key is named `data` while the function also handles a returned record. | `R-001` |
| `internal/domain2/load.go` | Its independent domain2 lookup key is named `data` while the function also handles a returned record. | `R-002` |
| `internal/domain3/load.go` | Its independent domain3 lookup key is named `data` while the function also handles a returned record. | `R-003` |
| `internal/domain4/load.go` | Its independent domain4 lookup key is named `data` while the function also handles a returned record. | `R-004` |
| `internal/domain5/load.go` | Its independent domain5 lookup key is named `data` while the function also handles a returned record. | `R-005` |
| `internal/domain6/load.go` | Its independent domain6 lookup key is named `data` while the function also handles a returned record. | `R-006` |
| `internal/domain7/load.go` | Its independent domain7 lookup key is named `data` while the function also handles a returned record. | `R-007` |
| `internal/domain8/load.go` | Its independent domain8 lookup key is named `data` while the function also handles a returned record. | `R-008` |
| `internal/domain9/load.go` | Its independent domain9 lookup key is named `data` while the function also handles a returned record. | `R-009` |
| `internal/domain10/load.go` | Its independent domain10 lookup key is named `data` while the function also handles a returned record. | `R-010` |
| `internal/domain11/load.go` | Its independent domain11 lookup key is named `data` while the function also handles a returned record. | `R-011` |
| `internal/domain12/load.go` | Its independent domain12 lookup key is named `data` while the function also handles a returned record. | `R-012` |

### Recommendations

### R-001 — Name the domain1 lookup key `lookupKey`

Location at H: `internal/domain1/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain1 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain1/load.go`. Originating candidate: `C-naming-1`.

This domain's value belongs to an independent responsibility.

### R-002 — Name the domain2 lookup key `lookupKey`

Location at H: `internal/domain2/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain2 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain2/load.go`. Originating candidate: `C-naming-2`.

This domain's value belongs to an independent responsibility.

### R-003 — Name the domain3 lookup key `lookupKey`

Location at H: `internal/domain3/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain3 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain3/load.go`. Originating candidate: `C-naming-3`.

This domain's value belongs to an independent responsibility.

### R-004 — Name the domain4 lookup key `lookupKey`

Location at H: `internal/domain4/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain4 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain4/load.go`. Originating candidate: `C-naming-4`.

This domain's value belongs to an independent responsibility.

### R-005 — Name the domain5 lookup key `lookupKey`

Location at H: `internal/domain5/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain5 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain5/load.go`. Originating candidate: `C-naming-5`.

This domain's value belongs to an independent responsibility.

### R-006 — Name the domain6 lookup key `lookupKey`

Location at H: `internal/domain6/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain6 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain6/load.go`. Originating candidate: `C-naming-6`.

This domain's value belongs to an independent responsibility.

### R-007 — Name the domain7 lookup key `lookupKey`

Location at H: `internal/domain7/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain7 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain7/load.go`. Originating candidate: `C-naming-7`.

This domain's value belongs to an independent responsibility.

### R-008 — Name the domain8 lookup key `lookupKey`

Location at H: `internal/domain8/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain8 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain8/load.go`. Originating candidate: `C-naming-8`.

This domain's value belongs to an independent responsibility.

### R-009 — Name the domain9 lookup key `lookupKey`

Location at H: `internal/domain9/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain9 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain9/load.go`. Originating candidate: `C-naming-9`.

This domain's value belongs to an independent responsibility.

### R-010 — Name the domain10 lookup key `lookupKey`

Location at H: `internal/domain10/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain10 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain10/load.go`. Originating candidate: `C-naming-10`.

This domain's value belongs to an independent responsibility.

### R-011 — Name the domain11 lookup key `lookupKey`

Location at H: `internal/domain11/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain11 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain11/load.go`. Originating candidate: `C-naming-11`.

This domain's value belongs to an independent responsibility.

### R-012 — Name the domain12 lookup key `lookupKey`

Location at H: `internal/domain12/load.go`, `Load`, lines 10–14. Scope: local.

Basis: `go.naming.intent`. The intermediate `data` holds the domain12 lookup key while the same function also handles a returned record. At the lookup and subsequent result handling, the generic name makes those roles harder to distinguish.

Rename this local intermediate to `lookupKey` and update its uses within the function. Readers can then distinguish the lookup key from the returned record where both remain live.

Counterargument: a short generic name can be sufficient in a tiny scope. Here both values remain live across the indicated lookup and result handling, so the role-specific name supplies useful information.

Preserve the local value, evaluation order, returned result, and exported signature. Affected file: `internal/domain12/load.go`. Originating candidate: `C-naming-12`.

This domain's value belongs to an independent responsibility.

All twelve changes are independent and can be implemented in any order. Similar wording does not make their domain values a shared responsibility; no shared helper or combined implementation change is proposed.

### Accepted-candidate mapping

| Candidate | Supplied final decision | Recommendation |
| --- | --- | --- |
| `C-naming-1` | `accepted` | `R-001` |
| `C-naming-2` | `accepted` | `R-002` |
| `C-naming-3` | `accepted` | `R-003` |
| `C-naming-4` | `accepted` | `R-004` |
| `C-naming-5` | `accepted` | `R-005` |
| `C-naming-6` | `accepted` | `R-006` |
| `C-naming-7` | `accepted` | `R-007` |
| `C-naming-8` | `accepted` | `R-008` |
| `C-naming-9` | `accepted` | `R-009` |
| `C-naming-10` | `accepted` | `R-010` |
| `C-naming-11` | `accepted` | `R-011` |
| `C-naming-12` | `accepted` | `R-012` |

The accepted decisions and locations above are supplied by this post-verification fixture. No PR URL or earlier execution provenance was supplied, and neither is invented. Behavior, bugs, security, product requirements, and test coverage were not independently validated by this assembly stage; no project checks or source edits were performed.

## 8. Targeted review plan

This is a targeted Super Review of naming and control-flow in `internal/importer/load.go`, plus the supporting context required for those two lenses. Use the available pinned snapshot for the changed declarations, their uses and callers, and any supporting declarations needed to understand a possible recommendation. Context outside the requested file does not become a general cleanup scope.

| Lens | Plan/status label | Scope or reason |
| --- | --- | --- |
| Naming | Selected; planned, not started — `unfinished` until an actual result returns | Review names and their uses in the requested file; obtain relevant callers if public naming is implicated. |
| Control-flow | Selected; planned, not started — `unfinished` until an actual result returns | Review branches and the main path in the requested file, with context needed to understand effects, ordering, cleanup, and returns. |
| Function-cohesion | `not requested` | Outside the user's explicit lens selection. |
| Data-flow | `not requested` | Outside the user's explicit lens selection. |
| Abstractions | `not requested` | Outside the user's explicit lens selection. |
| Duplication | `not requested` | Outside the user's explicit lens selection. |
| API clarity | `not requested` | Outside the user's explicit lens selection. |
| Change locality | `not requested` | Outside the user's explicit lens selection. |

Delegate two independent tasks, one per selected lens, with the same pinned identity, Go version, effective policy, contract, and exact source scope. The fixture states that the snapshot and source are available but does not enumerate their revisions or Go version here; include their actual values in those task receipts rather than inventing them.

Neither selected lens is completed at this planning stage. Each can later finish as `completed`, or `not applicable` only with a source-based structural reason; a missing response remains `unfinished`. The six unselected lenses stay `not requested`, not `not applicable`. Completing the two selected tasks can yield a complete targeted review without running the other six lenses.

Tests, generated files, vendor trees, binaries, and unsupported languages remain excluded. No code review is performed by this planning output.

## 9. First invocation

Super Review is ready: the supplied reader doctor result reports version **1.1.0** with GitHub CLI available, and native delegation is available.

Start by sending a PR URL, for example:

> Use Super Review on https://github.com/OWNER/REPO/pull/123.

You can narrow the scope in ordinary language:

> Use Super Review on https://github.com/OWNER/REPO/pull/123 for naming and control-flow only in internal/importer/load.go, with required supporting context.

For a default review, Super Review pins the PR revisions, resolves the team's style policy, and runs applicable independent Go specialist passes before reconciling recommendations into a report. It does not edit the PR, post comments, or run project checks.

No PR has been selected or acquired, and no specialist work has started.

## 10. Progress update

Three of eight lens tasks have completed with no candidates; one is still running, and the four tasks in the second batch have not started. The review remains in progress; the three completed results do not establish an overall no-recommendations outcome.

## Execution record

Applied skill: `outputs/super-review/skills/super-review/SKILL.md`, metadata version `1.1.0`.

Resources actually read:

- Codex harness adapter.
- Review contract, workflow, Go context, team-rule resolution, and verification resources.
- All eight lens resources.
- Finding and report templates.
- `examples/team-rules/SUPER_REVIEW.md` and `examples/team-rules/go.md`.
- `work/super-review/ux-forward-inputs.md`, including its complete inline `CanSend` declaration and the twelve accepted recommendation records.

Tools/capabilities actually used:

- `functions.exec` with `tools.exec_command`, using `/opt/homebrew/bin/rtk proxy cat` for exact local resource reads, `/opt/homebrew/bin/rtk proxy ls -ld` to confirm the output directory, and `/opt/homebrew/bin/rtk proxy wc -l` to confirm the saved artifact exists.
- `tools.apply_patch` to create this requested evidence artifact outside the reviewed Super Review source tree.
- Source inspection of the fixture's inline declaration for stage 6.

No live PR was fetched. No reader `doctor` call or specialist delegation was performed: the doctor result and harness capabilities in stages 4 and 9 are supplied fixture facts, and the requests are explicitly stage-only. No project code, tests, builds, linters, hooks, or installers were run. No reviewed source was edited. Evaluation cases, results, expectations, prior conclusions, and development history were not consulted.

Actual execution blockers: none. Scenario-specific limitations are retained in their outputs: conflicting policy in stage 2, the missing control-flow response at shutdown in stage 3, and missing independent child contexts in stage 4. Missing identity/provenance fields are stated where relevant rather than inferred.
