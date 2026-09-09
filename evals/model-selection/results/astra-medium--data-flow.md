## C-data-flow-1: Name the address representations explicitly

- Lens and task: data-flow / `data-flow`.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/exporter/address.go`, `Export`, lines 6–10.
- Rules: `go.data.make-transformations-visible`.
- Observation and cost: `data` successively represents the incoming, trimmed, uppercase, and query-escaped address. Reusing a generic name makes readers trace assignments to determine which representation reaches the writer.
- Transformation and benefit: Use stage-specific values such as `trimmedAddress`, `uppercaseAddress`, and `escapedAddress`, starting directly from `row.Address`. This exposes each representation and the writer’s input.
- Counterargument: The pipeline is short, adjacent, and already shows its operations clearly; additional names add some verbosity.
- Preserve: Trim → uppercase → query escape → write order; unchanged writer error propagation and no mutation of `row`.
- Affected files: Local change in `internal/exporter/address.go`.
- Missing context: none.

Completed: inspected all supplied declarations (`Row`, `Writer`, `Export`, `SortInPlace`, and `FirstSortedKey`) under Go 1.22. The explicit in-place sorting contract warrants no candidate. Scope was limited to the supplied offline snapshot. Excluded tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied.
