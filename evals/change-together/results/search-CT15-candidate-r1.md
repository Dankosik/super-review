<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT15

- Snapshot: local packet snapshot, no base revision or diff (whole-project scope); source location is `<scratchpad>/dup/packets/CT15.json`. Endpoint identities were not supplied.
- Instructions: `content identity unverified`. I read `review-contract.md`, `languages/go.md`, `lenses/duplication.md` and `assets/finding-template.md` from the candidate skill root. I did not use the `languages.md` and `team-rules.md` files the contract links to, because the task named only four files. No metadata version was exposed.
- Assignment: lens `duplication` (`go.duplication.share-knowledge`), no profiles. Scope is `server/limits.go`. The rest of the snapshot is context, with no external API commitment or team override. The packet's context fact is that the ingress must admit every body the server accepts, and that operators change the chart without reading Go code.
- Status: completed
- Inspected evidence:
  - `server/limits.go`: the whole file. It declares `maxBodyBytes = 1 << 20` and applies it in `limitBody` through `http.MaxBytesReader`.
  - `deploy/chart/values.yaml`: the whole file, read as a non-source partner.
  - `go.mod`: the `go 1.24` baseline. The file has no relevant build constraints.
  - Exclusions: no tests, generated files, vendor trees or binaries were in the snapshot.
- Coverage:
  - Decision searched: the request body size limit.
  - Keys searched: `maxBodyBytes`, `1 << 20`, `1048576`, `1m`, `1M`, `MaxBytesReader`, `proxy-body-size`, "body".
  - Matches read: `server/limits.go` (`maxBodyBytes`, `MaxBytesReader`) and `deploy/chart/values.yaml` (`nginx.ingress.kubernetes.io/proxy-body-size: 1m`). These are the only two matches.
  - Encode and decode directions: this is one numeric limit, not a key-set table, so there is nothing to read in both directions.
  - Not searched: other files (the snapshot has none), and the ingress controller's own defaults.
- New applicability signals: none.

## C-CT15-1: The body size limit is stated twice, in Go and in the Helm values, with nothing connecting them

- Change anchor: `server/limits.go`, const `maxBodyBytes = 1 << 20`, used by `limitBody` in `http.MaxBytesReader(w, r.Body, maxBodyBytes)`. The partner is `deploy/chart/values.yaml`, key `ingress.annotations.nginx.ingress.kubernetes.io/proxy-body-size: 1m`. This is a whole-project snapshot, so the anchor is the current source. No change exists to introduce or worsen the burden.
- Basis: `go.duplication.share-knowledge`. This is a shared decision, not a convention-only observation.
- Observation:
  - Both locations encode the same decision, the maximum accepted request body. Go spells it `1 << 20` bytes. The chart spells it `1m`. nginx reads `1m` as 1 MiB, which is the same number in a different unit and spelling, so a text search for either form misses the other.
  - The packet context states a coupling: the ingress must admit every body the server accepts. A larger ingress limit is harmless. A smaller one makes nginx reject with 413 bodies the server would accept, and the Go limit becomes unreachable for them.
  - The two sides have different owners. Developers edit the Go constant. Operators edit the chart without reading Go code, so nothing at the chart tells them the value is tied to `maxBodyBytes`. The constant is unexported and carries no note about the ingress.
  - The cost is a coordinated edit with no signpost on either side. Raising `maxBodyBytes` without the chart edit, or lowering the chart value below it, silently breaks the invariant. The chart side is the one the packet context says is edited blind.
  - The reasons to change are shared. This is one policy ("largest body we accept") stated at two layers, not two independent limits. The ingress value is the outer bound and the server value is the inner one, so equality is the intended state.
  - The strongest case for keeping it as is: the two values live in different artifacts (Go binary and Helm chart), and a deployment may legitimately set the ingress looser than the server. If so, only an inequality needs to hold, not equality. The snapshot shows no other caller of `maxBodyBytes`, so keeping the constant local is also reasonable.
- Remedy: one source of truth is feasible, but the choice between two shapes needs a decision the snapshot cannot supply.
  - Option A, configuration-driven: the server reads the limit from configuration (an environment variable or flag), and the chart sets it and also derives `proxy-body-size` from the same `values.yaml` key. Sketch: `values.yaml: server.maxBodyBytes: 1048576`, with the ingress annotation and the server env var both templated from it. `limitBody` takes the limit from config instead of the const. The coordinated edit becomes one chart value, and the Go-side literal disappears.
  - Option B, keep both and document the constraint: add a comment on `maxBodyBytes` naming `ingress.annotations.nginx.ingress.kubernetes.io/proxy-body-size` as the partner that must be at least this large, plus a matching comment in `values.yaml`. This keeps two values but makes the dependency discoverable from both sides.
  - Missing evidence for choosing between them: whether operators are meant to tune the body limit per deployment, which is a behavior and ownership decision. Option A fits if they are. Option B fits if the limit is a fixed product property.
- Preserve:
  - The effective limit stays 1048576 bytes (1 MiB) on both sides.
  - nginx `1m` equals 1048576 bytes. The remedy must keep that equality so no body between the old limits is newly rejected or admitted.
  - `http.MaxBytesReader` behavior is unchanged, including the error returned on overrun and the connection closing after the limit.
  - Known: only the Go constant and the single chart annotation exist in the snapshot. Unverified: whether other charts, overlays or deployment configs set `proxy-body-size` for this service, and whether any other ingress controller sits in front.
- Affected files: `server/limits.go` and `deploy/chart/values.yaml`, both inspected. `go.mod` was read for the baseline only and is unaffected. Any Helm templates that consume `values.yaml` were not in the snapshot and are still needed if Option A is chosen.
