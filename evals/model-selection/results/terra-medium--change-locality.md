## C-change-locality-1: Co-locate the queue-tier policy in one definition

- Lens and task: change-locality / change-locality.
- Snapshot: PR `https://github.com/example/model-fixture/pull/1`, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/queue/policy.go`, `queueName`, `retryLimit`, `burstSize`, and `ForTier` (lines 3–12).
- Rules: effective default `go.change.localize-existing-variation`; no team overrides.
- Observation and cost: one queue-tier policy owns queue name, retry limit, and burst size, but its values are split across three tier switches. Adding or changing a supported tier requires coordinated edits in all three locations, making omissions and mismatched tier handling easier to introduce.
- Transformation and benefit: represent each tier’s complete `Settings` in one small policy table or a single switching function, with the current slow settings as the fallback. `ForTier` then retrieves the complete policy. A tier change becomes one local edit with all related values visible together.
- Counterargument: separate helpers make each individual setting lookup very direct and may be preferable if these policies are expected to diverge independently.
- Preserve: current mappings and unknown-tier fallback (`slow`, 1 retry, burst 2); return values should not expose mutable shared state.
- Affected files: local change: `internal/queue/policy.go`. `internal/access/roles.go` and `internal/loyalty/labels.go` use similar labels for independent concepts and should not participate.
- Missing context: none.

completed — inspected all supplied Go source for change locality. Excluded: tests, generated files, vendor trees, binaries, and unsupported-language files; none were supplied.
