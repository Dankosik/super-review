## Task result: G

- Snapshot: local whole-project target at `e0b9bce1a9605715398ac56cc90592e8a28ac91a`; `worker.go` SHA-256 verified before and after as `8dc6031f3e0fff18421787f4cb7972852ea71655741a487563dd83de05c3f6a8`.
- Instructions: Super Review 3.0.0; content identity unverified.
- Assignment: `go.naming.intent`, no profiles; all production declarations and uses in `worker.go`; tests excluded.
- Status: completed.
- Inspected evidence: complete `worker.go`, including `delay` and its sole `schedule` use; `go.mod` (`go 1.22`).
- Coverage: completed; no missing required evidence.
- New applicability signals: none.

## C-G-1: `delay` conceals units and calculation result

- Change anchor: `worker.go:3`, called at line 5.
- Basis: `go.naming.intent`.
- Observation: `delay(at, n)` returns `at + n*1000`, but its parameters hide that the inputs are a millisecond timestamp and seconds. `delay` can also suggest an elapsed duration or a blocking effect. The call site names these concepts, so readers must reconstruct them inside the helper.
- Remedy: Rename to something like `addDelayMillis(atMillis, delaySeconds)`. The longer name makes the conversion and timestamp result explicit. Retaining `delay` is reasonable only if it is established local time-domain vocabulary; none was present in inspected scope.
- Preserve: existing arithmetic and `int64` behavior. The helper is unexported; only `schedule` was in scope.
- Affected files: `worker.go`.
