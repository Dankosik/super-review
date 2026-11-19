# Distilled `perf-review` instructions: Rust reader probes, 2026-11-19

Empirical check of the distilled `skills/perf-review/` instructions (replacing
the encyclopedic Rust/TypeScript API checklists and cross-language lens API
lists with concise source-verification discipline, equivalence questions, and
explicit `finding` vs `tradeoff` vs `not a finding` boundaries).

## Size delta (canonical `skills/perf-review/`)

| File | Before | After | Delta |
| --- | --- | --- | --- |
| `references/languages/rust.md` | 241 lines | 86 lines | -64% |
| `references/languages/typescript.md` | 133 lines | 85 lines | -36% |
| `references/languages/go.md` | 56 lines | 53 lines | -5% |
| `references/languages/java.md` | 59 lines | 57 lines | -3% |
| `references/lenses/*.md` (6 files) | 422 lines | 335 lines | -21% |
| `references/contract.md` | 204 lines | 162 lines | -21% |
| `references/workflow.md` | 203 lines | 154 lines | -24% |
| `references/challenge.md` | 61 lines | 65 lines | +7% (stdlib/cheaper-form source check) |

## Environment and conditions

- **Host and role:** Antigravity native read-only `perf-reader` subagents
  (`tools: [view_file, grep_search]`, shell off), requested with `Model: "flash"`
  as a lighter worker stress-test profile.
- **Isolation:** Each probe ran in a fresh subagent context with only its own
  neutral source files (`Cargo.toml`, `src/*.rs`, and offline `Cargo.lock` where
  external crates exist), canonical `skills/perf-review/` files, and on-disk
  source roots (`~/.cargo/registry/src/...`, `rust-src` 1.100.0, `rust-docs`).
  No grader files, peer reports, or polarity hints were supplied.
- **On-disk crate availability note:** During this run, `serde 1.0.229`,
  `serde_json 1.0.154`, `serde_derive 1.0.229`, `itoa 1.0.18`, `regex 1.13.1`,
  `regex-automata 0.4.18`, `tracing 0.1.44`, `tokio 1.54.1`, and `rayon 1.12.0`
  were present on disk; `reqwest 0.12.28`, `sqlx 0.8.6`, and `dashmap 6.2.1`
  were absent from the local Cargo registry cache, directly testing absent-source
  assumption discipline.

## Reader results (`AP33`–`AP50`, 9 symmetric pairs, 22 fresh runs)

| Pair | Lenses | `report` result | `retain` result | Source-verification discipline |
| --- | --- | --- | --- | --- |
| `AP33` / `AP34` | `complexity`+`allocation`, `io` | Found all 5 expected issues (`serde_json::from_reader` 1-byte `read`, `sort_by_key`, eager `ok_or`, `regex::captures`, `rec.tenant.clone()` in `entry`, plus `fs::read`/`Cow` tradeoff). Cleared `Vec::new()`, disabled `tracing::debug!`, SipHash. | Clean (`None` across all 3 lenses; 0 FPs). | Full line-quoted proofs in `rust-src`, `serde_json`, `serde_derive`, `regex-automata`, `tracing`. |
| `AP35` / `AP36` | `async`+`contention`, `io` | Found all 6 expected issues (`Mutex<reqwest::Client>`, `par_iter` on Tokio -> `rayon::spawn` + `oneshot` noting `block_in_place` panics on `current_thread`, `if let` scrutinee guard, exclusive `Mutex` on `rules`, `replace_rules` map drop under lock, per-row `sqlx` `INSERT` -> `UNNEST`). | Clean on `contention` and `io` (0 candidates); 0 FP plain findings on `async` (1 explicitly labeled HTTP/Rayon overlap `tradeoff`, matching baseline). | Verified `tokio-1.54.1` and `rust-src`; explicitly marked absent `reqwest`/`sqlx`/`rayon` steps as assumptions with crate, version, and exact question. |
| `AP37` / `AP38` | `complexity` | Removed redundant `HashMap` completely (did not settle for swapping hasher). | Clean (`None`). | Full `SipHasher13` + `hashbrown-0.17.1` + `core/str` proof on disk. |
| `AP39` / `AP40` | `allocation` | Found extra local `Snapshot` forcing `Arc::make_mut` copy on unshared edits. | Clean (`None`). | Full `alloc/src/sync.rs` + `core/src/clone/uninit.rs` proof; verified `Cargo.toml` MSRV 1.100. |
| `AP41` / `AP42` | `async` | Found detached `worker` task on timeout/cancel while keeping load-bearing `ledger` task intact. | Clean (`None`; preserved shared completion worker for `ledger`). | Full `tokio-1.54.1` (`join.rs`, `state.rs`, `watch.rs`, `notify.rs`, `timeout.rs`) proof. |
| `AP43` / `AP44` | `complexity` | Found quadratic `Vec::drain(..frame_len)` -> cursor offset + single drain on normal and `FrameTooLarge` paths. | Clean (`No candidates`). | Full `alloc/src/vec/drain.rs` + `core/src/slice/mod.rs` proof. |
| `AP45` / `AP46` | `allocation` | Found `serde_json::json!` (all 8 allocations) -> borrowed `#[derive(Serialize)]` struct, and owned `(String, String)` key -> collision-free `Borrow<dyn QuotaKey>` (keeping SipHash). | Clean (`None`). | Full `serde_json`, `serde_derive`, `itoa`, `alloc/collections/btree` proof. |
| `AP47` / `AP48` | `contention` | Found all 3 issues (`RuleHandle::clone()` 4 `Arc` RMWs/item, `tenant_caps.len() > 0`, `DashMap::get` guard held across `score_payload`). | Clean (`None`). | Verified `alloc/src/sync.rs` + `rayon-1.12.0`; honestly marked unread `dashmap 6.2.1` steps as `unproven` assumptions instead of guessing from memory. |
| `AP49` / `AP50` | `io`+`repeated-work` | Found all 3 issues (3 -> 1 `stat`, unbuffered `writeln!` -> `BufWriter` + `.flush()?`, loop-invariant `env::var` hoisted after empty guard). | Clean (`No candidates` on both lenses). | Full `std/sys/fs/unix.rs`, `core/io/write.rs`, `alloc/io/buffered/bufwriter.rs`, `std/sys/env/unix.rs` proof. |

## Limits and not-run checks

- **Challenger traps (`C1`–`C8`):** `NOT RUN` on the distilled instructions
  (stopped early per maintainer request to avoid excessive subagent runs).
- **Post-probe tightening:** `contract.md` and `workflow.md` received a final
  prose-tightening pass after the `AP33`–`AP50` reader probes; all mechanical
  package, link, and contract-anchor checks pass on the final revision.
- **Scope limits:** Synthetic isolated crates on one model (`flash`), single
  observation per packet; TypeScript/Go/Java behavioral probes and end-to-end
  production repository runs remain outside this experiment.
