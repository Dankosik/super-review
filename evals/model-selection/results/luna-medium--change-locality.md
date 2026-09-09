## C-change-locality-1: Keep each tier’s queue policy in one decision

- Lens and task: Change locality
- Snapshot: Synthetic PR `example/model-fixture#1`, H `bbbb…`, comparison D `cccc…`
- Location: `internal/queue/policy.go`, `queueName`, `retryLimit`, `burstSize`, `ForTier`
- Rules: One queue-tier policy owns queue name, retry limit, and burst size; no team overrides
- Observation and cost: The same tier mapping is split across three switches. Adding or changing a supported tier requires coordinated edits in three places, creating drift risk and making the complete policy harder to read.
- Transformation and benefit: Replace the three switches with one tier-to-`Settings` decision, preserving the existing defaults. Each tier’s policy becomes visible and editable at one boundary.
- Counterargument: Separate helpers may make individual fields reusable, though no supplied consumer uses them independently.
- Preserve: Unknown tiers must retain `slow`, `1`, and `2`; preserve `Settings` field meanings and construction order.
- Affected files: Local change to `internal/queue/policy.go`. `internal/access/roles.go` and `internal/loyalty/labels.go` were inspected and are independent concepts, not participants in this policy.
- Missing context: none.

Completed. Scope inspected: all supplied Go files. No tests, generated files, vendor trees, binaries, or unsupported-language files were supplied.
