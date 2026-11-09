<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT15

- Snapshot: private unreleased snapshot from the packet `files` (go.mod, server/limits.go, deploy/chart/values.yaml). No revision identity is exposed, and there is no diff. This is a whole-snapshot review.
- Instructions: super-review review-contract, go.md, duplication lens and finding template, read from the baseline root. `content identity unverified`.
- Assignment: lens `duplication` (go.duplication.share-knowledge), no profiles, area `server/limits.go`. No team overrides.
- Status: completed
- Inspected evidence: `server/limits.go` in full (`maxBodyBytes`, `limitBody`). `deploy/chart/values.yaml` in full (`proxy-body-size: 1m`). `go.mod` in full. Searched the snapshot for other uses of the body-size value and found none.
- Coverage: base duplication lens only, over the assigned file and its partner in the chart. The packet gives no other consumers.
- New applicability signals: none

## C-CT15-1: The body-size limit is stated twice, in two units and two files, with no link between them

- Change anchor: whole-project snapshot.
  - `server/limits.go`, const `maxBodyBytes`: `const maxBodyBytes = 1 << 20`. It is used by `limitBody` through `http.MaxBytesReader(w, r.Body, maxBodyBytes)`.
  - `deploy/chart/values.yaml`, key `ingress.annotations.nginx.ingress.kubernetes.io/proxy-body-size`: `1m`.
- Basis: go.duplication.share-knowledge. No profile contributes. This is not convention-only advice.
- Observation:
  - Both locations encode one decision: the largest request body admitted. The packet context states the coupling directly: the ingress must admit every body the server accepts.
  - The two copies are not textually alike (`1 << 20` bytes against nginx `1m`), so a search for either literal will not find the other.
  - Each copy is owned by a different audience. Operators edit the chart and do not read Go. Developers edit the constant and do not read the chart.
  - The two values change for the same reason, which is why they count as one piece of shared knowledge. They are not independent policies.
  - Nothing in the snapshot ties them together: no comment, no shared source, no check.
  - The cost is a silent split in each direction.
    - If the ingress value is lowered, nginx rejects bodies the server would accept, and the Go limit becomes dead.
    - If the Go constant is raised, the new headroom is unreachable through the ingress, and the change looks complete when it is not.
  - Neither side shows that the other exists.
- Remedy: a supported direction is to give the value one owner and derive or verify the other copy from it. The snapshot does not settle which owner is right, so that part is unresolved.
  - Missing fact: how the server is configured and deployed (chart templates, env or flag plumbing). Only `values.yaml` is supplied.
  - Option A: make the chart the source.
    - Add a chart value such as `server.maxBodyBytes`.
    - Render both the nginx annotation and a server env var or flag from it.
    - Have `limitBody` read the injected value, with `maxBodyBytes` as the default.
    - Operators then change one key, which fits the stated context that they do not read Go.
    - This adds a configuration surface, which needs the deployment plumbing to exist.
  - Option B: keep the Go constant as the source.
    - Add a note on `maxBodyBytes` and on the `values.yaml` key naming each other.
    - This only documents the link and does not remove the double edit.
  - Strongest keep alternative: leave both as is.
    - The values are small, stable literals.
    - Adding configuration plumbing costs more than the one-time double edit.
    - This is weaker here, because the context says operators change the chart without reading Go.
  - Sketch of Option A:

```
values.yaml: server.maxBodyBytes: 1048576
annotation proxy-body-size: {{ .Values.server.maxBodyBytes }}   # nginx accepts bytes
env MAX_BODY_BYTES: {{ .Values.server.maxBodyBytes }}
limits.go: limitBody reads configured max, default 1<<20
```

- Preserve:
  - The current `http.MaxBytesReader` behaviour: the server still rejects oversized bodies itself.
  - Equal effective limits: `1m` for nginx equals 1048576 bytes, and the two currently match.
  - The ingress annotation must stay at least as large as the server limit.
  - Unverified: whether other chart templates or code already inject the value, and whether nginx treats `1m` and `1048576` identically in the deployed ingress version.
- Affected files: `server/limits.go` and `deploy/chart/values.yaml` were inspected. Chart templates, server config loading and the deployment manifest are still needed to pick the owner. `go.mod` is unaffected.
