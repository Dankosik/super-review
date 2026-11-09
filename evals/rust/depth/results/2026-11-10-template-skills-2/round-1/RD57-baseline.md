<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD57; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD57

- Snapshot: whole supplied source, no diff or base revision. Location: `.../scratchpad/packets/RD57`. Local identity: not exposed.
- Instructions: `content identity unverified`.
- Assignment: lens `data-flow` (rust.data.make-transformations-visible). Selected profiles: none. Scope: all production declarations and uses in `src/lib.rs`. Team policy: none. Baseline: edition 2021, rust-version 1.85.
- Status: completed.
- Inspected evidence: `Cargo.toml` and all of `src/lib.rs`, which covers `Row`, `Batcher`, `new`, `push` and `flush`. I also used the packet context facts: one owning task, never cloned or shared, the pending `Arc` is not handed out, and `Row`'s `Clone` has no other use. No test targets or generated files are present.
- Coverage: the base data-flow question is completed for all declarations. No profile was selected, so none was run. Nothing required is missing.
- New applicability signals: `lifecycle-ownership`. In `src/lib.rs`, `Batcher::pending` is an `Arc<Mutex<Vec<Row>>>` held in a struct that is never shared, and `push` and `flush` take `&mut self`. Not checked: whether the lock or the `Arc` has any ownership role outside this crate. This is a signal, not a completed check.

## C-RD57-1: Batch handoff copies rows and then clears the buffer, instead of transferring ownership

- Change anchor: `src/lib.rs`, `Batcher::push` (lines 25-27) and `Batcher::flush` (lines 32-34): `let batch = pending.clone(); pending.clear();`. Whole-project scope, anchored in this snapshot.
- Basis: rust.data.make-transformations-visible. No profile contributes.
- Observation: both methods hand the buffered rows to the caller as a batch. The code writes this as a deep clone of every `Row` (each owns a `String`), followed by a clear that drops the originals.
  - A reader has to see that the clone and the clear together mean "move out and reset". It reads like a copy that the buffer deliberately keeps.
  - The context facts rule out a snapshot purpose. Callers never read the Batcher's rows afterwards, and the clone is not shared. The same two-line move is written twice.
  - `Row`'s `#[derive(Clone)]` exists only for this copy.
- Remedy: take the contents instead, with `std::mem::take(&mut *pending)`. If the buffer becomes a plain `Vec` (see C-RD57-2), this is `std::mem::take(&mut self.pending)`. It states a transfer of ownership of the rows and leaves an empty buffer behind. `push` would end with `Some(std::mem::take(&mut self.pending))`. `flush` would end with `std::mem::take(&mut self.pending)`. `#[derive(Clone)]` can then go if nothing outside the crate needs it.
  - Strongest keep alternative: if `Row: Clone` is wanted for downstream callers, it can stay. That is a separate API decision.
- Preserve: `push` still returns `None` while below `limit`, then returns the full batch. `flush` still returns whatever is buffered. After either call the buffer is empty with the same observable contents. The returned batch keeps its element order. Known from the context facts: no caller depends on rows remaining in the buffer. Unverified: any downstream use of `Row: Clone`.
- Affected files: `src/lib.rs`, inspected.

## C-RD57-2: Single-owner buffer is wrapped in `Arc<Mutex<...>>`, which hides who owns and mutates it

- Change anchor: `src/lib.rs`, `Batcher.pending: Arc<Mutex<Vec<Row>>>` (line 10), `Batcher::new` (line 16), and the lock lines in `push` and `flush` (lines 20 and 31): `self.pending.lock().unwrap_or_else(|poisoned| poisoned.into_inner())`.
- Basis: rust.data.make-transformations-visible. This also touches lifecycle-ownership as a signal only.
- Observation: the type suggests shared ownership with cross-thread mutation. The actual flow is the opposite.
  - One importer task owns the `Batcher`, it is never cloned, and the `Arc` is not handed out.
  - Both mutating methods already take `&mut self`, so exclusive access is already established by the borrow checker.
  - The reader must work out that the `Arc` and `Mutex` carry no sharing role.
  - Each of the two methods spends a line recovering from a poisoned lock that can't occur under single ownership. The `pending` guard is only an indirection around the `Vec`.
  - `push` and `flush` read as lock-then-mutate rather than "mutate my buffer".
- Remedy: hold `pending: Vec<Row>` directly. Code becomes `self.pending.push(row); if self.pending.len() < self.limit { return None; }` with the C-RD57-1 take, and the `Arc`/`Mutex` imports and both lock lines go away. Ownership and mutation are then visible in the signature and the field type alone.
  - Strongest keep alternative: the `Arc<Mutex>` stays if a future design shares the buffer, for example with a timer-driven flusher. No such use is in the source or the packet context. This review does not infer a future requirement.
  - Note: `Batcher` would become `Send` through its fields, because `Vec<Row>` is `Send`. `&mut self` already serialises access.
- Preserve: the `&mut self` signatures and the batching behaviour are unchanged. Known: no sharing or `Arc` hand-out occurs. Unverified: `Sync`/`Send` bounds or other consumers outside this crate; the packet context says none exist.
- Affected files: `src/lib.rs`, inspected. C-RD57-1 and C-RD57-2 are best applied together, since the take is simplest on a plain `Vec`. Each is still independently supported.
