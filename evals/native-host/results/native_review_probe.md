Three naming changes are recommended. The naming review is **complete** for all three production files, including the working Rust change.

### Context and status

- Target: `/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk`.
- Extent: whole-project production Go, TypeScript and Rust; tests excluded.
- HEAD: `e0b9bce1a9605715398ac56cc90592e8a28ac91a`. PR B/H/D: not applicable.
- Working snapshot: `engine.rs` includes its local comment change. All source and configuration hashes remained unchanged during inspection.
- Instructions: selected installed Super Review **3.0.0**; **content identity unverified**.
- Execution: three fresh independent specialists, each `gpt-5.6-terra` / `medium`, with at most two running simultaneously. Orchestrator verified all candidates against complete declarations and uses.
- Compatibility: user identifies an unreleased internal application with no external library consumers.

Reviewed production SHA-256 identities:

| File | SHA-256 |
|---|---|
| `worker.go` | `8dc6031f3e0fff18421787f4cb7972852ea71655741a487563dd83de05c3f6a8` |
| `format.ts` | `3ec710375d801eeb4d319b29a82e02781dc168acdca92f109ff05705fb61271a` |
| `engine.rs` | `df44452424f1d0d2cdbf4c2259b7ef6c27e127066ee78041ee6491a96a65ba48` |

### Applied rules and coverage

No root `SUPER_REVIEW.md` exists at HEAD, the selected policy revision. No overrides, disables, conflicts or team code references apply.

| Area/files | Lens and task | Execution | Baseline and evidence |
|---|---|---|---|
| `worker.go` | Naming, G | Completed | Go 1.22; complete `delay`, `schedule` and their call |
| `format.ts` | Naming, T | Completed | TypeScript 5.4.5, strict, ES2022; complete `format`, `retryMessage` and their call |
| `engine.rs` | Naming, R | Completed | Rust 1.85, edition 2021; complete `Policy`, `duration`, `deadline` and their call |

Effective rules: `go.naming.intent`, `ts.naming.intent`, `rust.naming.intent`. Naming has no contextual profiles. All other lenses and profiles were **not requested**.

Excluded: `worker_test.go`. No additional generated, vendor, binary, unsupported-language source or Rust test-only items appeared in the supplied inventory. Manifests and compiler configuration were compatibility context.

CodeGraph reported an uninitialized index. Complete raw source reads supplied the required evidence without modifying the reviewed tree.

### File map

| File | Participation | Recommendations |
|---|---|---|
| [worker.go](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/worker.go:3) | Production timestamp calculation and caller | R-001 |
| [format.ts](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/format.ts:1) | Production message formatting and caller | R-002 |
| [engine.rs](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/engine.rs:3) | Production duration conversion and deadline calculation | R-003 |

### R-001 — Name the calculated retry timestamp and input units

**Location:** `worker.go:3`, `delay`; call at line 5. Local scope. Basis: `go.naming.intent`. Origin: C-G-1.

`delay(at, n)` returns `at + n*1000`. Its caller distinguishes `nowMillis` from `retrySeconds`, but the helper discards those meanings. Readers must reconstruct both the conversion and the fact that the result is a timestamp; `delay` can instead suggest an elapsed duration or waiting operation.

Rename the helper to `retryAtMillis` and its parameters to `nowMillis` and `retrySeconds`, updating the call:

```go
retryAtMillis(nowMillis, retrySeconds)
```

This revises the specialist’s suggested `addDelayMillis`, whose name could still suggest a millisecond delay input. The recommended spelling identifies the result while the parameters distinguish input units.

Keeping the current names makes this tiny helper shorter, and the adjacent caller supplies useful context. Carrying that existing vocabulary into the declaration nevertheless removes unnecessary interpretation without adding an abstraction.

Preserve the two `int64` parameters, argument order, return type and exact arithmetic. No other production caller is present.

### R-002 — Carry retry-message vocabulary into the formatter

**Location:** `format.ts:1–2`, `format`; call at line 5. Local scope. Basis: `ts.naming.intent`. Origin: C-T-1.

`format(a, b)` requires decoding the template to determine which number is the delay and which is the retry count. The caller already names both roles.

Rename the private helper and parameters to:

```ts
formatRetryMessage(delayMs, retryCount)
```

Update its parameter references and sole call. The declaration then states its purpose and input meanings directly. The current helper’s small size and nearby caller make reconstruction inexpensive, but do not make `a` and `b` meaningful when reading the template.

Preserve argument order, emitted string, return type and exported `retryMessage` API.

### R-003 — Expose the duration’s seconds unit

**Location:** `engine.rs:3`, `Policy::duration`; call at line 6. Local scope. Basis: `rust.naming.intent`. Origin: C-R-1.

`Policy` stores days, while `duration()` returns seconds. At `epoch_seconds.checked_add(policy.duration())`, readers must open the method to establish that both operands use seconds.

Rename the private method to `duration_seconds` and update the call:

```rust
epoch_seconds.checked_add(policy.duration_seconds())
```

The current private API is small enough to inspect quickly. Naming the converted unit still improves the boundary between day-based configuration and epoch-second arithmetic, without inventing additional domain terminology.

Preserve the receiver, `i64` return type, conversion and multiplication, checked addition, and `Option<i64>` result.

### Implementation order

The three renames are independent. Each includes its existing caller in the same file.

### Limits and decisions

| Candidate | Disposition | Reason | Recommendation |
|---|---|---|---|
| C-G-1 | Accepted with revised name | Timestamp result and mixed input units are obscured; revised spelling avoids implying a millisecond delay input | R-001 |
| C-T-1 | Accepted | Parameters and helper omit vocabulary already established by their caller | R-002 |
| C-R-1 | Accepted | Unitless method name hides the day-to-second conversion at its use | R-003 |

No unresolved observations or unfinished naming coverage remain. Completion does not establish exhaustive discovery. Behavior, bugs, security, product requirements and test coverage were not independently validated. No reviewed source edits, execution or project checks were performed.
