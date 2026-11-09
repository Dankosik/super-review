<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
Task result: CT16

- Snapshot: local fixture snapshot, no base revision or diff; whole-snapshot scope anchored in `server/limits.go`. No commit or blob identities are exposed.
- Instructions: `content identity unverified` (installed super-review skill at the instruction root named in the assignment; no version or digest exposed).
- Assignment: lens duplication, profile `go.duplication.share-knowledge`, no other profiles. Scope is `server/limits.go`, with the other supplied files as evidence. Effective policy: none beyond the contract. Go 1.24 per `go.mod`.
- Status: completed
- Inspected evidence: `go.mod`, `server/limits.go` (`maxBodyBytes`, `limitBody`), `deploy/chart/values.yaml`, `deploy/chart/templates/ingress.yaml`, `deploy/chart/templates/deployment.yaml`. Exclusions: no tests, generated code or vendored code in the snapshot.
- Coverage:
  - Decision searched: the request body size limit.
  - Keys searched: `1048576`, `1 << 20`, `MAX_BODY_BYTES`, `maxBodyBytes`, `proxy-body-size`, `MaxBytesReader`.
  - Searched in other spellings and units: `1<<20`, `1MiB`, `1m`.
  - Result: Go code, chart value, ingress annotation and deployment env var all express one limit. Verified in both directions: the chart emits `MAX_BODY_BYTES`, and Go parses it.
  - Not searched: nothing missing within the snapshot.
- New applicability signals: none.

## C-CT16-1: The body-size default is a second literal of the chart's value, and invalid env input silently falls back to it

- Change anchor: `server/limits.go`, `maxBodyBytes`: `return 1 << 20` in the `err != nil` branch. This is the whole-project snapshot, with no base revision. Partners: `deploy/chart/values.yaml` (`maxBodyBytes: 1048576`), `deploy/chart/templates/ingress.yaml` (`proxy-body-size: "{{ .Values.maxBodyBytes }}"`), and `deploy/chart/templates/deployment.yaml` (env `MAX_BODY_BYTES`).
- Basis: `go.duplication.share-knowledge`.
- Observation:
  - The chart owns the value. `values.yaml` feeds both the ingress proxy limit and the app's `MAX_BODY_BYTES`, so the ingress and the Go server are driven by one number and change together.
  - The Go `1 << 20` is the same number (1048576) in another spelling. The context states it applies only to local runs, because every deployment uses the chart. A default that applies only when the external value is absent is not a second owner, so there is no demonstrated drift risk in the default itself.
  - What remains is smaller. The `err != nil` branch covers two cases: the variable is unset (the local-run fallback) and the variable is set but unparsable. Both return `1 << 20`.
  - A malformed or empty chart value (for example a templating typo) would therefore silently yield the local default while the ingress used the chart value, so the two limits would diverge without any signal.
  - The code does not show that the fallback is meant to cover only the unset case.
  - The cost is small. A reader cannot tell from the file that `1 << 20` mirrors `values.yaml`. This is advisory, because one reason to change is documented and the shared-ownership claim is weak.
- Remedy: Optional. Keep `1 << 20` as the local-run default, since it has one owner and only applies when the variable is absent. Distinguish unset from invalid, with `os.LookupEnv` or an empty-string check: use the default only when the variable is unset, and treat a parse failure as an explicit error or a logged fallback. Whether invalid input should be an error is a behavior decision for the owner, so it is `unresolved`. Alternatively, a one-line comment naming `deploy/chart/values.yaml` as the deployed owner makes the mirror explicit. A shared constant is not supported, because Go code cannot share a constant with the chart.
- Preserve: local-run behavior with the variable unset (1 MiB) and the chart-supplied value path. Known: the chart always sets the variable. Unverified: whether any deployment sets it to a blank or non-numeric string.
- Affected files: `server/limits.go` (inspected), `deploy/chart/values.yaml`, `deploy/chart/templates/deployment.yaml`, `deploy/chart/templates/ingress.yaml` (all inspected).
