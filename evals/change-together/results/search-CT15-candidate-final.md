<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT15

- Snapshot: private unreleased snapshot from packet CT15 (no B/H/D, no diff); source: `server/limits.go`, `deploy/chart/values.yaml`, `go.mod` (go 1.24).
- Instructions: super-review skill (duplication lens, Go context, review contract, finding template); content identity unverified.
- Assignment: duplication lens, no profiles; scope `server/limits.go`; no team override.
- Status: completed
- Inspected evidence: all three snapshot files. `server/limits.go` was read in full (`maxBodyBytes`, `limitBody`). `deploy/chart/values.yaml` was read in full (`proxy-body-size: 1m`). `go.mod` was read.
- Coverage: the shared-knowledge check is complete. Decision searched: the maximum request body size. Keys searched: `1 << 20`, `1048576`, `1m`/`1M`/`1Mi`, `MaxBytesReader`, `proxy-body-size`, `maxBodyBytes`. The snapshot has only these three files. The only other partner is the chart value. No sibling Go functions share the input and result types. Excluded: tests, generated files, vendored code (none present).
- New applicability signals: none.

## C-CT15-1: The server's 1 MiB body limit is restated as `1m` in the ingress chart, with no link between the two

- Change anchor: `server/limits.go`, `const maxBodyBytes = 1 << 20` (whole-snapshot scope, anchored directly). Partner (external, evidence only): `deploy/chart/values.yaml`, `nginx.ingress.kubernetes.io/proxy-body-size: 1m`.
- Basis: `go.duplication.share-knowledge`; the partner sits in a configuration file outside reviewed source, so the candidate is anchored in the Go source.
- Observation: both values encode one decision, the largest request body admitted. The Go side enforces it through `http.MaxBytesReader` in `limitBody`. nginx's `proxy-body-size` `1m` means 1 MiB, so the two currently match.
  - The context states the ingress must admit every body the server accepts, and that operators change the chart without reading Go code. The two values therefore have to change together.
  - Nothing connects them. No comment, generation step or shared source names the other copy.
  - Raising only the chart value leaves the server rejecting bodies the ingress admits. Raising only the Go constant makes nginx answer 413 for bodies the server would accept.
  - The two use different spellings and units (`1 << 20` bytes and `1m`), so a text search for one value will not find the other.
  - This is not a local-run fallback. The Go constant is the enforced limit, not a default for an absent external value.
- Remedy: make one owner of the value and derive the other copy from it.
  - The Go limit could come from configuration, for example an environment variable set from the same chart value. The chart then owns the number, and `maxBodyBytes` becomes the parsed setting. This fits the context that operators edit the chart.
  - Alternatively, keep the Go constant as the owner and generate or template `proxy-body-size` from it during the build or deploy.
  - Tradeoff: the first adds a configuration surface and parsing, and needs a decision on the default when the value is absent. The second adds a generation step. The strongest keep alternative is a comment on both sides naming the partner. That records the obligation but does not enforce it. The ingress limit may legitimately be larger than the server's if the server limit is the stricter one, but the stated context requires ingress to be at least as large as the server's limit.
- Preserve: the current effective limit (1 MiB, with `MaxBytesReader` behaviour on overflow) and the ingress annotation key. Unverified: how the chart is deployed and whether other services share this chart value.
- Affected files: inspected `server/limits.go`, `deploy/chart/values.yaml`. Still needed: the chart's templates and deploy pipeline, if the remedy touches how the value is delivered.
