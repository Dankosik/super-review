<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT16

- Snapshot: local snapshot, no `change` (whole-snapshot scope), no base revision. The packet `files` entries carry no paths, so I identify them by content. They are the `go.mod` fixture (`go 1.24`), the Go source assigned as `server/limits.go`, and one chart file holding `maxBodyBytes` values, an ingress annotation and an `env` block. The source location is the packet CT16.json. No commit or blob hashes are exposed.
- Instructions: content identity unverified. I read `review-contract.md`, `languages/go.md` and `lenses/duplication.md`; the contract and the template (`finding-template.md`) were read in full only up to a truncation of about 6.7 KB.
- Assignment: lens `duplication` (`go.duplication.share-knowledge`), Go profile. Scope is `server/limits.go`. The other files are partner evidence only. There is no team override and no external API commitment.
- Status: completed.
- Inspected evidence:
  - All of `limits.go`: `maxBodyBytes()` and `limitBody()`.
  - The chart file, read as evidence only.
  - `go.mod` (`go 1.24`) for the baseline.
- Coverage: one decision was searched across the whole snapshot, the request body size limit.
  - Keys searched: `1 << 20`, `1048576`, `MAX_BODY_BYTES`, `maxBodyBytes`, `proxy-body-size`, `MaxBytesReader`, and the 1 MiB value in other spellings (`1<<20`, `1048576`, `1024*1024`).
  - Matches read: the `1 << 20` fallback in `maxBodyBytes()`; `maxBodyBytes: 1048576`, the ingress annotation `nginx.ingress.kubernetes.io/proxy-body-size` and `env.MAX_BODY_BYTES` in the chart; the single `http.MaxBytesReader` use in `limitBody`.
  - Encode/decode directions: the chart writes `MAX_BODY_BYTES` as a decimal string, and `strconv.ParseInt(..., 10, 64)` reads it back. The two agree.
  - Other limits, classifications or key mappings in the snapshot: none.
- New applicability signals: none.

No candidates.

**Duplication rationale**
- **Ingress and env var.** The ingress limit and `MAX_BODY_BYTES` both come from the one `.Values.maxBodyBytes`. That is already a single source for the deployed limit. Nothing needs centralizing.
- **Go fallback.** The `1 << 20` fallback equals the chart's 1048576. The stated context says the chart always sets the env var and the Go default applies only to local runs, so the two values have separate owners. The Go side is a local-run convenience and the chart is the deployed policy. Sharing them would need a generated or shared constant across Go and Helm, which adds more machinery than it hides. Divergence has a low blast radius, because the chart overrides the fallback in every deployment.
- **Single enforcement point.** `MaxBytesReader` is used only in `limitBody`, so there is no second copy of the enforcement logic.
