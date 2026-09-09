## C-data-flow-1: Name each address transformation stage

- Lens and task: data-flow
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbb…bbbb`, comparison D `cccc…cccc`.
- Location: `internal/exporter/address.go`, `Export`, lines 6–10.
- Rules: Go 1.22; no team overrides.
- Observation and cost: `data` is repeatedly reassigned from the incoming address to trimmed, uppercased, and escaped representations. The pipeline is sequential, but the changing meaning of `data` makes ownership and representation less explicit to readers.
- Transformation and benefit: Use meaningful intermediates such as `trimmed`, `normalized`, and `escaped` before calling `WriteAddress`. This exposes each stage without changing behavior.
- Counterargument: The current short pipeline is readable and avoids unnecessary locals.
- Preserve: Transformation order, string values, and the final writer effect.
- Affected files: `internal/exporter/address.go`; local change.
- Missing context: none.

Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.
