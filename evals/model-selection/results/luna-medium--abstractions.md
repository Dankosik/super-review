## C-abstractions-1: Remove the behaviorless `UsersFacade` wrapper

- Lens and task: Abstractions — earn-the-boundary.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/users/lookup.go`, `UsersFacade` and `Lookup`.
- Rules: `go.abstractions.earn-the-boundary`; no team overrides.
- Observation and cost: `UsersFacade` only stores `*Repository` and forwards `Find` unchanged. Its callers already depend on `Repository`, so it adds indirection without behavior, ownership, compatibility, or substitution value.
- Transformation and benefit: Remove `UsersFacade`; have `Lookup` call `repository.Find(key)` directly. This exposes the existing dependency and reduces types, construction, and call hops.
- Counterargument: The wrapper could become a future extension point, but no present variation or policy justifies that boundary.
- Preserve: `Repository.Find` behavior, argument order, receiver semantics, and effect order.
- Affected files: `internal/users/lookup.go`; local change.
- Missing context: `none`.

Completed. Scope inspected: all supplied Go source for the abstractions lens. Excluded tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied.
