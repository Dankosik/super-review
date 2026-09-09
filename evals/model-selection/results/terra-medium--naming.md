## C-naming-1: Name the lookup input by its business role

- Lens and task: naming / naming
- Snapshot: PR 1, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`
- Location: `internal/customer/lookup.go`, `Resolve`, line 5
- Rules: Go 1.22; team vocabulary: customer
- Observation and cost: `data` is ambiguous in a flow that also handles the returned customer record; it obscures that this value is the customer lookup key.
- Transformation and benefit: rename `data` to `lookupKey` (or `customerLookupKey`) and use it in `store.Find`, making the two values’ roles immediately distinct.
- Counterargument: the parameter is function-local and the `Store.Find` signature already suggests it is a key.
- Preserve: lookup value semantics, error identity, and call order.
- Affected files: local change in `internal/customer/lookup.go`.
- Missing context: none.

Completed. Inspected all supplied Go declarations for naming only. Excluded tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied.
