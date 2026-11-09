<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD58; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD58

- Snapshot: local packet, whole supplied source (no diff, no base revision). Location is `.../scratchpad/packets/RD58`. Identity is the supplied files `Cargo.toml` and `src/lib.rs`, with no hashes exposed.
- Instructions: `content identity unverified`. The resources are from the installed root `.../scratchpad/candidate/skills/super-review`.
- Assignment: lens `data-flow` (`rust.data.make-transformations-visible`). Selected profiles: none. Scope is all production declarations and uses in the private, unreleased module `Row` and `Outbox` (`push`, `snapshot`, `acknowledge`, `rows`). No team policy. Baseline is edition 2021 and MSRV 1.85.
- Status: completed
- Inspected evidence: `Cargo.toml` and all of `src/lib.rs`. The packet context supplies the producer and sender usage. There are no tests or generated files in the packet to exclude.
- Coverage: the base data-flow question is complete for all declarations. The profile pass is not applicable because none was selected. Nothing required is missing.
- New applicability signals: none.

No candidates.

I checked these transformations and found no data-flow burden that needs fixing:
- **`snapshot` clones the `Vec<Row>` under the lock (`self.rows().clone()`).** The context says a failed send calls `snapshot` again and retries the same rows, and producers push concurrently while the sender works. The owned copy therefore does real work: the sender holds an independent set of rows after the guard drops. A borrow or a drained handoff would lose the retry behaviour or hold the lock during the remote send.
- **`acknowledge(sent)` drains the first `sent` rows (`drain(..sent)`).** This removes the prefix that `snapshot` captured. Producers only append, so the rows removed are the ones sent. The result of `drain` is dropped on purpose, and the removal is visible in the expression.
- **`rows()` centralises the lock and the poison recovery.** Each caller's guard is a temporary that ends within its statement, so the data's owner and mutation points are readable. The data's only owner is `Arc<Mutex<Vec<Row>>>`, and the `Arc` clone in `#[derive(Clone)]` shares the buffer, as the producer-thread context expects.
