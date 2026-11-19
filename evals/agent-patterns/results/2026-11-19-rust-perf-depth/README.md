# Rust performance depth and challenger probes, 2026-11-19

Bounded baseline-vs-candidate evaluation covering four new symmetric Rust
performance pairs (`AP43`–`AP50`), the previously unprobed Tokio/Rayon/SQLx pair
(`AP35`–`AP36`), and six independent `perf-challenger` traps (`C1`–`C6`) testing
plausible but non-equivalent Rust cheaper forms.

## Environment and conditions

- **Baseline revision:** `2378027` (`perf-review` 0.10.3).
- **Host and roles:** Antigravity native read-only subagents (`perf-reader` and
  `perf-challenger`, `tools: [view_file, grep_search]`, shell off), requested
  with `Model: "flash"` to approximate lighter worker profiles (such as Claude's
  `sonnet` / `medium` defaults).
- **Isolation:** Each probe ran in a fresh subagent context with only its own
  neutral source files, manifest (`Cargo.toml`, and `Cargo.lock` where external
  crates exist), and canonical `skills/perf-review/` reference files. No grader
  files, peer reports, or polarity hints were supplied.
- **Compiler verification:** All eight new packets (`AP43`–`AP50`) and six
  challenger crates (`C1`–`C6`) were compiled and symmetry-tested offline with
  `rustc 1.98.1` (`RUSTFLAGS="-D warnings" cargo test --offline`) against cached
  `serde 1.0.229`, `serde_json 1.0.154`, `dashmap 6.2.1`, `rayon 1.12.0`, and
  `tokio 1.54.1`. `AP43`/`AP44`, `AP45`/`AP46` (byte-for-byte JSON),
  `AP47`/`AP48`, and `AP49`/`AP50` all passed with zero warnings.

## Reader comparison (`AP35`–`AP36`, `AP43`–`AP50`)

| Case | Lens | Baseline (`2378027`) | Candidate | Observed delta |
| --- | --- | --- | --- | --- |
| AP35 (`report`) | `contention`, `async` | Found all 5 expected contention/async issues (`Mutex<reqwest::Client>`, `if let` scrutinee guard across `par_iter`, blocking `par_iter`, exclusive `Mutex` on `rules`, map drop under lock). | Not re-run | First empirical run of AP35. |
| AP36 (`retain`) | `contention`, `async` | Clean on `contention` (0 candidates); 0 false-positive plain findings on `async` (1 explicitly labeled `tradeoff` for overlapping HTTP fetch with Rayon compute). | Not re-run | First empirical run of AP36. |
| AP43 (`report`) | `complexity` | Found quadratic `Vec::drain(..frame_len)`, but reasoned from memory without inspecting Rust stdlib source. | Found quadratic `Vec::drain(..frame_len)` and cited on-disk `alloc/vec/mod.rs` + `alloc/vec/drain.rs` (`ptr::copy`) and MSRV stability. | Stdlib source verification added. |
| AP44 (`retain`) | `complexity` | Clean (`None`). | Clean (`None`). | Zero false positives. |
| AP45 (`report`) | `allocation` | Found owned `(String, String)` key and `serde_json::json!({...})`; failed to locate local stdlib source. | Found both with locked `serde_json`/`serde_derive`/`itoa` traces; checked default toolchain `rust-src` path (absent on `stable-aarch64-apple-darwin`, installed on `1.100.0`). | Surfaced toolchain-path discovery gap for orchestrator handoff. |
| AP46 (`retain`) | `allocation` | Clean (`None`). | Clean (`No candidates`). | Zero false positives. |
| AP47 (`report`) | `contention` | Found `DashMap::len()` all-shard lock, held `Ref` guard across `score_payload`, and per-item `RuleHandle::clone()` `Arc` RMWs (without reading `Arc` stdlib source). Surfaced scope refinement for `AP48` mid-batch visibility. | Found all 3 core findings and verified `Arc::clone`/`Arc::drop` (`fetch_add`/`fetch_sub`) in on-disk stdlib `alloc/src/sync.rs`. | Stdlib source verification added; tightened scope eliminated stale-snapshot tradeoff. |
| AP48 (`retain`) | `contention` | Clean (`No contention candidates`). | Clean (`No contention candidates`). | Zero false positives. |
| AP49 (`report`) | `io`, `repeated-work` | Found unbuffered `writeln!`, triple `stat`, and loop-invariant `env::var`, but relied on memory for all `std` behaviors. | Found all 3 and cited on-disk stdlib source for `default_write_fmt`, `File::write`, `sys::fs::common::exists`, `ENV_LOCK`/`getenv`, and `BufWriter`. | Memory-only trace upgraded to full stdlib source proof. |
| AP50 (`retain`) | `io`, `repeated-work` | Clean (`No candidates` on both lenses). | Clean (`None` on both lenses). | Zero false positives. |

## Challenger traps (`C1`–`C6`)

Each trap supplied a plausible-sounding `allocation`, `async`, or `contention`
claim whose proposed cheaper form breaks Rust equivalence or safety:

| Trap | Broken cheaper form | Expected | Baseline | Candidate | Key counter-evidence |
| --- | --- | --- | --- | --- | --- |
| C1 | `Vec::with_capacity(declared_len)` from untrusted 4-byte wire header | `falls` | `falls` | `falls` | Uncapped external length turns recoverable `UnexpectedEof` into OOM abort or 32-bit `isize::MAX` panic. |
| C2 | `writeln!(file, ...)` replacing `file.write_all(format!(...).as_bytes())` on unbuffered `&mut File` | `falls` | `falls` | `falls` | `default_write_fmt` invokes `write_all` per piece/argument (`N -> 4N` syscalls) and breaks single-write `O_APPEND` framing. |
| C3 | `serde_json::from_reader(BufReader::new(file))` with `#[serde(borrow)] label: &'a str` | `falls` | `falls` | Not re-run | Does not satisfy `DeserializeOwned`; `IoRead::parse_str` always returns `Reference::Copied` and rejects escaped JSON strings. |
| C4 | `thread_local!` `HashMap` + `clear()` across 5–20 item batches with 100k bursts | `falls` | `falls` | Not re-run | `HashMap::clear()` retains peak capacity and `HashMap::iter()` scans `O(capacity)` empty buckets on every subsequent small batch. |
| C5 | `tokio::task::block_in_place` on library crate with `#[tokio::test]` / `current_thread` callers | `falls` | `falls` | `falls` | Unconditionally panics on `current_thread` runtimes (`worker.rs:451`) and adds `Box<Cell>` handoff allocation on `multi_thread`. |
| C6 | Dropping `Lease` (with `Drop` decrementing `active_count`) after releasing `MutexGuard` | `falls` | `falls` | `falls` | Reorders `fetch_add(1)` ahead of `Lease::drop`, letting concurrent `active_leases()` observe `>= 2` and breaking `active_leases() <= 1`. |

## Instruction changes justified by evidence

1. **Manifest and local source-root handoff (`workflow.md`):** Orchestrator now
   locates crate/workspace manifests (`Cargo.toml`, `Cargo.lock`, and equivalent
   files for other languages) plus any on-disk dependency/stdlib source root
   (`vendor/`, `~/.cargo/registry/src`, installed `rust-src` / `rust-docs`) once
   and passes them to every reader and challenger. Addresses both the `AP39`
   missing-manifest gap and the `AP45`/`AP50` read-only toolchain-directory
   lookup friction.
2. **Local stdlib source guidance (`rust.md` `## Dependencies`):** Explicitly
   points to on-disk `rust-src` (`~/.rustup/toolchains/*/lib/rustlib/src/rust/library`)
   and `rust-docs` (`~/.rustup/toolchains/*/share/doc/rust/html/src`) with an
   MSRV check against `rust-version`. Directly turned `AP43`, `AP47`, and `AP49`
   from memory-only `std` traces into line-quoted stdlib proofs.
3. **Source-backed contract contradictions fixed:**
   - `lenses/allocation.md`: qualified `Arc`/`Rc` clone `Not a finding` with the
     copy-on-write detachment exception (`Arc::make_mut`, `Rc::make_mut`,
     `unwrap_or_clone`).
   - `lenses/async.md`: qualified `block_in_place` as multi-threaded-only (never
     propose where `current_thread` can run) and added detached spawned tasks
     (dropped `JoinHandle`).
   - `references/contract.md`: added `Future::poll`, `Stream::poll_next`,
     `Service::call`, and codec `Decoder`/`Encoder` to per-element/request trait
     entries.
   - `languages/rust.md`: reorganized dense paragraphs into scannable semantic
     rules, resolved `from_reader` vs `from_slice` borrowing, `mem::take` scratch
     vs ownership transfer, `Vec::drain(..n)` vs `drain(..)`, `HashMap`
     `O(capacity)` after bursts, `Drop` side effects behind locks, and added a
     compact `## Cheaper-form traps to verify` section for readers and challengers.

## Limits

- Probes ran on isolated synthetic crates (`Model: "flash"`) with one observation
  per arm per case; full orchestrator end-to-end runs on multi-crate production
  Rust repositories and elapsed-time benchmark validation remain outside this
  experiment.
- Candidate probes for `AP45` and `AP50` ran before the final `workflow.md` and
  `rust-docs` path refinement; `C3` and `C4` were verified at baseline only.
