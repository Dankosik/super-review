## C-naming-1: Name the customer lookup key explicitly

- Lens and task: naming; `naming`.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/customer/lookup.go`, `Resolve`, lines 5–6.
- Rules: `go.naming.intent`.
- Observation and cost: `data` names a customer lookup key, while `record` holds the returned customer. The generic parameter name hides the input’s role, requiring readers to infer it from `store.Find` and `LookupEmail`.
- Transformation and benefit: Rename `data` to `lookupKey`, matching the caller’s vocabulary and distinguishing the lookup input from the resulting record.
- Counterargument: The function is short, and its string input and `Customer` result already help distinguish those roles.
- Preserve: Signature types, lookup semantics, error identity, and effect order; rename only the parameter and its use.
- Affected files: Local change in `internal/customer/lookup.go`; supplied caller needs no change. No external callers exist.
- Missing context: none.

Completed naming review of all supplied declarations and the supplied caller under Go 1.22. No naming candidates in `internal/report/names.go`. Exclusions: tests, generated files, vendor trees, binaries, and unsupported languages; none supplied. Review limited to the offline snapshot.
