## C-change-locality-1: Resolve each queue tier into one complete Settings value

- Lens and task: change-locality; `change-locality`. Completed review of all supplied declarations.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/queue/policy.go`, `queueName`, `retryLimit`, `burstSize`, and `ForTier`, lines 3–12 at H.
- Rules: `go.change.localize-existing-variation`; no team overrides.
- Observation and cost: One queue-tier policy is spread across three switches. Changing a tier requires coordinating its queue name, retry limit, and burst size across separate declarations, making the complete policy harder to read and maintain.
- Transformation and benefit: Put one switch in `ForTier`, returning a complete `Settings` value with named fields for each branch. Remove the three helpers. Each tier’s policy can then be read and changed together.
- Counterargument: The helpers name individual settings clearly, and the policy already lives in one file. However, all shown consumers request the complete settings, so separate dispatch adds coordination without serving independent use.
- Preserve: Priority → `fast`, 6, 20; standard → `normal`, 3, 10; every other string → `slow`, 1, 2. Keep the exported API and concrete value semantics.
- Affected files: Local change to `internal/queue/policy.go` only. Inspected `internal/access/roles.go` and `internal/loyalty/labels.go`; their independent concepts should remain separate.
- Missing context: None for this recommendation. Go 1.22 is supplied; `go.mod` itself is not included.

Exclusions: Tests (`*_test.go`), generated files, vendor trees, binaries, and unsupported languages; none were supplied. Review limited to the offline snapshot and assigned lens.
