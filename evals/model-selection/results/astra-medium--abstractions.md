## C-abstractions-1: Remove the behavior-free UsersFacade

- Lens and task: abstractions; `abstractions` — completed.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/users/lookup.go`, `UsersFacade` and `Lookup`, lines 4–8 at H.
- Rules: `go.abstractions.earn-the-boundary`; no team overrides.
- Observation and cost: `UsersFacade.Find` forwards identical arguments and results to `Repository.Find`. `Lookup` already accepts `*Repository`, so the facade adds a type and an extra call to follow without isolating a dependency.
- Transformation and benefit: Call `repository.Find(key)` directly in `Lookup` and remove `UsersFacade` and its method. This removes unnecessary indirection.
- Counterargument: A facade could provide policy or a substitution boundary; the supplied complete context explicitly rules out those benefits here.
- Preserve: Keep `Lookup`’s signature, result, and single repository call. Preserve receiver behavior, including the existing nil-pointer behavior; introduce no dereference or validation.
- Affected files: Local change to `internal/users/lookup.go`.
- Missing context: none.

Reviewed both supplied files under Go 1.22. Retain the document storage boundaries: they isolate a network dependency, and `RemoteStore.Read` adds error context while preserving error identity through `%w`.

Exclusions: tests (`*_test.go`), generated files, vendor trees, binaries, and unsupported languages; none supplied. Review limited to the supplied offline snapshot and abstractions lens.
