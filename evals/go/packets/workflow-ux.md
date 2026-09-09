# Workflow inputs

These are independent synthetic stage-level requests, not live PRs. Apply the
Super Review skill's relevant stage to each. Do not read an evaluation rubric
or fetch fictional remote URLs. Read source only where supplied or linked below.
Use numbered answers; do not run a complete PR workflow for a stage-only request.

## 1. Effective policy

Resolve the effective style policy for internal/importer/load.go, api/server/new.go,
api/public.go, and internal/customer/service.go using the following trusted
policy resources:
- examples/team-rules/SUPER_REVIEW.md
- examples/team-rules/go.md

Describe which defaults and team rules apply at each path.

## 2. Overlapping policy

Resolve policy for internal/importer/load.go with both trusted rules:

### team.pipeline.local
Language: Go
Paths: internal/
Lens: function-cohesion
Action: override go.functions.extract-for-clarity

Keep all ordered transformation stages together so their sequence stays local.

### team.pipeline.stages
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: override go.functions.extract-for-clarity

Always extract each ordered transformation stage into a separate helper so its
name marks the stage.

Other lenses have no additional team rules. Produce the policy disposition and
explain how the review should proceed from this stage.

## 3. Task completion state

The declared plan has two tasks. Naming returned completed with no candidates.
Control-flow has not returned a response. The review must stop now because the
harness is shutting down. Produce the report's status and coverage statements.

## 4. Unavailable capability

A user explicitly requests a complete Super Review of a Go PR. This fixture
harness can read a complete pinned snapshot but has no independent child-context
mechanism. Respond to the user about execution.

## 5. Inventory classification

Classify this D-to-H inventory for a Go review:
- internal/delivery.go: regular Go source.
- web/client.ts: regular TypeScript source.
- internal/schema.go: Go source with the standard generated-code header.
- internal/delivery_test.go: Go test.
- vendor/example/x.go: a dependency's Go source.
- assets/logo.png: binary.

Provide the coverage plan's inclusion/exclusion statements, without performing
a code review at this stage.

## 6. Candidate reconciliation

Use this complete declaration:
```go
package sample
func CanSend(enabled, paused bool) bool {
    if enabled {
        if !paused { return true } else { return false }
    } else { return false }
}
```

At this stage specialists have returned:
- C-flow-1: Replace the nested pure boolean branches with a direct expression.
- C-cohesion-1: Simplify CanSend's redundant branches in place.
- C-cohesion-2: Extract each branch into its own helper.

Verify and reconcile these candidates; return the decisions and accepted
recommendation(s). This fixture supplies the entire source context.

## 7. Final report assembly

This stage starts after verification and reconciliation. The following
recommendations are already accepted and their IDs are final. Preserve those
decisions; assemble the detailed recommendation section and file map. This
stage does not require further source acquisition or specialist work.

Synthetic snapshot: B=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, H=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, D=cccccccccccccccccccccccccccccccccccccccc.
Go 1.22. Coverage is complete for all twelve source files. No conflicts,
unresolved candidates, or implementation dependencies remain.

### R-001
Location at H: internal/domain1/load.go, Load, lines 10-14.
Candidate: C-naming-1.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain1 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain1/load.go.
This domain's value belongs to an independent responsibility.

### R-002
Location at H: internal/domain2/load.go, Load, lines 10-14.
Candidate: C-naming-2.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain2 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain2/load.go.
This domain's value belongs to an independent responsibility.

### R-003
Location at H: internal/domain3/load.go, Load, lines 10-14.
Candidate: C-naming-3.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain3 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain3/load.go.
This domain's value belongs to an independent responsibility.

### R-004
Location at H: internal/domain4/load.go, Load, lines 10-14.
Candidate: C-naming-4.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain4 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain4/load.go.
This domain's value belongs to an independent responsibility.

### R-005
Location at H: internal/domain5/load.go, Load, lines 10-14.
Candidate: C-naming-5.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain5 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain5/load.go.
This domain's value belongs to an independent responsibility.

### R-006
Location at H: internal/domain6/load.go, Load, lines 10-14.
Candidate: C-naming-6.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain6 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain6/load.go.
This domain's value belongs to an independent responsibility.

### R-007
Location at H: internal/domain7/load.go, Load, lines 10-14.
Candidate: C-naming-7.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain7 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain7/load.go.
This domain's value belongs to an independent responsibility.

### R-008
Location at H: internal/domain8/load.go, Load, lines 10-14.
Candidate: C-naming-8.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain8 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain8/load.go.
This domain's value belongs to an independent responsibility.

### R-009
Location at H: internal/domain9/load.go, Load, lines 10-14.
Candidate: C-naming-9.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain9 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain9/load.go.
This domain's value belongs to an independent responsibility.

### R-010
Location at H: internal/domain10/load.go, Load, lines 10-14.
Candidate: C-naming-10.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain10 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain10/load.go.
This domain's value belongs to an independent responsibility.

### R-011
Location at H: internal/domain11/load.go, Load, lines 10-14.
Candidate: C-naming-11.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain11 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain11/load.go.
This domain's value belongs to an independent responsibility.

### R-012
Location at H: internal/domain12/load.go, Load, lines 10-14.
Candidate: C-naming-12.
Rule: go.naming.intent.
Observation: an intermediate named `data` holds the domain12 lookup key;
the same function also handles a returned record.
Transformation: rename that local intermediate to `lookupKey`.
Benefit: distinguish the key from the returned record at its uses.
Counterargument: short names are sufficient in tiny scopes; here both values
remain live across the indicated lookup and result handling.
Preserve: local value, evaluation order, returned result, and exported signature.
Affected files: internal/domain12/load.go.
This domain's value belongs to an independent responsibility.

## 8. Targeted review plan

The user explicitly requests: "Use Super Review for the naming and control-flow
aspects only, in internal/importer/load.go and required supporting context."
The PR snapshot and complete source are available; no other aspect is requested.
Produce this stage's coverage plan and the status labels to use for each lens.
Do not perform code review at this planning stage.

## 9. First invocation

The user invokes Super Review without a PR URL and asks "How do I start?".
The installed reader tools and native delegation are available. The reader's
doctor result is version 1.1.0, GitHub CLI available. Respond to the user at this
stage; no PR has been selected or acquired.

## 10. Progress update

A declared eight-lens plan is running. Three lenses have returned completed
results with no candidates; one is still running. The second batch has not
started. Produce one brief progress update based only on that state.
