<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT16

- Snapshot: local whole-project snapshot from packet CT16 (no B/H/D); source `server/limits.go` plus supplied chart files.
- Instructions: content identity unverified (installed copy at `.../scratchpad/dup/candidate/skills/super-review`).
- Assignment: lens duplication (`go.duplication.share-knowledge`), no profiles, scope `server/limits.go`, no team override.
- Status: completed
- Inspected evidence: `go.mod` (go 1.24), `server/limits.go` (`maxBodyBytes`, `limitBody`), `deploy/chart/values.yaml`, `deploy/chart/templates/ingress.yaml`, `deploy/chart/templates/deployment.yaml`.
- Coverage: Searched the decision "maximum request body size". Keys: `MAX_BODY_BYTES`, `maxBodyBytes`, `proxy-body-size`, and the value `1<<20` / `1048576`. The chart value feeds both the ingress and the env var. I read the env-to-Go-default direction and found one partner copy. No other Go source in the snapshot repeats the limit.
- New applicability signals: none

## C-CT16-1: The Go fallback body limit repeats the chart's 1 MiB default

- Change anchor: `server/limits.go`, `maxBodyBytes`, in the whole-project snapshot. The span `return 1 << 20` appears twice, in the error branch and on the return path. The partner is `deploy/chart/values.yaml`: `maxBodyBytes: 1048576`.
- Basis: `go.duplication.share-knowledge`. This is not convention-only advice.
- Observation:
  - The chart's single `maxBodyBytes` value feeds two places. One is the ingress `proxy-body-size` annotation. The other is the `MAX_BODY_BYTES` env var that `maxBodyBytes()` reads. Both are the same limit, and their values are identical. The chart is the single source of truth for the limit across deployments.
  - The Go code holds a second statement of the same default: `1 << 20` equals 1048576. Changing the limit in the chart does not update the Go value, so it is a separate edit.
  - The context says the Go default applies only to local runs. That makes the fallback a silent second owner of the limit for local runs only.
  - It is a divergence risk, not a present mismatch. A later edit to one value would leave local runs on a different limit from deployments. No test or generation step ties the two.
  - The strongest argument for keeping it is that the Go default is a deliberate local-dev convenience and the two values are equal today.
  - A related reading cost: the fallback fires for both an unset variable and a malformed one, so a typo in the deployed env var silently falls back to 1 MiB. The ingress would still enforce the chart value. That is a bug-prevention concern and is not counted as a separate finding.
- Remedy: Pick one owner for the number. Two options are supported by the snapshot:
  - Make the chart the only owner. `maxBodyBytes()` would then require `MAX_BODY_BYTES` (or have a named default constant documented as "must match chart `maxBodyBytes`"). Local runs would set the variable explicitly. This removes the second value but adds a setup step for local runs.
  - Keep the Go default as the owner and render the chart value from it. That needs a mechanism the snapshot does not show, so that option is unresolved.
  - Minimal local improvement in either case: replace the `return 1 << 20` expression with one named constant, for example `const defaultMaxBodyBytes int64 = 1 << 20`, so the Go side states the default once and names its role. The cross-file duplication with the chart remains and needs the decision above.
- Preserve:
  - The 1 MiB default for local runs.
  - The current behavior on an unset or malformed variable.
  - The chart's one value feeding both the ingress and the env var.
  - Unverified: whether any local tooling or docs rely on running without `MAX_BODY_BYTES` set.
- Affected files: `/server/limits.go` (anchor); `/deploy/chart/values.yaml` (partner copy); `/deploy/chart/templates/deployment.yaml` and `/deploy/chart/templates/ingress.yaml` (consumers of the chart value, inspected, no change needed). No other consumers of `maxBodyBytes()` appear in the supplied snapshot beyond `limitBody`.
