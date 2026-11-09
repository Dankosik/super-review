<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT16

- Snapshot: local snapshot from the packet CT16.json (whole-project scope, private and unreleased). No B/H/D or commit identities are exposed.
- Instructions: content identity unverified. I read the review contract, the Go context, the duplication lens and the finding template from the installed resource root.
- Assignment: duplication lens, rule `go.duplication.share-knowledge`, no profiles. Scope is `server/limits.go`. Partners were searched across the whole snapshot. No team override applies.
- Status: completed
- Inspected evidence:
  - `go.mod` (go 1.24).
  - `server/limits.go`, whole: `maxBodyBytes` and `limitBody`.
  - `deploy/chart/values.yaml`, key `maxBodyBytes: 1048576`.
  - `deploy/chart/templates/deployment.yaml`, which sets the `MAX_BODY_BYTES` env var from `.Values.maxBodyBytes`.
  - `deploy/chart/templates/ingress.yaml`, which sets the `proxy-body-size` annotation from `.Values.maxBodyBytes`.
  - Context fact: every deployment uses the chart, and the Go default applies only to local runs.
  - Exclusions: no test, generated or vendor files are in the snapshot.
- Coverage:
  - Completed: all declarations in `server/limits.go` and every snapshot file that names the body-limit decision.
  - Missing evidence: none. I did not check whether other Go files in the real repository use the limit, because only these files were supplied.
- New applicability signals: none.

## C-CT16-1: The default body limit of 1 MiB is written twice, as `1 << 20` in the Go fallback and as `1048576` in the chart values

- Change anchor: `server/limits.go`, `maxBodyBytes`, the fallback `return 1 << 20`. The partner is `deploy/chart/values.yaml`, `maxBodyBytes: 1048576`. This is a whole-project snapshot, so I anchored directly in it.
- Basis: `go.duplication.share-knowledge`. This is a repeated decision, not a convention-only point.
- Observation:
  - Both literals are 1 MiB, and both feed the same setting.
  - The chart value reaches the Go code through `MAX_BODY_BYTES`, so the chart overrides the Go default in every deployment.
  - Because of that, the Go literal is a local-run default that mirrors the chart default. The two have no mechanism to keep them equal.
  - The current values are equal, so nothing is wrong today.
  - A maintainer who raises the default has to find both places. The chart change would silently stop matching local runs.
  - The same limit also appears a third time in `ingress.yaml`, but that one reads the chart value and is not a duplicate literal. Counting it as a duplicate would be wrong.
- Remedy:
  - Treat the chart value as the owner of the decision for deployments. Keep the Go default only as a local-run fallback, named as such: `const defaultMaxBodyBytes int64 = 1 << 20`. Add a comment that the chart default mirrors it, or the reverse.
  - Alternatively, leave the Go code without a numeric default for deployment paths and make the chart's value the only deployed source. This needs a decision on whether local runs need a default at all.
  - The strongest keep alternative is to accept the two literals. Go and Helm cannot share a constant without generating one from the other, which is heavier than the duplication. This is a reasonable choice, and a named constant plus a note is the cheaper fix.
- Preserve: the env var name `MAX_BODY_BYTES`, the chart key and the 1 MiB default are preserved. The ingress annotation must keep reading the chart value.
- Affected files: `server/limits.go`, `deploy/chart/values.yaml`. Both inspected. `deploy/chart/templates/deployment.yaml` and `deploy/chart/templates/ingress.yaml` also inspected and unchanged by this remedy.

## C-CT16-2: Within `server/limits.go`, a parse failure and an unset variable fall back to the default without a distinction

- Change anchor: `server/limits.go`, `maxBodyBytes`, `if err != nil { return 1 << 20 }`.
- Basis: `go.duplication.share-knowledge`. This is a weak observation about a single decision with one owner.
- Observation:
  - This is not a repetition of knowledge. There is one owner and one consumer. `limitBody` calls `maxBodyBytes` once per request.
  - I looked for a second implementation of the env-parse-with-default operation in the snapshot and found none.
  - I am noting it only to record that there is no duplicated knowledge here, and I do not raise it as a candidate.
- Remedy: none. No candidate.
- Preserve: not applicable.
- Affected files: `server/limits.go`.

Candidates raised: C-CT16-1 only. C-CT16-2 is recorded as a non-candidate for coverage.
