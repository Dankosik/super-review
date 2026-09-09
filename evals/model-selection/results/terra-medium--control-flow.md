## C-control-flow-1: Flatten `Publish`’s no-op branches

- Lens and task: control-flow; control-flow.
- Snapshot: PR #1, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/delivery/publish.go`, `Publish`, lines 3–14.
- Rules: `go.flow.show-main-path`.
- Observation and cost: Nested `enabled` and `body != ""` checks both lead to `nil` no-op returns, while the sole work path is obscured by `else` blocks.
- Transformation and benefit: Keep `s.Audit(body)` first, then early-return when `!enabled || body == ""`, followed by `return s.Emit(body)`. This exposes the only emission path directly.
- Counterargument: The current nesting makes the two prerequisites visually separate, which may be preferable if they gain distinct handling soon.
- Preserve: Audit must occur for every call; do not alter `Emit` call count, ordering, or its returned error.
- Affected files: local change: `internal/delivery/publish.go`.
- Missing context: none.

completed — inspected all supplied Go declarations for the control-flow lens. Exclusions: no tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.
