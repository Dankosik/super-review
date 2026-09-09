## C-abstractions-1: Remove the forwarding `UsersFacade`

- Lens and task: abstractions; `abstractions`.
- Snapshot: PR 1, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/users/lookup.go`, `UsersFacade` and `Lookup`, lines 4–8.
- Rules: `go.abstractions.earn-the-boundary`; no team overrides.
- Observation and cost: `UsersFacade` only forwards `Find` to `Repository`; `Lookup` immediately constructs it despite already receiving a `*Repository`. This adds a type and call hop without hiding a dependency or providing behavior.
- Transformation and benefit: remove `UsersFacade` and return `repository.Find(key)` directly from `Lookup`. The dependency and operation become visible at the use site.
- Counterargument: retain it if it is intended to become a real policy, compatibility, or substitution boundary; supplied context explicitly rules those out.
- Preserve: `Lookup`’s result, nil behavior, and call order.
- Affected files: local change in `internal/users/lookup.go`.
- Missing context: none.

Completed. Inspected all supplied Go declarations for the abstractions lens. `RemoteStore` and its consumer-side `Store` interface are retained: the adapter isolates the remote dependency and adds error context. Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.
