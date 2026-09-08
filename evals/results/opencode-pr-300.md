# Super Review

## Context and status

- PR: https://github.com/Dankosik/go-service-template-rest/pull/300
- Repository: `Dankosik/go-service-template-rest`
- State: closed (source still reviewable)
- **B** (target): `6cffd8cc5cd269899021c7205d99e3982beb1c5d`
- **H** (head): `4c6311c87f888108d27520a075990c823edd1d52`
- **D** (comparison base): `6cffd8cc5cd269899021c7205d99e3982beb1c5d`
- Snapshot: `bc4f64c2-19ac-4827-8087-5b29ac58b512`
- Super Review version: not present in the loaded skill metadata
- Status: **complete** for the user-restricted scope
- Execution: **independent** specialist contexts (eight lens tasks)

User scope: `internal/infra/httpclient/propagation.go` and the source context needed for that file. The PR inventory has 34 files; files outside this scope were not reviewed.

The D→H change in the scoped file drops redundant `attempt.Header` / `attempt.Trailer` reassignment after `request.Clone`.

## Applied rules

- Go module: `github.com/example/go-service-template-rest`
- Language version: `go 1.27.0` (same at B and H; `go.mod` blob `2e34a56feaa0eff508f10078fcce4bd61f1bd644`)
- Team policy source: root `SUPER_REVIEW.md` at B (`6cffd8cc5cd269899021c7205d99e3982beb1c5d`) does not exist
- Overrides: none
- Disabled rules: none
- Unresolved conflicts: none
- Effective rules: default lens rules only (`go.naming.intent`, `go.flow.show-main-path`, `go.functions.extract-for-clarity`, `go.functions.coherent-purpose`, `go.data.make-transformations-visible`, `go.abstractions.earn-the-boundary`, `go.duplication.share-knowledge`, `go.api.express-the-call`, `go.change.localize-existing-variation`)

## Coverage

| Area/files | Lens/task | Completed / not applicable / unfinished | Reason or evidence |
| --- | --- | --- | --- |
| `internal/infra/httpclient/propagation.go` (`propagationSanitizer`, `RoundTrip`, `removeReservedHeaders`; callers in `client.go` / `target_policy.go`) | naming | completed | Independent specialist; no candidates. `request` vs `attempt` and Header vs Trailer remain distinct. |
| same | control-flow | completed | Independent specialist; no candidates. Straight clone → strip → forward path; change added no branches. |
| same | function-cohesion | completed | Independent specialist; no candidates. Remaining steps are one task. |
| same | data-flow | completed | Independent specialist; no candidates. Clone origin and in-place sanitization on the clone stay visible. |
| same | abstractions | completed | Independent specialist; no candidates. Sanitizer owns strip policy and idle-connection forwarding; not a pass-through. Constructor paging outside the package was not exhausted; extra sites would not see the unexported type. |
| same | duplication | completed | Independent specialist; no candidates. Extra Header/Trailer clones were the repeated clone rule and are already gone. |
| same | api-clarity | completed | Independent specialist; no candidates. Unexported `RoundTrip` signature unchanged; remaining `Clone` call matches the stdlib Header/Trailer copy contract. |
| same | change-locality | completed | Independent specialist; no candidates. Isolation-before-sanitize stays in one `RoundTrip`. |

**Excluded (not reviewed):**

- User-out-of-scope PR Go files, including `cmd/**`, `internal/infra/grpc/health_method.go`, `internal/infra/oauth2clientcredentials/client.go`, and other non-scoped production files
- Tests: `internal/infra/httpclient/client_test.go` and all other `*_test.go` in the PR inventory
- Generated files, vendor trees, binaries: none in the scoped path
- Unsupported languages: none in the scoped path

## Outcome

No useful changes were found under the completed plan. The scoped edit removes two Header/Trailer clones that `http.Request.Clone` already performs; remaining code in `RoundTrip` is a short, coherent sanitizing transport.

## File map

| File | Reason it participates | Recommendation IDs |
| --- | --- | --- |
| `internal/infra/httpclient/propagation.go` | User-scoped changed file; `propagationSanitizer.RoundTrip` at H | none |
| `internal/infra/httpclient/client.go` | Construction / caller context (`newClient`) | none |
| `internal/infra/httpclient/target_policy.go` | Next transport (`authorityTransport.RoundTrip`) | none |

## Limits and decisions

- Behavior, bugs, security, product requirements, and test coverage were not independently validated.
- No project checks or source edits were performed.
- Stdlib `Request.Clone` / `Header.Clone` are not in-repo; data-flow and api-clarity advice follows Go 1.27’s documented clone of Header/Trailer.
- Other PR files were excluded by user scope, not by a finding that they need no review.
- Snapshot receipts expire with this process; a later PR update does not retarget this report.

| Candidate | Accepted / rejected / merged / unresolved | Reason | R-ID if accepted/merged |
| --- | --- | --- | --- |
| *(none submitted)* | — | All eight independent specialists completed with no candidates | — |
