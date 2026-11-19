## Task result: m1

- Snapshot: local whole-module snapshot `source/crates/infra-messaging/src/outbox.rs`, SHA-256 `5bc4b9cd37864933bb95458119bfea3e841edad82f87d2998e2db7739c38a8b5`.
- Instructions: revision `a6fb51e` supplied in the task packet; package version and trusted resource digest not exposed.
- Assignment: Rust function-cohesion (`rust.functions.extract-for-clarity`, `rust.functions.coherent-purpose`) and effects-separation profile, all production declarations in the named module; shared review contract and Rust context, no team overrides.
- Status: completed.
- Inspected evidence: complete production portion of `outbox.rs`, its internal helper and call relationships, `PreparedEvent` and its accessors in `prepared.rs`, and owning and workspace manifests. The crate inherits edition 2024 and Rust 1.100. The `#[cfg(test)]` module and test-only derives were excluded.
- Coverage: assessed each production declaration and call seam for cohesive purpose and load-bearing extraction, and the effects-separation profile for computation interleaved with environment access. The cooperative metadata scan keeps its serialization and yielding together; its sizing helper encapsulates that bounded operation. Admission and publishing are coherent orchestration, and the conversion and validation helpers each have a distinct responsibility. No missing evidence limits this pass.
- New applicability signals: none.

No candidates.

## Task result: m3

- Snapshot: local whole-module snapshot `source/crates/infra-messaging/src/outbox.rs`, SHA-256 `5bc4b9cd37864933bb95458119bfea3e841edad82f87d2998e2db7739c38a8b5`; no change endpoints apply.
- Instructions: packet resources; content identity unverified.
- Assignment: Rust function-cohesion lens and effects-separation profile, every production declaration in `outbox.rs`; shared review contract and Rust context apply; no team overrides.
- Status: completed.
- Inspected evidence: all production declarations in `outbox.rs` through line 356, including immediate helpers and uses; `infra-messaging/Cargo.toml`, workspace package baseline (edition 2024, Rust 1.100), related error and job definitions, and module references. The `#[cfg(test)]` module beginning at line 358 and other test targets are excluded. No project execution or source changes.
- Coverage: function-cohesion: complete for the assigned production module; effects-separation: complete for the assigned module. No missing required source for the candidate below.
- New applicability signals: none.

## C-m3-1: Publication error policy is embedded in the handler's orchestration

- Change anchor: snapshot `source/crates/infra-messaging/src/outbox.rs:206-237`, `Handler<PublishDomainEvent>::run`.
- Basis: `rust.functions.extract-for-clarity`; `rust.functions.coherent-purpose`, effects-separation.
- Observation: After preparing the event, deadline, context, and admission, the handler invokes `publish_after_admission`, then embeds a nested `map_err` match translating every `PublishError` and `PublishRejection` to retryable or permanent `JobError` values. This is a complete job retry-classification policy mixed into the publication sequence. Readers tracing the handler must traverse its eight outcome mappings to see how the operation ends; a reader changing that policy must find it inside the async chain.
- Remedy: Extract the entire match to a private function such as `fn publication_job_error(error: PublishError) -> JobError`, and use `.map_err(publication_job_error)`. The current inline match has the advantage that all policy is visible at the call site and remains exhaustive; the named mapping preserves that exhaustiveness while making both the orchestration and the policy independently scannable.
- Preserve: Every existing error-to-retry/permanent classification and reason string, including the shared `broker_refused` mapping, the success-to-unit conversion, admission timing, async execution, and error precedence. No observable change is intended.
- Affected files: `source/crates/infra-messaging/src/outbox.rs` only; the handler and its private mapping are in the same module.

## Task result: m2

- Snapshot: local whole-module snapshot `m2`, `source/crates/infra-messaging/src/outbox.rs`; endpoint identities are the supplied snapshot ID, with individual file hashes not exposed.
- Instructions: revision `a6fb51e`; package version and resource digest not exposed.
- Assignment: Rust function-cohesion (`rust.functions.extract-for-clarity`, `rust.functions.coherent-purpose`) and effects-separation profile, all production declarations in `outbox.rs`; shared review contract and Rust context, with no team overrides.
- Status: completed.
- Inspected evidence: complete production declarations in `source/crates/infra-messaging/src/outbox.rs:1-356`, including route preparation, enqueue/preflight, handler and error mapping, base64 serialization, stored intent conversion and capacity calculation; relevant uses in the messaging, jobs, webhooks and worker source trees; `source/crates/infra-messaging/Cargo.toml` and workspace package settings in `source/Cargo.toml`. The crate inherits Rust 1.100 and edition 2024; it is not published. The test-only module beginning at line 358 was excluded.
- Coverage: function-cohesion and effects-separation completed across the production module. The metadata sizing loop combines serialization and cooperative yielding as a single bounded preflight; extracting the computation would expose its budget and yield coordination to the caller. The preparation and conversion helpers each identify a distinct decision, while the enqueue and handler methods retain a clear orchestration story. No required evidence is missing for this assessment.
- New applicability signals: none.

No candidates.

## Task result: m4

- Snapshot: local whole-module snapshot `source/crates/infra-messaging/src/outbox.rs`, SHA-256 `3794785a276d0011d2442eeeed771e0a2ef67441555349db6a1f5aa86c3f7430`; no comparison endpoint is applicable.
- Instructions: packet resources; content identity unverified.
- Assignment: Rust function-cohesion lens and effects-separation profile, every production declaration in `outbox.rs`; shared review contract, Rust context, and no team overrides.
- Status: completed.
- Inspected evidence: full production module through line 356, its local helpers and calls, crate and workspace manifest context, and relevant outbox use sites. The crate inherits edition 2024, Rust 1.100, and `publish = false`. The `#[cfg(test)]` module beginning at line 358 and other test targets are excluded.
- Coverage: both function-cohesion rules and effects-separation applied to all production declarations. The chunked metadata calculation keeps its per-poll budget and yielding alongside the calculation it governs; extracting the computation would add state and coordination without a demonstrated improvement. The enqueue and handler operations read as orchestration, and the validation and conversion helpers each express a complete operation. No required evidence is missing.
- New applicability signals: none.

No candidates.

## Task result: h2

- Snapshot: supplied local snapshot `h2`, `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: Rust function-cohesion, including `rust.functions.extract-for-clarity` and `rust.functions.coherent-purpose`; all supplied production declarations and uses in the private, unreleased module. Effective policy: supplied review contract, Rust context and lens; no team overrides.
- Status: `completed`.
- Inspected evidence: `source/Cargo.toml` and complete `source/src/lib.rs`, including `Line`, `Totals`, `LineError`, `summarize`, `checked_line_cents`, and its sole call in `summarize`.
- Coverage: both assigned function-cohesion rules completed. `summarize` is a linear aggregation with explicit error propagation; `checked_line_cents` encapsulates the complete line-validation and checked-multiplication decision, including its error state. No required evidence is missing.
- New applicability signals: none.

No candidates.

## Task result: h1

- Snapshot: local supplied source, snapshot identity `h1`; `/tmp/sr-rust-RnkcG1/h1/source/src/lib.rs` and its owning manifest.
- Instructions: content identity unverified.
- Assignment: Rust function-cohesion lens, both `rust.functions.extract-for-clarity` and `rust.functions.coherent-purpose`, across all supplied production declarations and uses; supplied review contract and Rust context apply, with no team overrides.
- Status: completed.
- Inspected evidence: complete `Line`, `Totals`, `LineError`, `summarize`, and `checked_line_cents` declarations, their uses in the supplied source, and `source/Cargo.toml` (edition 2021, Rust 1.85). The task establishes that `checked_line_cents` has exactly one call site, in `summarize`, and that the module is private and unreleased.
- Coverage: both function-cohesion profiles completed. `summarize` is a linear aggregation and `checked_line_cents` owns the complete decision to validate and calculate one line's amount, including its domain errors; its single caller does not by itself make that boundary a fragment. No required evidence or capability is missing.
- New applicability signals: none.

No candidates.

## Task result: p01

- Snapshot: local supplied source, snapshot identity `p01`; `source/src/lib.rs` and `source/Cargo.toml`.
- Instructions: content identity unverified.
- Assignment: `rust.change.localize-existing-variation`; all production declarations in `source/src/lib.rs`; supplied review contract and Rust context; no selected profile or team overrides.
- Status: completed.
- Inspected evidence: complete `Refusal` and `status` declarations and the crate manifest. `status` is the only supplied use of `Refusal`.
- Coverage: change locality examined across every supplied production declaration and use; no profile selected. No required source is missing within the assigned root.
- New applicability signals: none.

No candidates. The wildcard in `status` makes a future refusal use 503 without an explicit status decision, but the assigned lens expressly preserves a wildcard for a `#[non_exhaustive]` type; `Refusal` has that attribute.

## Task result: p02

- Snapshot: p02, supplied local snapshot; production source `source/src/lib.rs` and manifest `source/Cargo.toml`.
- Instructions: content identity unverified.
- Assignment: `rust.change.localize-existing-variation`; no profiles supplied. Scope: all production declarations in `source/src/lib.rs`; supplied review contract and Rust context apply, with no team overrides.
- Status: completed.
- Inspected evidence: complete `Refusal` enum and `status` function, their uses in the supplied source, and the crate manifest (edition 2024, Rust 1.98). No tests or other production targets were supplied.
- Coverage: completed the assigned change-locality pass across the enum and status mapping. No required evidence missing within the supplied snapshot.
- New applicability signals: none.

## C-p02-1: The status mapping silently assigns new refusals 503

- Change anchor: `source/src/lib.rs:8-13`, `status`, p02 snapshot. Its match maps `Unauthenticated` to 401 and `PermissionDenied` to 403, then uses `_ => 503` for the remaining variant.
- Basis: `rust.change.localize-existing-variation`.
- Observation: Introducing a refusal requires a status decision, but the wildcard also accepts any new variant without making that decision visible at this mapping. A maintainer must remember to find and update this site; the compiler cannot identify it as a required decision. `Busy` is the sole current remainder, so its status can be named explicitly.
- Remedy: Replace `_ => 503` with `Refusal::Busy => 503`. The wildcard compactly expresses a shared default, but the supplied requirement makes the status of each new refusal an independent decision. The match is inside the enum's defining crate, where the `#[non_exhaustive]` attribute does not require a wildcard.
- Preserve: Keep all three current status values, the public function signature, and `#[non_exhaustive]` on the public enum. Current observable behavior is unchanged; introducing a variant will require an explicit status arm.
- Affected files: `source/src/lib.rs`, `status`; no other edit sites identified in the supplied source.

## Task result: p03

- Snapshot: local target `p03`, supplied snapshot view; source location `source/src/lib.rs`. The task ID is the snapshot identity for both endpoints.
- Instructions: content identity unverified.
- Assignment: `rust.change.localize-existing-variation`; no selected profiles. Scope: all production declarations in `source/src/lib.rs`, with the supplied review contract, Rust context, lens, task contract, and finding template; no team overrides.
- Status: completed.
- Inspected evidence: `source/src/lib.rs`, complete `status` function and `Refusal` re-export; `source/protocol/src/lib.rs`, complete `Refusal` declaration; both supplied Cargo manifests. The protocol enum is external to the transport crate and `#[non_exhaustive]`.
- Coverage: completed the change-locality base lens across the supplied production declarations and their relevant type context. The wildcard in `status` represents the contractually uniform remainder, including future protocol variants; it is load-bearing for the independently versioned, non-exhaustive enum. No required source or capability missing.
- New applicability signals: none.

No candidates.

## Task result: p04

- Snapshot: p04, supplied local snapshot view; source at `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: Rust `rust.change.localize-existing-variation`; no selected profile; all production declarations in `source/src/lib.rs`; supplied review contract and Rust context; no team overrides.
- Status: completed.
- Inspected evidence: `source/src/lib.rs`, complete `status` and `Refusal` re-export; `source/protocol/src/lib.rs`, complete `Refusal` declaration; both Cargo manifests. The transport contract in `task.md` defines the status mapping and future-refusal behavior.
- Coverage: completed change-locality pass over the production declarations and their relevant protocol context. No missing required evidence.
- New applicability signals: none.

No candidates. The wildcard in `status` is load-bearing: `Refusal` is independently versioned and `#[non_exhaustive]`, and the supplied contract assigns 503 uniformly to all other and future refusals. An exhaustive per-variant decision would conflict with that boundary and contract.

## Task result: p05

- Snapshot: p05, supplied local snapshot view at `/tmp/sr-rust-RnkcG1/p05/source`; p05 is the assigned snapshot identity.
- Instructions: content identity unverified.
- Assignment: Rust `api-clarity`, `rust.api.express-the-call`; all production declarations in `src/lib.rs`, with the supplied review contract, Rust context, and task instructions; no team overrides or selected profiles.
- Status: completed.
- Inspected evidence: `source/Cargo.toml` and the complete `tickets`, `issue`, and `successor` declarations in `source/src/lib.rs`, including their calls. The manifest declares edition 2024 and Rust 1.98; no dependencies or additional targets are declared. No tests are present in the supplied source.
- Coverage: completed the assigned API clarity lens over all supplied production declarations and their in-scope uses; no selected profiles. External consumers are not supplied, and the public API and its documented behavior are supported.
- New applicability signals: none.

## C-p05-1: The private successor exposes an asynchronous call for immediate arithmetic

- Change anchor: p05 snapshot, `source/src/lib.rs:9-16`, `issue` and `successor`. The call `successor(counter.get()).await` invokes an `async fn` whose entire body is `last.wrapping_add(1)`.
- Basis: `rust.api.express-the-call` (honest effects and results).
- Observation: The asynchronous signature and `.await` make a reader consider a suspension point and a future-returning contract for a calculation that never awaits. That is a shallow call contract: the asynchronous machinery does not communicate a real effect of `successor`.
- Remedy: Make `successor` a synchronous `fn successor(last: u32) -> u32` and call `successor(counter.get())` inside `issue`. Keeping it async does make both functions look uniform, but the source has no asynchronous work inside `successor` to justify that contract.
- Preserve: Keep `issue` asynchronous and keep the `get`, wrapping increment, and `set` inside its body, so collecting or dropping an unpolled ticket does not advance a counter. A polled ticket still advances its counter once with wrapping arithmetic; no public signature or observable behavior is intended to change.
- Affected files: `source/src/lib.rs`, the private `successor` declaration and its sole inspected call in `issue`; no external consumer changes required.

## Task result: p06

- Snapshot: p06, supplied local snapshot view; source `source/src/lib.rs` under the assigned root. Endpoint identity: p06.
- Instructions: content identity unverified.
- Assignment: Rust API clarity, `rust.api.express-the-call`; all production declarations in `source/src/lib.rs`, with the supplied public API and documented behavior supported. Effective policy: supplied review contract, Rust context and API clarity lens; no team overrides or selected profiles.
- Status: completed.
- Inspected evidence: `source/Cargo.toml`, all of `source/src/lib.rs`, and the supplied contract, Rust context, lens and finding template. Inspected `tickets`, `issue`, `successor`, and their calls. No consumers beyond the supplied source were available.
- Coverage: completed the assigned base lens across every production declaration and call seam; no profile selected. External consumers are unavailable, so public compatibility is preserved. No missing source limits this private-helper recommendation.
- New applicability signals: none.

## C-p06-1: Immediate arithmetic is exposed as an asynchronous helper

- Change anchor: p06 local snapshot, `source/src/lib.rs:9-16`, `issue` and `successor`. `issue` calls `successor(counter.get()).await`, while `successor` only returns `last.wrapping_add(1)`.
- Basis: `rust.api.express-the-call`, honest effects and results.
- Observation: The private helper's `async` signature and its caller's `.await` make an immediately computed wrapping increment look like a suspension boundary. A reader must inspect the helper to learn that it does not suspend. The outer `issue` future is load-bearing because polling it controls when the counter advances; the inner future adds no corresponding deferral for this sole call.
- Remedy: Make `successor` synchronous (`fn successor(last: u32) -> u32`) and call it without `.await`. The strongest reason to retain the current shape is the documented deferred ticket effect, but that deferral is already owned by the outer `issue` future.
- Preserve: Keep `issue` asynchronous and preserve its first-poll read, wrapping increment and write. Collecting or dropping unpolled tickets must leave counters unchanged; the public `tickets` signature and its returned future behavior remain unchanged. No observable behavior change is intended.
- Affected files: `source/src/lib.rs`, the private `successor` declaration and its sole inspected call in `issue`.

## Task result: p13

- Snapshot: local supplied source, task identity `p13` for both endpoints; `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: `rust.api.express-the-call`, full assigned lens; no selected profile or team overrides. Scope: all production declarations in `source/src/lib.rs`. Effective policy: supplied review contract and Rust context.
- Status: `completed`.
- Inspected evidence: `source/Cargo.toml` and complete `tickets` and `issue` declarations in `source/src/lib.rs:1-13`; the supplied task states the supported public contract and consumer behavior. No in-scope consumer source was supplied.
- Coverage: completed the API clarity pass over both declarations and their call seam. The iterator and future expose their outputs, borrowing and deferred execution serve the supported contract, and the documented first-poll and wrapping behavior is implemented by `issue`. The manifest specifies edition 2024 and Rust 1.98; no version-dependent replacement is proposed. External consumer implementations are unavailable, but no recommendation depends on changing the public signature.
- New applicability signals: none.

No candidates.

## Task result: p08

- Snapshot: local snapshot `p08`, whole supplied production source at `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: `rust.api.express-the-call`; no additional profile or team overrides; all production declarations in `source/src/lib.rs`, under the supplied review contract and Rust context.
- Status: completed.
- Inspected evidence: `source/Cargo.toml` and the complete `tickets` and `issue` declarations in `source/src/lib.rs`; no supplied production callers. The task supplies the supported public API and consumer behavior.
- Coverage: API clarity reviewed across both declarations and their call seam. The manifest declares edition 2024 and Rust 1.98. The public iterator yields futures whose deferred execution is documented and whose first poll advances the corresponding counter with wrapping arithmetic. Consumers may discard futures without polling, so the async shape is load-bearing. No missing evidence limits this pass.
- New applicability signals: none.

No candidates.

## Task result: p09

- Snapshot: local task snapshot `p09`, working-file view; `source/src/lib.rs` SHA-256 `71a58be676f9f772f506bb3cff973a572e7f6ea76655d93ee412cb6f7b368d9c`, `source/protocol/src/lib.rs` SHA-256 `7ec2a847528b54a100538492d3cc5fd8180f840bcadd633a659a5344537e1ce7`. Source location: `/tmp/sr-rust-RnkcG1/p09/source`.
- Instructions: content identity unverified; supplied contract, Rust context, control-flow lens, defensive-checks profile, and finding template inspected.
- Assignment: Rust control-flow, including defensive checks, over all production declarations in `source/src/lib.rs`; supplied task specifies the public API and its documented behavior as supported, the protocol dependency as separately versioned, and no team overrides.
- Status: completed.
- Inspected evidence: complete `status` and its re-export in `source/src/lib.rs`; complete `Refusal` declaration in `source/protocol/src/lib.rs`; both Cargo manifests. The transport crate uses the path dependency `protocol`; the enum is defined by that separate crate.
- Coverage: the base lens and defensive-checks profile were applied to the complete production declaration and its value origin. The explicit two cases and fallback are a single direct match. The fallback covers a foreign enum, a stated keep condition; assignment of an HTTP status to each new refusal on protocol upgrade is a maintenance obligation, but the supplied lens treats a foreign-enum wildcard as a compatibility choice. There are no defensive guards or silent defaults over a fact established within the transport crate. No required source or capability is missing.
- New applicability signals: none.

No candidates.

## Task result: p10

- Snapshot: local target, supplied snapshot `p10`; source location `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: Rust control-flow lens, `defensive-checks` profile; all production declarations in `source/src/lib.rs`, with the supported public API and documented behavior and the supplied protocol dependency as context. Effective policy: supplied review contract, Rust context, lens and profile; no team overrides.
- Status: completed.
- Inspected evidence: `source/Cargo.toml`, complete `status` declaration and `Refusal` re-export in `source/src/lib.rs`, and `source/protocol/Cargo.toml` and complete `Refusal` declaration in `source/protocol/src/lib.rs`.
- Coverage: control-flow base and defensive-checks profile completed for the supplied production declarations and dependency context; no missing required evidence.
- New applicability signals: none.

## C-p10-1: The wildcard hides the status decision for future refusals

- Change anchor: local snapshot `source/src/lib.rs:3-8`, `status`: the match names `Unauthenticated` and `PermissionDenied`, then maps `_ => 503`.
- Basis: `rust.flow.show-main-path`.
- Observation: `source/protocol/src/lib.rs:1-5` declares exactly `Unauthenticated`, `PermissionDenied`, and `Busy`; therefore the wildcard currently means `Busy`. The protocol dependency is separately versioned and the transport team assigns a status to each new refusal. The wildcard hides the current remaining variant and lets a new refusal silently inherit 503, so the compiler cannot point maintainers to the status decision that must be made on an upgrade.
- Remedy: Match `Refusal::Busy => 503` explicitly. The existing wildcard is concise and currently gives every remaining refusal the same status, but it obscures the named case and the required decision for newly added cases.
- Preserve: Preserve the public signature and the existing 401, 403, and 503 mappings. The dependency enum is exhaustive in the supplied snapshot; a newly added variant would require an explicit mapping when the dependency is upgraded, as the supplied process requires. No current caller-visible behavior changes.
- Affected files: `source/src/lib.rs` (`status`); the supplied production source contains no other consumer to update.

## Task result: p11

- Snapshot: p11, supplied local snapshot; source `source/src/lib.rs`.
- Instructions: content identity unverified; supplied review contract, Rust context, control-flow lens, defensive-checks profile, and finding template; no team overrides.
- Assignment: Rust control flow (`rust.flow.show-main-path`) and defensive checks, all production declarations in `source/src/lib.rs`.
- Status: completed.
- Inspected evidence: `source/Cargo.toml` and the complete `Refusal` enum and `status` function in `source/src/lib.rs:1-14`. The supplied transport contract specifies 401 and 403 for the two named cases and 503 for every remaining refusal, including future variants.
- Coverage: completed the control-flow and defensive-checks passes over both declarations. The wildcard at line 12 expresses the contract's genuinely uniform remainder; spelling out `Busy` would lose the explicit future-variant policy. No defensive guard or silent fallback is present. No missing required evidence.
- New applicability signals: none.

No candidates.

## Task result: p12

- Snapshot: p12, supplied local snapshot; source `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: Rust control-flow, including defensive-checks profile; all production declarations in `source/src/lib.rs`, with the supplied public API and transport contract and no team overrides.
- Status: completed.
- Inspected evidence: `source/Cargo.toml` and the complete `Refusal` enum and `status` function in `source/src/lib.rs:1-14`; no other production declarations or uses were supplied.
- Coverage: control-flow and defensive-checks completed across both declarations and all branches. The wildcard at line 12 expresses the specified uniform 503 remainder, including future refusals, and is therefore load-bearing. No missing required evidence.
- New applicability signals: none.

No candidates.

## Task result: p07

- Snapshot: local snapshot `p07`, supplied source view at `source/src/lib.rs`.
- Instructions: content identity unverified.
- Assignment: Rust `rust.api.express-the-call`, full production declarations in `source/src/lib.rs`; supplied review contract and Rust context; no team overrides or selected profiles.
- Status: completed.
- Inspected evidence: `source/Cargo.toml`, all production declarations in `source/src/lib.rs`, and all supplied assignment resources. No consumer source was supplied; the task specifies that consumers may collect and discard tickets before polling.
- Coverage: completed the assigned API-clarity lens across `tickets` and `issue`; no selected profiles. Downstream consumer details are unavailable, so public compatibility is preserved in the recommendation.
- New applicability signals: none.

## C-p07-1: Ticket issuance timing is hidden from callers

- Change anchor: `source/src/lib.rs:3-10`, `tickets` and `issue`, local snapshot `p07`. The public function returns an iterator of futures while the mutation occurs inside `issue`.
- Basis: `rust.api.express-the-call` (call contracts and honest effects).
- Observation: `tickets(counters)` returns `impl Iterator<Item = impl Future<Output = u32>>`, and `issue` performs `counter.get().wrapping_add(1)` and `counter.set(ticket)` inside its async body. The name and signature reveal a future but do not explain that collecting its items leaves counters unchanged, that discarding an unpolled item consumes no number, or that polling order determines issuance order. A caller must inspect the private body to understand this sequencing contract.
- Remedy: Document the public function with a short call example explaining that iterator items are futures, counters advance only when their respective futures are polled, unpolled discarded futures do not advance counters, and the sequence wraps. The future-based shape is load-bearing: callers can collect and discard items before polling, so eagerly issuing numbers during iteration would change behavior.
- Preserve: Keep the existing signature, borrowing and lazy effects, one increment per polled ticket, poll-dependent ordering, and wrapping arithmetic. This clarification changes documentation only.
- Affected files: `source/src/lib.rs`, documentation on `tickets`; downstream callers were not supplied and need no edits for this compatible clarification.
