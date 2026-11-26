# Changelog

## 3.40.0 — 2026-11-26

Adds ClickHouse Review as the sixth read-only skill (`super-review 3.40.0`, `clickhouse-review 0.1.0`, while keeping `defect-review 0.16.1`, `test-review 0.15.1`, `perf-review 0.10.5`, and `sql-review 0.2.0` unchanged), preserving all 56 stable rule IDs, the eight base Super Review lenses, fresh-context isolation, read-only boundaries, and configured worker model profiles.

- **New ClickHouse Review skill (`skills/clickhouse-review/`, `0.1.0`).** Adds six ClickHouse-native lenses (`storage-keys`, `mutations-lifecycle`, `views-projections`, `queries-distributed`, `cluster-ddl`, `ingestion-client`) and two deployment contexts (`self-managed` for OSS/Altinity ClickHouse 24–25+/26.x with Keeper/ZooKeeper, and `cloud` for ClickHouse Cloud `SharedMergeTree` and `Shared` databases) across standalone `.sql` files, server/cluster configs (`config.xml`, `users.xml`, `remote_servers.xml`, Helm/operator CRDs, Terraform), and Go, TypeScript, Rust, Java, and Python clients. Requires a four-part proof (traced/quoted mechanism on the reconstructed cumulative schema and pinned ClickHouse version/deployment baseline, `written`/`schema`/`engine` basis, concrete impact, and a minimal version- and deployment-valid safer form) plus survival of an independent four-line challenge. Uses safe small-change pairing (`storage-keys` + `mutations-lifecycle`, `views-projections` + `cluster-ddl`, keeping `queries-distributed` and `ingestion-client` solo), accepts user-supplied or committed `EXPLAIN indexes = 1`, `EXPLAIN PLAN`, `system.parts`, `system.query_log`, `system.mutations`, and `SHOW CREATE TABLE` outputs as passive evidence without connecting to ClickHouse, routes data- or version-dependent hypotheses to `Needs your confirmation`, and includes anti-folklore guards for parallel `FINAL`, monotonic primary-key functions, `query_plan_join_swap_table = 'auto'`, `deduplicate_insert`, filtered `PROJECTION ... WHERE` (version-gated), and `SharedMergeTree` auto-conversion.
- **Native adapter, build, and family documentation integration (`adapters/`, `scripts/`, `docs/`).** Ships ClickHouse Review in Claude Code (`/super-review:clickhouse`), Codex (`$clickhouse-review`), OpenCode (`/clickhouse-review`), and Google Antigravity (`/clickhouse-review`) while keeping Cursor on Super Review only; updates `scripts/build.ts`, `scripts/validate.ts`, `scripts/package.py`, and `scripts/check-opencode.ts`; extends six-skill policy isolation across `tests/`; and documents ClickHouse Review's proof bar and sibling-skill separation from OLTP SQL Review in `docs/clickhouse-review.md`, `docs/review-family.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/opencode.md`, `docs/antigravity.md`, `docs/native-integrations.md`, `docs/model-profiles.md`, and `docs/sql-review.md`.
- **Isolated evaluation corpus and mechanical verification (`evals/clickhouse-review/`, `tests/clickhouse-review.test.ts`).** Adds 12 contrasting `report`/`retain` packets (`CH01`–`CH12`) covering all six lenses and both deployments, with strict TypeScript (`tsc --noEmit`), Go (`go vet`), XML, SQL, zero-em-dash, 6-line bullet, delivery-parity, and no-ClickHouse-CLI-execution checks.

Package, native configuration, and fixture integrity checks pass; live behavioral model evaluation for `CH01`–`CH12` remains NOT RUN.

## 3.39.1 — 2026-11-26

Improves SQL Review recommendation quality, challenger calibration, cumulative-schema and same-table DDL synthesis, driver/ORM verification, and instruction density (`super-review 3.39.1`, `sql-review 0.2.0`, while keeping `defect-review 0.16.1`, `test-review 0.15.1`, and `perf-review 0.10.5` unchanged), preserving all 56 stable rule IDs, the eight base Super Review lenses, fresh-context isolation, read-only boundaries, and configured worker model profiles.

- **Runner-aware `Safer form` and safe/tradeoff splitting (`skills/sql-review/references/contract.md`, `workflow.md`, `lenses/migrations.md`, `dialects/postgresql.md`).** Checks migration runner transactional mode and opt-out syntax before proposing `CONCURRENTLY` or separate-transaction `NOT VALID` + `VALIDATE` steps, requires session-scoped `SET`/`RESET lock_timeout` instead of `SET LOCAL` outside transactions, routes unstated runner tx mode to `needs confirmation`, and splits behavior-keeping safe improvements (`finding`) from heavier structural or API-changing work (`tradeoff`).
- **Calibration, anti-folklore, and Antigravity reader parity (`references/challenge.md`, `assets/finding-template.md`, `assets/report-template.md`, `lenses/schema.md`, `lenses/indexing.md`, `dialects/mysql.md`, `adapters/antigravity/agents/sql-reader.md`, `docs/sql-review.md`).** Protects statically provable bugs from `EXPLAIN`/table-size dismissals, aligns confirmation triggers and reader confirmation slots across all roles, clarifies that a prior documented choice with a false premise or omitted cost yields `stands` rather than `disputed`, and guards against invented column constraints, reflexive FK indexes, and false missing-FK-index claims on MySQL/InnoDB auto-indexed foreign keys.
- **Cumulative schema reconstruction, same-table DDL merging, and ORM/driver precision (`references/workflow.md`, `contract.md`, `harnesses/antigravity.md`, `lenses/app-boundary.md`, `lenses/transactions.md`).** Supplies ordered migration manifests and per-table rename chains (including post-snapshot deltas and later migrations up to `HEAD`) to shell-less Antigravity roles; preserves uniqueness invariants when merging same-table `schema`/`indexing`/`migrations` findings (never widening `UNIQUE (a, b)` into `UNIQUE (a, b, c)`) into one coherent safe-DDL sequence; checks generated ORM SQL, empty `IN ()` lists, active `tx` vs top-level `pool` usage, and exact locked driver error codes without downloading absent dependencies.
- **Dialect accuracy, distillation, and expanded evaluation corpus (`references/dialects/*.md`, `references/lenses/*.md`, `harnesses/external.md`, `evals/sql-review/`, `tests/sql-review.test.ts`).** Tightens PostgreSQL 18 `ADD CONSTRAINT ... NOT NULL col NOT VALID` syntax and MySQL 8.0 semijoin vs antijoin accuracy, removes same-window repetition and stale minor-version lists under the 6-line bullet and zero-em-dash guards, fixes fixture asymmetries in `SQL01`–`SQL12`, and expands `evals/sql-review/` to 15 contrasting pairs (`SQL01`–`SQL30`) covering all six outcomes with strict `tsc`, `go vet`, and quote-aware SQL checks.

Package, native configuration, and fixture integrity checks pass; live behavioral model evaluation for `SQL01`–`SQL30` remains NOT RUN.

## 3.39.0 — 2026-11-26

Deepens Rust business-logic readability and evolvability reviews across Super Review (`super-review 3.39.0`, while keeping `defect-review 0.16.1`, `test-review 0.15.1`, `perf-review 0.10.5`, and `sql-review 0.1.0` unchanged), preserving all 56 stable rule IDs, the eight base lenses, fresh-context specialist isolation, read-only boundaries, and configured worker model profiles.

- **Positive business-expressiveness scope and broadened triggers (`SKILL.md`, `references/review-contract.md`, `references/aspects.md`, `references/languages.md`, `references/team-rules.md`).** Separates validating product requirements (out of scope) from expressing already-implemented business rules, invariants, and state transitions clearly in types and control flow (core scope); allows refactoring an unchanged domain or error type whose loose shape directly burdens changed consumers; broadens triggers for `representation`, `logic`, `effects-separation`, and `error-expression` to fire when changed business flows branch on existing anemic structs or broad error enums; and lets team rules in `SUPER_REVIEW.md` pin conditional aspects on domain paths.
- **Distilled Rust context and co-located business-logic criteria (`references/languages/rust.md`, `references/lenses/rust/*`, `references/profiles/rust/*`, `references/rust/{sqlx,axum}.md`).** Compresses `languages/rust.md` from 128 to 82 lines while strengthening Rust business-domain guidance paired with anti-over-engineering `Keep when` guards: owned state transitions (runtime phase enums, consuming step structs, private fields with transition methods, temporal coupling, and business units while avoiding generic typestate on persisted entities and over-newtyping plain fields), pure synchronous decision cores (`load -> decide -> persist` with explicit facts and `now`, retaining linear CRUD and lock/transaction boundaries), exhaustive `(role, state, action)` decision matrices, expected domain outcomes (`Result<Outcome, InfraError>`) versus unexpected infrastructure failures, vertical business modules versus horizontal layer scattering, boundary row decoding in `sqlx`, thin HTTP adapters in `axum`, and guards against internal event-bus/command-registry ceremony.
- **Neutral call-spine context, Spine-First verification, and `Next change` evolvability check (`references/workflow.md`, `references/verification.md`, `assets/finding-template.md`, `assets/report-template.md`).** Passes a factual, judgment-free call-spine map (`entry -> usecase -> domain -> store` and key domain-type read/write sites) in specialist `Materials` for multi-file flows; runs Spine-First Design It Twice in orchestrator verification before micro-candidate triage so overlapping local symptoms collapse into coherent root fixes; and adds an optional compact `Next change` check for structural or cross-file recommendations showing edit sites before -> after and compile-time exhaustiveness.
- **Domain team-rules example and multi-file Rust business-logic corpus (`examples/team-rules/RUST.md`, `examples/team-rules/reference-order.rs`, `evals/rust/business/`, `tests/rust-business.test.ts`).** Expands the Rust team-rules template with a compiled `reference-order.rs` code reference and adds 9 symmetric multi-file `report`/`retain` pairs (`RB01`–`RB18`, 4 to 8 files each, all passing offline `RUSTFLAGS="-D warnings" cargo check --offline --all-targets` on `rustc 1.98.1`), closing previously uncovered Rust lenses and profiles (`logic`, `placement`, `naming`, `conventions`, `diagnostics`, and business `effects-separation`).

Package, native configuration, offline Rust fixture compilation, and mechanical integrity checks pass; live behavioral model comparison for `RB01`–`RB18` remains NOT RUN.

## 3.38.0 — 2026-11-26

Adds SQL Review as the fifth read-only skill (`super-review 3.38.0`, `sql-review 0.1.0`, while keeping `defect-review 0.16.1`, `test-review 0.15.1`, and `perf-review 0.10.5` unchanged), preserving all 56 stable rule IDs, the eight base Super Review lenses, read-only boundaries, and configured worker model profiles.

- **New SQL Review skill (`skills/sql-review/`, `0.1.0`).** Adds six dialect-agnostic lenses (`schema`, `migrations`, `queries`, `transactions`, `indexing`, `app-boundary`) and three dialect contexts (`postgresql`, `mysql` with InnoDB primary baseline and MariaDB version/docs verification, and `sqlite`) across standalone `.sql` files, declarative/ORM schemas, and embedded SQL or DB call sites in Go, TypeScript, Rust, and Java. Requires a four-part proof (traced/quoted mechanism on the reconstructed cumulative schema and pinned dialect/version baseline, `written`/`schema`/`engine` basis, concrete impact, and a minimal dialect- and version-valid safer form) plus survival of an independent four-line challenge. Uses safe small-change pairing (`schema` + `migrations`, `queries` + `transactions`, keeping `indexing` and `app-boundary` solo so correctness and performance never mix in one reader), routes claims missing server version, cardinality, maintenance-window, or `EXPLAIN` evidence to `Needs your confirmation`, excludes cosmetic SQL formatting and broad security/compliance audits while retaining provable schema-evolution fragility and concrete SQL security-contract failures (SQL injection, unallowlisted dynamic identifiers, broken declared RLS/tenant isolation, `SECURITY DEFINER` missing `search_path`, and unbounded writes).
- **Native adapter, build, and family documentation integration (`adapters/`, `scripts/`, `docs/`).** Ships SQL Review in Claude Code (`/super-review:sql`), Codex (`$sql-review`), OpenCode (`/sql-review`), and Google Antigravity (`/sql-review`) while keeping Cursor on Super Review only; updates `scripts/build.ts`, `scripts/validate.ts`, `scripts/package.py`, and `scripts/check-opencode.ts`; and documents SQL Review's proof bar and sibling-skill boundaries in `docs/sql-review.md`, `docs/review-family.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/opencode.md`, `docs/antigravity.md`, `docs/native-integrations.md`, and `docs/model-profiles.md`.
- **Isolated evaluation corpus and mechanical verification (`evals/sql-review/`, `tests/sql-review.test.ts`).** Adds 12 contrasting `report`/`retain` packets (`SQL01`–`SQL12`) across all six lenses and three v1 dialects plus mechanical instruction, boundary, parity, and no-DB-CLI-execution checks across `tests/`.

Package, native configuration, and fixture checks pass; live behavioral model evaluation for sql-review remains NOT RUN.

## 3.37.0 — 2026-11-24

Hardens non-interactive `codex exec` and multi-round agentic orchestration across the review family (`super-review 3.37.0`, `defect-review 0.16.1`, `test-review 0.15.1`, `perf-review 0.10.5`) based on multi-repository production runs, while keeping all 56 stable rule IDs, the eight base Super Review lenses, read-only boundaries, and configured worker model profiles unchanged.

- **Pre-dispatch loading and headless triage discipline (`SKILL.md`, `references/workflow.md`, `references/harnesses/codex.md`).** Requires loading `SKILL.md`, the contract, the workflow, and the active adapter in full before spawning any child (preventing wasted preliminary ad-hoc passes in non-interactive `codex exec` runs). Clarifies that when an automated caller asks for impact/severity labels (`High`/`Medium`/`Low`), they map to maintenance impact on `R-001` recommendations without dropping the eight base lenses, running project tests/linters, turning the review into a defect/security audit, or issuing a merge-gate verdict.
- **No unrequested external CLI probing (`references/harnesses/codex.md` across all four skills, `references/harnesses/external.md`).** Explicitly prohibits probing external harness CLIs (such as OpenCode or auxiliary wrappers) or writing launcher logs in read-only sandboxes unless the user explicitly requested an external harness, and documents `--ephemeral` for read-only `codex exec` invocations.
- **Scoped follow-up delta review (`references/workflow.md#follow-up-delta-review`, `SKILL.md`).** Adds an explicit opt-in follow-up delta mode (`prior_head..new_head`) scoped to files and symbols touched by fix commits plus affected call seams, keeping previously rejected candidates closed unless an assumption broke and permitting compact pairs on small fix deltas (about 300 changed production lines or fewer).
- **Honest iteration cost and `Optional polish` separation (`references/review-contract.md`, `references/verification.md`, `assets/report-template.md`).** Replaces zero-cost edit prose with verification-and-churn-aware judgment and adds an optional, explicitly non-blocking `### Optional polish` subsection for minor local renames or purely stylistic tweaks so automated callers do not trigger extra fix/CI rounds for taste alone.
- **Antigravity adapter alignment (`references/harnesses/antigravity.md` across all four skills, `docs/antigravity.md`, `docs/model-profiles.md`).** Documents `Orchestrator (Neon/Carbon/Argon)` as composite modes alongside existing Hydrogen High routing and links `[external specialists](external.md)` from Antigravity Super Review.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.36.6 — 2026-11-19

- **Distilled Performance Review (`perf-review 0.10.4`).** Compresses `references/languages/rust.md` (241 to 86 lines), `references/languages/typescript.md` (133 to 85 lines), `go.md`, `java.md`, all six cross-language lenses, `contract.md`, and `workflow.md`, replacing API encyclopedias and duplicated syntax lists with on-disk stdlib/locked-crate verification (`Cargo.lock`, `vendor/`, `~/.cargo/registry/src`, `rust-src`/`rust-docs`), five diagnostic equivalence questions, and explicit `finding` versus `tradeoff` versus `not a finding` boundaries. `contract.md` and `challenge.md` require verifying both current cost and proposed cheaper forms against on-disk standard library and dependency source. Adds `AP43`–`AP50` Rust depth contrasts and records the [depth](https://github.com/Dankosik/super-review/tree/v3.36.6/evals/agent-patterns/results/2026-11-19-rust-perf-depth) and [distilled reader](https://github.com/Dankosik/super-review/tree/v3.36.6/evals/agent-patterns/results/2026-11-19-rust-perf-distill) probes across `AP33`–`AP50` on `flash` (100% recall across all 9 report cases, 0 false-positive plain findings across all 9 retain controls; challenger traps on the distilled prose are recorded as `NOT RUN`).
- **Rust cleanliness and `sqlx` guidance (`super-review 3.36.6`).** Refines Rust routing, context, lenses, profiles, and conditional library notes (`axum`, `errors`, `serde`, `tracing`), adds the conditional `references/rust/sqlx.md` note with orchestrator-selected `rust/*.md` resource paths, adds `RD81`–`RD98` contrasts, and records the [28-run Rust cleanliness comparison](https://github.com/Dankosik/super-review/tree/v3.36.6/evals/rust/depth/results/2026-11-19-rust-cleanliness) with offline `rustc 1.98.1` verification. All 56 stable rule IDs are unchanged.

## 3.36.5 — 2026-11-19

- Performance Review 0.10.3 checks owned UTF-8 conversions against the project's minimum Rust version and preserves lossy decoding on malformed input.
- The [Rust performance evaluation](https://github.com/Dankosik/super-review/tree/v3.36.5/evals/agent-patterns/results/2026-11-19-rust-perf) separates cached assignments from derived values, temporary owners from required snapshots, and abandoned Tokio work from shared completion. The extra cache prompt produced the same decisions as the baseline in the four paired cases.

## 3.36.4 — 2026-11-19

- Rust function-cohesion reviews now consider whether a callback owns a policy that callers could use by name. In the outbox comparison, the revised reviewer identified the retry classification inside the publication handler and retained the version with a named mapper.
- Rust control-flow and change-locality reviews distinguish enum matches that should force a decision on each new variant from uniform fallback policies. The guidance accounts for the defining crate of a `#[non_exhaustive]` enum.
- Rust API reviews check whether callers depend on a future deferring work until its first poll before suggesting a synchronous helper. The [nine paired specialist comparisons](https://github.com/Dankosik/super-review/tree/v3.36.4/evals/rust/depth/results/2026-11-19-rust-decisions) include both useful changes and cases where the reviewer kept the source.

## 3.36.3 — 2026-11-16

Distill Super Review 3.36.3 Rust lenses, crate reference notes, frontend/Spring contexts, and `existing-helpers` profiles from textbook syntax catalogs, minor-version release tables, and duplicated prose to semantic intent, boundary equivalence, and co-located `Keep when` rules, and eliminate all em-dashes across agent-facing instructions while keeping all 56 stable rule IDs unchanged.

- **Rust lenses and crate notes (`lenses/rust/*`, `references/rust/*`).** Compresses `api-clarity.md`, `representation.md`, and `duplication.md` plus `tokio.md`, `errors.md`, `serde.md`, `axum.md`, `clap.md`, and `tracing.md` to leading-word burden-to-target rules and semantic preservation boundaries, removing Clippy/Rust-Book syntax lists, Cargo feature tutorials, and a stale `std::fmt::NumBuffer` reference (`NumBuffer` lives in `core::fmt`).
- **Baseline verification and co-located `existing-helpers` (`frontend/context.md`, `spring/context.md`, `profiles/**/existing-helpers.md`).** Replaces hardcoded React/Next minor-version matrices, Spring release-note lists, and stdlib method/version catalogs with on-disk manifest/`.d.ts`/BOM verification, anti-folklore contract traps, and a unified `existing-helpers` priority and boundary-equivalence structure across Go, TypeScript, Rust, and Java.
- **Instruction prose hygiene (`references/**`, `tests/resources.test.ts`).** Removes all 37 em-dashes across 15 Super Review reference files and adds a mechanical assertion keeping `AGENTS.md`, `SKILL.md`, and `references/**/*.md` free of em-dashes across all four skills.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.36.2 — 2026-11-16

Distill TypeScript and Rust contexts and cross-language lenses in Performance Review 0.10.2 alongside Super Review 3.36.2 from API syntax cookbooks and library caches to semantic search anchors, anti-folklore traps, and `finding` versus `tradeoff` boundaries, tighten `AP33`–`AP36` Rust contrast symmetry, and codify intent-over-syntax authoring rules in `AGENTS.md` while keeping all 56 stable rule IDs and per-skill boundaries unchanged.

- **Intent over syntax in Performance Review (`perf-review 0.10.2`).** Compresses `references/languages/typescript.md` and `references/languages/rust.md` by ~40% and removes cross-language syntax duplication from `allocation.md`, `async.md`, and `io.md`: cuts inline API overload recipes, rewrite micro-templates, MSRV/limit lookup tables, and cached third-party library internals in favor of semantic cost models, on-disk dependency verification, false-positive guardrails (including `owned_vec.into_iter().filter(...)` in-place compaction, per-call `Regex::captures` slot allocation on misses, and `tracing` callsite `Interest` versus global `log::max_level()`), and explicit `finding` versus `tradeoff` boundaries.
- **Rust contrast symmetry and authoring discipline (`AGENTS.md`, `AP33`–`AP36`).** Aligns `AP33`–`AP36` public signatures, atomic `UNNEST` batching, and non-blocking `rayon::spawn` + `oneshot` offload across `report`/`retain` pairs, anchors `tests/perf-review.test.ts` on stable headings and decision boundaries rather than syntax examples, and updates `AGENTS.md` so source-verified boundary equivalence pairs with intent-over-syntax pruning instead of inline code-guard recipes.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.36.1 — 2026-11-16

Tighten browser, Web API, and Rust crate factual precision in Performance Review 0.10.1 alongside Super Review 3.36.1 and align `AP29`–`AP34` evaluation contrasts while keeping all 56 stable rule IDs and per-skill boundaries unchanged.

- **Browser event, `requestAnimationFrame`, and Web API precision (`perf-review 0.10.1`).** Replaces ~4 Hz `timeupdate` with frame-rate `touchmove` and `requestVideoFrameCallback`, distinguishes browser-coalesced `scroll`/`pointermove` from uncoalesced sub-frame `pointerrawupdate` (240 to 1000 Hz), per-point `getCoalescedEvents()` loops, and multi-source bursts, notes that browsers pause `requestAnimationFrame` when `document.hidden` while offscreen or settled loops in active tabs keep running, requires `clearRect` when eliding redundant `canvas.width` resets, separates completed-message streaming memoization (`finding`) from CommonMark in-flight block splitting (`tradeoff`) and offscreen `loading="lazy"` fetch deferral (`tradeoff`), documents `tailwind-merge`'s 500-entry LRU cache, notes that Zustand `persist` invokes `storage.setItem` on every `set()` even when `partialize` output is unchanged, and distinguishes `postMessage(ab, [ab])`, `postMessage(view, [view.buffer])`, and internal-seam `{ buffer: img.data.buffer, width, height }` transfers.
- **Rust `std`, `serde`, and pooled-client accuracy.** Clarifies `'\u{212A}'` (`to_lowercase() -> "k"`) versus `'\u{017F}'` (`to_uppercase() -> "S"`), scopes `entry_ref` to `hashbrown::HashMap` alongside `indexmap::IndexMap` `Equivalent<K>` lookups, notes `select_nth_unstable` top-`k` slice sorting, distinguishes `&self` pooled handles (`reqwest`, `sqlx`, `aws_sdk_*`) from `&mut self` per-task `.clone()` handles (`tonic` clients, `redis::AsyncCommands` on `ConnectionManager`), notes PostgreSQL's 65,535 bind limit on `QueryBuilder::push_values`, gates `serde_json::value::RawValue` findings on enabled `"raw_value"` features, documents `Option<Cow<'de, str>>` `#[serde(transparent)]` borrowing and `Content` heap buffering on `#[serde(flatten)]` / `tag` / `untagged`, and aligns `AP29`–`AP34` check names, Markdown tail rendering, and escaped-JSON `Cow` borrowing.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.36.0 — 2026-11-16

Expand frontend TypeScript and Rust hot-path coverage in Performance Review 0.10.0 alongside Super Review 3.36.0 across animations, streaming UIs, store subscriptions, large lists, browser storage, worker transfers, Rust collection/buffer reuse, `serde` streaming, pooled SQL/RPC clients, and Tokio/Rayon lock lifetimes while keeping all 56 stable rule IDs and per-skill boundaries unchanged.

- **Animations, gestures, and compositor frame loops (`perf-review 0.10.0`).** TypeScript context and lens routing cover continuous 60 to 120 Hz pointer, scroll, and `requestAnimationFrame` values driven through React `setState` (including Framer Motion `MotionValue` piped back into state), high-frequency event coalescing into `requestAnimationFrame` (distinguishing unpainted-frame findings from `getCoalescedEvents()` path-integration tradeoffs), idle `requestAnimationFrame` loops kept active while settled or hidden, layout/paint animations (`top`, `left`, `width`, `height`) versus compositor `transform`/`opacity` (separating out-of-flow findings from sibling-reflow or border-scaling tradeoffs), cross-component synchronous reflows across `N` sibling `useLayoutEffect` hooks, document-wide style invalidation from `:root`/`body` CSS custom property updates or per-frame runtime CSS-in-JS rule injection, per-frame Canvas/WebGL scratch allocations and unchanged `canvas.width` backing-store resets, and synchronous `canvas.toDataURL()` versus `toBlob()` / `OffscreenCanvas.convertToBlob()`.
- **Streaming UIs, store fan-out, list scaling, storage, and workers.** Covers `O(T^2)` full-buffer Markdown/highlight re-parsing and `O(T * M)` completed-row re-renders per SSE/WebSocket/`ReadableStream` chunk, coarse collection subscriptions re-rendering all `N` rows on single-item updates, page-root input state fan-out versus `useDeferredValue`/`startTransition`/`debounce` timing tradeoffs, synchronous derived-state `useEffect` double renders, per-row `IntersectionObserver`/`ResizeObserver` instances, closed modal portals, and invariant `twMerge`/`cn(...)` passes, bypassed virtualizers versus net-new virtualization / `content-visibility: auto` tradeoffs, client mount-then-fetch chains, unaborted superseded reads, root `"use client"` hydration and `* as Icons` namespace bloat, list media priority contention, unpartialized synchronous `localStorage` persistence (`partialize` findings vs `debounce` tradeoffs), per-item IndexedDB transactions, `structuredClone` versus structural sharing, and zero-copy `Transferable` worker `postMessage` buffers.
- **Rust `std`, `serde`, SQL/RPC pools, and async lock lifetimes.** Deepens `references/languages/rust.md` and lens triggers across buffer reuse (`clone_from`, `drain(..)`, `BufRead::read_line`, `Bytes::slice` versus long-lived backing-buffer tradeoffs), owned-key `HashMap::entry` cache-hit allocations versus `Borrow` `get` / `entry_ref`, eager `unwrap_or` / `ok_or` / `or_insert` fallbacks versus zero-capacity `Vec::new()` / `String::new()`, `slice::sort_by_key` `O(N log N)` key evaluations, `chars().collect::<Vec<char>>()`, `eq_ignore_ascii_case` (preserving Unicode `to_lowercase()` non-ASCII folding), `Regex::captures` and `RegexSet`, unbuffered `serde_json::from_reader` / `to_writer`, `RawValue`, `#[serde(flatten)]` / `tag` / `untagged` `Content` buffering, `DirEntry::file_type()`, redundant `Mutex` wrappers around pooled `reqwest`/`sqlx`/`tonic`/`redis` handles, `sqlx` batching and `rusqlite` `prepare_cached` / batch transactions, `match` / `if let` scrutinee lock-guard lifetime extension and `O(N)` `Drop` inside locks, `rayon::par_iter()` blocking Tokio workers, hot `tokio::select!` timer resets, `Arc`/`Bytes` channel fan-out, and `Cargo.toml` dependency findings versus tradeoffs.
- **Anti-noise guards and evaluation contrasts.** Rejects unprofiled `will-change` layer promotion, manual event delegation replacing React's root-delegated `onClick` on small lists, leak/unstable-key correctness bugs owned by Defect Review, zero-capacity Rust constructors in `unwrap_or`/`or_insert`, disabled `tracing::{debug,trace}!` / `log::{debug,trace}!` arguments, and unprofiled LLVM/SIMD/layout codegen claims. Adds eight symmetric evaluator-isolated contrast cases (`AP29`–`AP36`) in `evals/agent-patterns` and prose/anchor checks in `tests/perf-review.test.ts`.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.35.0 — 2026-11-16

Deepen frontend TypeScript coverage across Super Review 3.35.0, Defect Review 0.16.0, Test Review 0.15.0, and Performance Review 0.9.0 for React 19, SPA, Next.js, Tailwind CSS, and browser DOM stacks, written with flat leading-word rules, positive targets, co-located `Keep when` constraints, and branch-disclosed language contexts while keeping all 56 stable rule IDs unchanged.

- **Super Review (`3.35.0`).** Frontend routing and context resolve SPA query caches, client stores, form/schema bindings, and routers per owning package, including `.ts` hook, store, query, and form modules. React, Next.js, Tailwind, and TypeScript profiles and lenses target cache mirroring into local/store state, misplaced state scope, boolean status soup and raw HTML input leakage, flag-driven Effect chains, render-nested components, tangled multi-workflow closures, type-erased form/table props, ceremonial `useCallback`/`useMemo` on native DOM nodes, `"use client"` container and runtime barrel coupling, dynamic Tailwind utility fragments and semantic token bypasses, dead `typeof window` guards in browser-only callbacks, hand-rolled interactive `div`/overlay ceremony beside native DOM and local UI primitives, `e.currentTarget` narrowing, and `queryKey`/form-schema twin locality.
- **Defect Review (`0.16.0`).** TypeScript context and lens routing cover `e.target` versus `e.currentTarget` drift, cleared-input `"" -> 0`/`NaN` coercion and controlled-input `undefined` flips, unchecked `fetch` `res.ok`, stuck `isSubmitting` flags without `finally` and unguarded double submits, stale async UI generations and mismatched `queryKey`/`revalidateTag` invalidation, UTC `YYYY-MM-DD` date shifts, render-nested component remounts, `key={index}` and missing entity keys across record switches, render-scoped `debounce`/`throttle` timers, leaky observer/`createObjectURL`/scroll-lock Effects under `StrictMode`, implicit `<button>` form submission, mid-IME `isComposing` `Enter` handlers, SSR hydration drift and cross-request module-global state, `D -> H` `localStorage`/URL/Zustand `persist` incompatibilities, browser trust seams, and purged dynamic Tailwind classes.
- **Performance Review (`0.9.0`) and Test Review (`0.15.0`).** Performance Review defines UI hot-path units of work and covers layout thrashing in loops, non-passive scroll/touch listeners, React Compiler awareness, per-keystroke `O(N)` derivations, fresh `Context`/store-selector subscriber allocations, duplicate RSC reads without `React.cache()`, per-row RSC over-serialization, and eager barrel or `"use client"` module graphs (distinguishing direct-import findings from lazy-loading tradeoffs). Test Review covers hollow `vi.mock` child/query-hook doubles, cosmetic CSS assertions in place of behavioral state, unawaited `userEvent`/`rejects` promises, synchronous `getBy*` races, and premature negative checks (`isVisible()`, immediate `queryBy*`) before async transitions settle. Shared cross-language lenses stay free of framework syntax, and `evals/agent-patterns` adds sixteen symmetric frontend contrast cases (`AP13`–`AP28`).

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.34.0 — 2026-11-15

Expand Defect Review 0.15.0, Test Review 0.14.0, and Performance Review 0.8.0 to Go, TypeScript, Rust, and Java alongside Super Review 3.34.0, close cross-seam and rolling-deploy blind spots across all four skills, and tighten entrypoint activation and orchestration structure while keeping all 56 stable rule IDs unchanged.

- **Four-language review family (`Go`, `TypeScript`, `Rust`, `Java`).** `defect-review`, `test-review`, and `perf-review` add dedicated Go, TypeScript, and Java language contexts alongside Rust, update contracts, lenses, workflows, `openai.yaml` prompts, and native Claude Code, Codex, OpenCode, and Antigravity role descriptions, and preserve strict per-skill contract isolation.
- **Cross-seam, twin-propagation, and `D -> H` compatibility coverage.** Workflows shard large scopes along vertical call spines (`entry -> domain -> store`), add an active orchestrator cross-seam pass before challenge/decision, group large candidate batches by spine during Super Review verification, supply `D..H` removed merge-base lines and out-of-workspace lockfile dependency excerpts to shell-less subagents (`Antigravity`, `Cursor`), and allow read-only semantic navigation (`LSP`, `ast-grep`, symbol indexes). Contracts and lenses check asymmetric updates across unlinked twins (`encode`/`decode`, `cache_key`, `clone`/`reset`, single vs batch) and rolling `D -> H` state-in-flight payloads (plus `H -> H` round-trip tests that omit literal `D` fixtures). Adds the twelve-case evaluator-isolated `evals/agent-patterns` corpus (`AP01`–`AP12`).
- **Explicit activation and co-located orchestration.** Canonical `SKILL.md` entrypoints declare `disable-model-invocation: true` with single-sentence trigger descriptions aligned with `openai.yaml` and native adapter routes, placing `help` and missing-target stops ahead of adapter selection. Super Review orchestration and verification front-load leading terms, anchor `B`/`H`/`D` to standard Git endpoints, co-locate `task coverage` versus `candidate disposition`, move `#compact-pairs` behind a pointer, and codify the read-only pre-acceptance source checklist; `AGENTS.md` and `CONTRIBUTING.md` document authoring and immutable tag-release rules.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.33.0 — 2026-11-15

Tighten instruction clarity, trust boundaries, and structural judgment across Super Review 3.33.0, Defect Review 0.14.0, Test Review 0.13.0, and Performance Review 0.7.0 so reviewers verify internal claims and test designs against their direct idiomatic forms rather than trusting clean-looking surfaces.

- **Super Review (`3.33.0`).** `review-contract` and `verification` test changed structure against its direct idiomatic form (`Design It Twice`), define `load-bearing` boundaries and real versus hypothetical `seams` (one production adapter beside an internal test double is a hypothetical seam), and separate candidate synthesis from report formatting. `finding-template` drops duplicated contract prose, `aspects` replaces hedged negative routing cues with positive source signals, and `abstractions`, `function-cohesion`, `control-flow`, `data-flow`, and `defensive-checks` across Go, TypeScript, Rust, and Java front-load positive targets (pass-through fragmentation, hypothetical seams, cross-seam repackaging, silent fallbacks on settled facts) with co-located `Keep when` constraints. All 56 stable rule IDs are unchanged.
- **Defect Review (`0.14.0`).** Readers and challengers treat internal helper names (`validate_*`, `normalize_*`, `sanitize_*`, `ensure_*`, `reset`, `cleanup`), guards, silent fallbacks, and comments as claims to verify in callee bodies and callers, and treat comments or tests added in the same change as self-ratifying rather than prior contracts. Lenses add silent fallbacks (`unwrap_or_default`, `else { return Ok(()); }`, internal `_` arms, `filter_map(Result::ok)`), `Default`/serde-default bypasses, fail-open defaults, partial-step timeout helpers, detached fallible `Drop` cleanup, and `reload`/`reconnect` leaks; paired passes report each lens separately.
- **Test Review (`0.13.0`).** Aligns question leading terms on full `[promise]` contracts, treats diff-added assertions as under review rather than promises, reads removed merge-base lines when tests are weakened, and checks for testing past the seam (mock choreography and private fields), interior-only boundary inputs, unpinned sibling entry points, and silent-fallback mutants.
- **Performance Review (`0.7.0`).** Treats internal helper seams, layered conversions, and defensive clones as transparent to hot-path cost, flags cross-seam repackaging and repeated validation/serialization of settled internal data, and requires separate per-lens passes when paired.

Package, native configuration, and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.32.0 — 2026-11-15

Super Review now checks inline boundary glue around already-imported types and libraries, partial delegation of generic mechanics, split representations of one fact, and local-source boundary compatibility across Go, TypeScript, Rust and Java.

- **Existing owners and partial replacement.** The `existing-helpers` routing signal now keys on observable code shapes — non-domain helpers, single-purpose wrapper or guard types, manual standard or derivable trait/interface impls, and inline formatting, parsing, encoding, unit, coordination, query or request plumbing beside standard or imported types — rather than requiring the router to pre-know a library replacement. Base `duplication` and `existing-helpers` check under-used operations and constants on already-imported types, delegate generic framing or encoding to the library while keeping domain or protocol rules in application code, distinguish enabling a feature or workspace dependency from adding a net-new external package, and treat language baselines (`rust-version`, `go`, `target`/`lib`, `--release`) as unlocking stabilized standard-library replacements as well as bounding newer syntax.
- **Linked representations and one-off guards.** `representation` flags one fact held across separate carriers whose link the type leaves callers to maintain by hand — cached or derived projections detached from their source registry, duplicate parsed forms, inert mode-specific fields, and boolean flags or separate notifications beside another state carrier. `abstractions`, `lifecycle-ownership` and `data-flow` separate invariant-bearing guards from single-use cleanup wrappers (`std::mem::DropGuard`, `AbortOnDropHandle`, `defer`, `try-with-resources`), intermediate collections staged only for `Debug`/builders, and round-trip formatting or re-parsing used only to test an input property. Rust library notes cover `JoinSet::shutdown()`, `watch` + `Receiver::wait_for` in place of state-plus-`Notify`, `middleware::from_fn_with_state`, and avoiding two-pass Serde `Value`/`StrDeserializer` plumbing.
- **Boundary verification and kept custom code.** Read-only source access and verification allow inspecting locally present standard-library and lockfile-resolved dependency source (without running package managers, builds or network fetches) solely as evidence of API existence and boundary behavior: accepted inputs, first-error precedence, cancellation and drop timing, time precision, and wire or stored bytes. When custom code must stay because an apparent library API differs on one of those boundaries, `existing-helpers`, `rationale` and `verification` keep it and check that the concrete constraint is recorded at the site; conversely, workaround comments about calling a library indirectly become a cue to check for a direct API. Production-only scope and all 56 stable rule IDs are unchanged.

Shaped by reading production simplifications in a Rust service template (`RD69-RD74`). Package and fixture checks pass; behavioral model comparison remains NOT RUN.

## 3.31.0 — 2026-11-15

Antigravity review workers now request Gemini 4 Hydrogen with High reasoning.

- **Worker profile.** All six specialist, reader and challenger roles request `gemini-4-hydrogen-high`, including retries and continuations. An explicit user model/effort choice overrides the default; the orchestrator keeps the user's selected profile. This is a worker-role counterpart to Sonnet/medium and Terra/high, not a measured quality equivalence.
- **Native selection limits.** CLI 1.5.9 rejects a Hydrogen slug in subagent frontmatter, so the valid role configuration stays `model: inherit`. Inheritance meets the default only from a Hydrogen High parent; other parents need a native selector that explicitly supports that child profile. Missing availability or selection stops affected dispatch for a user choice, without silently substituting Flash/Pro, changing the parent or treating composite Orchestrator modes as Hydrogen High.
- **Evidence and delivery.** Adds selection research, raw model-discovery and rejected-configuration probes, and contrasting evaluator inputs for supported/missing selection, overrides and model/effort mismatches. Defect Review is now 0.13.0, Test Review 0.12.0 and Performance Review 0.6.0 to version their changed harness instructions. Review criteria and coverage remain unchanged.

Hydrogen was absent from the local available-model list. Native configuration and package validation pass; Hydrogen inference, end-to-end routing and comparative quality/cost/latency remain NOT RUN.

## 3.30.0 — 2026-11-15

Native Google Antigravity App and CLI support for all four review skills.

- **Antigravity plugin.** Four slash skills and six custom reader/specialist and challenger roles. Orchestration stays in the current chat; children use fresh contexts, native model inheritance and only file reading/search tools. Defect and Performance Review keep separate independent challenges.
- **Capability boundaries.** Unsupported model selections and missing custom subagents are reported explicitly. Complete native results are collected by task identity; an idle status alone is not a report. Review criteria, source policies and coverage defaults are unchanged.
- **Delivery.** Generated self-contained plugin, installation guide, checksummed Antigravity ZIP and CI validation with pinned CLI 1.5.9. Defect Review is now 0.12.0, Test Review 0.11.0 and Performance Review 0.5.0 to version their added harness resources.

Strict native plugin validation passes with four skills, six agents and no findings. Package checks do not establish model behavior: end-to-end discovery, tool enforcement, delegation, model routing and review quality have not been exercised in Antigravity model runs.

## 3.29.0 — 2026-11-12

Super Review now asks whether a computation needs every case and step it spells out.

- **New conditional lens: logic** (`go`/`ts`/`rust`/`java.logic.fewer-moving-parts`). For each computation a change adds or reshapes: is there a form with fewer cases, passes or intermediate values that gives the same result for every input and that a reader can check at a glance? It looks for a special case the general path already covers (empty, single, zero, first or last, a boundary index), cases a formulation removes (input normalized where it enters, an identity element, a sentinel or half-open range, a lookup table), a case product that independent decisions or a table state with fewer paths, and a detour through extra passes, intermediate collections, sorts or round-trip conversions. A finding shows the simpler form and traces, through quoted lines, that every removed case takes a path yielding the same values, errors, effects and order, edges included; a form that changes the result for some input is not a simplification. Cases stay when the unified rule needs a trick the reader must prove, when a special case states a requirement, or when an early exit is the shortest explanation. Each language names the edges that break equivalence: Go's nil versus empty slices and silent overflow; Rust's empty iterators, slice patterns and debug-build overflow panics; TypeScript's `reduce` on an empty array and its nullish, falsy, `NaN` and `-0` distinctions; Java's null versus empty collections, immutable `List.of()` and `%` versus `Math.floorMod`. Guards for cases already ruled out stay with defensive-checks, the layout of remaining decisions with control-flow, and values kept in sync with data-flow.
- Selected when changed code branches on special values or edges beside a general path, branches over combinations of conditions, or computes one result through several passes or conversions. 56 stable rule IDs.

Shaped by reading. Not compared in model runs.

## 3.28.0 — 2026-11-12

Performance Review 0.4.0 reports two kinds of saving a later pull request on the reviewed service found after the runs had passed over them: a faster hasher for tables only the service fills, and tables of log fields no longer filled in full. Readers had seen both places and set them aside, one by following the complexity lens, the other inside a larger change.

- **Hashing by who fills the table.** The complexity lens ruled out a faster hasher for any key that comes from a request. Flooding needs colliding keys in the table, so the line now follows who decides what goes in: keys the program assigns, a table filled at startup and entries added only after their key is verified take a faster hasher; a table that requests, peers or files fill keeps the default. The hash runs over the whole key, so a long key hashed per request costs the most. The runs passed over SipHash of a whole service token on every call; a faster hasher made that cache hit 105.5 → 43.6 ns in the service's own measurement.
- **Small is not hidden.** Amdahl's rule rejected a saving the dominant cost "hides from every caller and operator", and a challenger read tens of nanoseconds beside the rest of a call as hidden. A saving is now hidden only when the larger cost bounds the resource whatever the saving does, such as CPU saved beside a longer wait it runs alongside. CPU and allocations add up across units: a small saving is reported with the larger cost beside it, and the ranking places it.
- **A cheaper operation at the same count.** A faster hasher keeps every count. Such a finding gives the count, what one operation does on each side and the basis for its cost: the source of both implementations or a benchmark one of them publishes. The challenger and the orchestrator check that basis, and whoever applies the change times that operation alone. Under the counts rule of 3.26.0 alone, such a saving read as a missing step.
- **Initialization is work.** The allocation lens asks whether a unit allocates, copies or initializes more than it keeps or reads, and names storage filled to its capacity and read to a length, such as `[EMPTY; N]` beside a count. The contract counts a hash over the whole key and storage initialized to its full capacity. A span with two fields initialized 192 table entries; filling only the used ones made creating it 405 → 335 ns.
- **The free part of a tradeoff.** When removing a whole cost is a tradeoff, a form that removes part of it and keeps everything is a finding of its own. A reader folded filling only the used entries into a per-thread buffer that holds memory on every thread, and the free part was reported only as a tradeoff.

Shaped by reading the runs on the crates that pull request changed. Not compared in model runs.

## 3.27.0 — 2026-11-12

The existing-helpers profile looks beyond small functions. It now asks who already does any code a change writes by hand for a general job, in Go, TypeScript, Rust and Java.

- **Hand-written mechanisms.** Besides a small function, the profile covers a whole mechanism or implementation written by hand for a general job, rather than the project's own domain, that the standard library, a dependency or code generation (a derive, a record, an annotation) already provides. Size does not matter; a maintained owner of the same knowledge does. A replacement must keep every behavior the users of such a mechanism rely on. The profile states this as a principle, without lists of examples.
- **Chosen dependencies.** A dependency the build already declares, or one the project's documentation recommends for the job, is the team's choice: hand-written code doing that job is the clearest candidate, even when nothing uses the dependency yet. A recorded decision against a library for the job keeps the hand-written code, cited where it is recorded.
- Verification and the routing row apply the same search to any hand-written code a change adds.

Shaped by reading a library audit of a Rust service template. Not compared in model runs.

## 3.26.0 — 2026-11-12

Performance Review 0.3.0 takes in fifteen real runs on a Rust service. Defect Review 0.11.0 and Test Review 0.10.0 share its rule for reading. The instructions of all four skills now say what an agent must achieve, not how to do what it can work out itself; outside Performance Review no review criterion changes.

- **Reading in full.** A branch the user names, such as the main branch, is pinned to one commit. Every agent reads what it reviews in full: a part it did not see, for whatever reason, is not read, and it finishes that part before it reports. In the runs, about half the whole-file reads through the shell came back cut, readers reported the rest as unread, and orchestrators started readers again for it, up to 21 agents on one crate. The instructions state the goal, not a read command.
- **No readers where nothing runs per unit.** When every entry in the scope only starts, wires or stops a long-lived program, the report lists the entries, how often each runs and where the per-unit work runs, and no readers start. One run started twelve readers on such a crate and found nothing.
- **Findings on one path are checked together.** Two findings each kept behavior, but applied together they let a stopped request start an introspection call; only an existing test caught it. The orchestrator now walks the forms that touch one function or path applied together, and says which to apply or how to combine them.
- **Outside a narrowed scope, one line.** A cost whose cheaper form changes only code outside the packages or files the user chose, sibling or not, is named with its location and not traced or challenged. Parallel runs on neighboring crates traced the same code up to three times and then changed it in conflicting branches.
- **Predicted counts.** Each finding states counts per unit before and after, such as `3 → 1 allocations per request`. The challenger and the orchestrator check them, and whoever applies the change checks them first: a count does not depend on machine load. Time is measured only where the saving is time, on an otherwise idle machine. In the runs, half the applied changes were merged without any measurement, and timings on a loaded machine varied twofold. Each reallocation of a growing buffer counts as work, and the allocation lens names values built only to take their length: one run predicted one to three saved allocations where the change saved seven.
- **Waiting.** The Claude Code harnesses keep the fact that the forked turn ends at the orchestrator's first reply without a tool call and that completion notices of the processes it started do not reach it, and say not to reply while they run. The recipe of foreground shell calls of up to ten minutes is gone, and so is the wait loop on exit files in each `external.md`.
- **Processes of other reviews.** Each `external.md` still keeps a review's processes apart, records each one's PID, output and exit code in the review's own directory, and never selects processes by name or command line; the shell line that did the recording is gone. Flags come from what the installed CLI documents, not from memory, without a prescribed `--help` step.
- **Super Review source access.** The `gh` commands, Git inventory steps, hashing, `--` and NUL-delimited listings are replaced by what they protect: PR identities resolved by reading only, staged source read as the captured index, one fixed version of working files for every specialist, paths that never become options or commands, and no repository-configured command (external diff, textconv, pager, fsmonitor) run during inspection. Verification reads the target files' history rather than running `git log`, and the other three workflows no longer say where in Git to read a PR; fetching its commits is still allowed.
- **Super Review scheduling.** The workflow keeps the default of eight running children, the user's override, the host's limits and that a finished child's slot goes to the next ready task; the slot-release, batch and queue steps are gone. Codex keeps the fact that a finished child can hold its slot until it is closed. Tool names for reading and waiting are gone from the Codex, Cursor and OpenCode instructions and the specialist roles, and "using Read" from the Claude commands.

Shaped by reading. Not compared in model runs.

## 3.25.0 — 2026-11-12

Super Review now asks who already does what a new helper does.

- **New profile: existing-helpers** (owner duplication) for Go, TypeScript, Rust and Java. For each small function a change adds for a general operation (strings, collections, numbers, time, paths, retries, parsing, comparison), often at the bottom of a file, it searches in order: the standard library at the project's language version, a helper already in the repository under any name, a dependency already declared, and only for logic with real edge cases a widely used new dependency, named as a cost for the team to weigh. The reverse case too: the same helper written in several files is extracted once it has a second user today, to where the project keeps such helpers or to the concept it serves; a use that might come later is Speculative Generality. A replacement must behave the same on the edges callers reach (empty and absent values, Unicode, rounding, ordering and ties, errors); a helper with domain meaning, or a two-line one whose replacement needs a dependency, stays. Each language lists its version-bound standard operations and the edges that differ.
- **Verification** applies the existing-owner search to helpers the change adds, not only to remedies the review proposes.

Shaped by reading. Not compared in model runs.

## 3.24.0 — 2026-11-12

Super Review says how it sizes a review: when to split an area, how many tasks it starts, and a compact mode for small changes.

- **Splitting areas.** A lens's work is split by area when its files are more than one specialist can read in full, as in Defect Review. Before, large changes were split into "coherent areas" by judgment.
- **Task count.** The orchestrator announces how many tasks it will start. A whole-project review that would start more than forty asks the user whether to narrow it or run it as planned.
- **Compact review, on request.** When the user asks for a compact review of a small change (about three hundred changed production lines in one package or module, or a package of about a thousand lines reviewed whole), one specialist takes a related pair: naming with api-clarity, control-flow with function-cohesion, abstractions with duplication, data-flow with representation, change-locality with placement, rationale with conventions. A small change then takes five or six specialists instead of eight to twelve. Each lens of a pair reports its own coverage, and the report marks the pair. Whether pairing costs attention is unverified, so one lens per specialist stays the default until a comparison shows no lens loses annotated improvements.

Not compared in model runs.

## 3.23.0 — 2026-11-12

Child agents default to cheaper models; the user still picks the orchestrator's model and can pick the children's. Super Review 3.23.0, Defect Review 0.10.0, Test Review 0.9.0 and Performance Review 0.2.0 share these defaults.

- **Claude Code.** The review commands and orchestrators no longer pin `opus`: the orchestrator runs on the session's model and effort. Specialists, readers and challengers select `sonnet` at `medium` effort. No child defaults to an Opus- or Fable-class model.
- **Codex.** Every child gets `gpt-6.1-terra` with `high` reasoning effort. Super Review no longer chooses between `gpt-6-luna` and `gpt-6-sol` per task.
- **Explicit choice wins.** A model or effort the user names for children applies to every child and continuation of that review; in Claude Code the orchestrator passes it as the Agent call's `model` and `effort`. The orchestrator does not raise either on its own judgment.

Not compared in model runs.

## 3.22.0 — 2026-11-12

Super Review now asks whether code lives where a reader would look for it.

- **New conditional lens: placement** (`go`/`ts`/`rust`/`java.placement.find-it-where-it-belongs`). For each declaration a change adds or moves: which package, module, directory or file would a reader who knows the concept but not the code open first, and does it live there? The lens names what it looks for with words a model already knows: Feature Envy at module level, Divergent Change at file level, a grab-bag `util` or `common`, colocation with the only user, and drift from the layout the module already uses consistently (by feature or by layer; one precedent is not a layout). A recommendation names the destination and the search it saves; code stays put when a move saves no search. Each language names what a move costs: Go's package as the unit and `internal/`; Rust's module path as part of the name, `pub use` to keep it and visibility that moves with the item; TypeScript's import paths, barrels, `exports`, module evaluation, framework-fixed files and `"use client"` boundaries; Java's package-private visibility, fully qualified names in reflection, `module-info` and Spring scanning. One decision spread across files stays with change-locality, dependency direction with dependency-boundaries, and the way a concern is handled with conventions.
- Selected when a change adds, moves or renames files, modules, packages or directories, puts a declaration where the name describes another concept, grows a file with another responsibility, or adds to a `util`-like location. 52 stable rule IDs.

Shaped by reading. Not compared in model runs.

## 3.21.0 — 2026-11-11

A fourth skill, **Performance Review** 0.1.0 (experimental, Rust): it finds work a hot path does not need and proposes a cheaper form with the same observable behavior. Super Review, Defect Review and Test Review are unchanged.

- **What a finding is.** Four parts, each checkable from the quoted lines:
  - the hot path: where the code is reached from and why it runs often for the program's unit of work (a request, a message, one run of a command-line tool with its startup), on the evidence of the source, a document or benchmark in the repository, a profile the user supplies, or the user's words. An error path counts when real input takes it routinely;
  - a cost trace that counts the work for one unit and what multiplies it, into callees and dependencies at their `Cargo.lock` versions, never as invented milliseconds;
  - a cheaper form and what it keeps (results, order, errors, what has happened on a failure halfway, drop timing, `Send` and `Sync`, public API), building within the project's `rust-version`, edition, features and targets;
  - the resource saved, set beside the path's largest cost for that resource, with any work that only moved named.

  A candidate with a gap is unproven. A cheaper form that changes the public API, needs `unsafe`, adds a dependency, notably hurts readability, spends more CPU in parallel for less latency, buys throughput with each item's latency, or starts work an earlier failure would have stopped is a tradeoff, with both sides shown.
- **Scope.** Memory footprint beyond the allocator's work on a hot path, build profiles, link-time optimization, the global allocator and compile time are out of scope. Claims about what the compiler, the hardware's caches or a database's query plan do need a profile, a benchmark, a plan or a documented guarantee, from either side.
- **Six lenses**, one per independent reader, paired for a small change: complexity with allocation, async with contention, io with repeated-work. Each asks one question and has Expect, Look for and Not a finding sections, using names a model already knows: asymptotics, needless clone, allocation per iteration, blocking call on the async executor, lock held across `.await`, N+1, round trip, buffering and batching, contention and false sharing, loop-invariant work, over-parallelization. They also name costs common in Rust services: deserializing through `serde_json::Value`, a boxed future per call, routine `anyhow` errors, `#[instrument]` on a function called per element, metrics looked up by labels on every call, and queries no index in the migrations covers (unproven without a plan).
- **Whole-project scope** starts from where work enters the program: handlers, consumers, a command-line tool's main loop, scheduled jobs, a library's public interface, benchmarked functions, the frames of a supplied profile. Readers get what those entries reach; the report lists the entries and what they did not reach.
- **Independent challenge** on four lines: the path is not hot, the work is not done, the cheaper form changes behavior or does not build for the project, a larger cost swallows the saving. Verdicts are `stands`, `falls` or `tradeoff`; the orchestrator walks every trace and decides.
- **Report.** Outcomes are finding, tradeoff, unproven and rejected, ranked by work removed per unit: a change of complexity class, then a round trip or blocking wait per element, then an allocation per element, then constant work, which is listed compactly. Candidates that wait only on evidence that their path is hot become questions to the user. The report ends with instructions for whoever applies a finding: measure a release build before and after in the way the saved resource demands (a benchmark for CPU and allocations, load at production concurrency for contention and async waits, counts of queries or round trips for I/O), keep the existing tests passing, keep the change only if the gain shows, and say so when it does not.
- **Reading only.** Nothing is built, run, benchmarked or profiled.
- **Delivery.** `/super-review:perf` in Claude Code with the `perf-orchestrator`, `perf-reader` and `perf-challenger` roles, `$perf-review` in Codex, `/perf-review` in OpenCode with its own roles, and external harnesses on explicit request. The standalone archive is `perf-review-0.1.0-skill.zip`.
- The design is recorded in the [family design](docs/review-family.md).

Shaped by reading. Not used on a real repository and not compared in model runs.

## 3.20.0 — 2026-11-11

Defect Review 0.9.0 and Test Review 0.8.0 get the writing changes of 3.19 that fit their own bar. Super Review's instructions are unchanged.

- **Defect Review: names for bug classes.** Lens items now carry the names a model already knows: off-by-one and fence-post (results), swallowed error and fail-open (errors), check-then-act across a suspension point (TOCTOU), lost update and lost wakeup (shared-state), fire-and-forget task, cancellation safety and leak (lifecycle), an unpropagated deadline (time). They label existing items and add no new demand.
- **Defect Review: one cause, one candidate.** The orchestrator merges candidates with the same cause even when they surface at several places or through several lenses, and reports one candidate with each effect's trace. A candidate the orchestrator finds itself while reading goes through the same challenge as any other.
- **Defect Review: when a lens is finished.** A lens is finished when every operation in its files has been taken through the lens's Expect list.
- **Test Review: mutation-testing words.** A finding is a surviving mutant; a test that fails kills it; the witness separates an unpinned behavior from an equivalent mutant. Oracles names tautological assertions and assertions on the mock; determinism names flaky tests. Report counts read killed and surviving.
- **Test Review: one witness for several findings.** Where several proven findings touch one operation, the orchestrator checks whether one witness kills all their mutants and gives it once.
- **Test Review: closing instructions.** The report ends with instructions for whoever adds the tests: run each witness on the original code, apply its mutant locally and see the witness fail, revert, and report a witness that does not behave that way instead of adjusting it.

Shaped by reading. Not compared in model runs.

## 3.19.1 — 2026-11-11

Republishes 3.19.0 with the same review instructions. The 3.19.0 GitHub release was created by hand before the tag's release job ran and was then deleted; releases are immutable, so that tag can carry no release. This version's release comes from the tag's own CI job. AGENTS.md now records how a release is published.

## 3.19.0 — 2026-11-11

The orchestrator now decides what the code should become, not only which candidates survive, and the instructions say what to aim for instead of what to avoid.

- **Aim for the best version.** A new section in verification asks the orchestrator for the version a strong engineer in the language would write today, with behavior and the project's conventions held fixed. Each specialist answered one question; the orchestrator sees all of them. It rewrites a workable remedy when it sees a better one, designs code that several candidates touch once, fixes a cause that candidates from different lenses share, and then reads the accepted recommendations applied together. Anything still missing becomes its own candidate under the same bar, and a remedy it rewrites or adds passes the same preservation, lint and existing-owner checks as any other. Writing the edit costs nothing, so its size is no reason to settle for less.
- **Shared vocabulary.** The contract names burdens with words the model already knows: shared knowledge, deep and shallow boundaries, the deletion test, locality, and Fowler's smells (Mysterious Name, Data Clumps, Primitive Obsession, Feature Envy, Shotgun Surgery, Divergent Change, Speculative Generality, Middle Man). Specialists use them in observations, so the orchestrator can see when findings from different lenses are one thing. A term names a burden still to be shown in source.
- **Target behavior instead of prohibitions.** The judgment section of the contract and the lenses for Go, TypeScript, Rust and Java state what to aim for where they used to list what not to do. Abstractions anchors on the deletion test, naming on Mysterious Name, change-locality on Shotgun Surgery and Speculative Generality, representation on Primitive Obsession and Data Clumps. Technical guardrails (ownership and lifetimes, null and proxies, inference and evaluation order) and scope boundaries stay as they were. Rule IDs are unchanged.
- **One place per rule.** The rule that an unresolved remedy stays out of implementation advice, the separation of coverage from candidate disposition, and the rule that agent agreement is not evidence each lived in three to five files the orchestrator reads together. Each now has one home. SKILL.md points to the workflow and contract instead of restating them.

Shaped by reading, after Matt Pocock's writing-for-agents guidance. Not compared in model runs.

## 3.18.0 — 2026-11-11

Four new questions for what reviewers rarely look at, and a written standard of well-written code for Go, TypeScript and Java.

- **Craft for Go, TypeScript and Java.** Rust already had a description of how an experienced author would write the operation today, and a map of which lens owns which idiom. The other three languages only told reviewers to apply language knowledge inside the assigned lens. Each now has its own Craft and Idiom owners sections, which name the defaults of the community sources (Effective Go, Code Review Comments and the Google Go guide; the TypeScript Handbook, typescript-eslint and the Google TS guide; Effective Java) rather than restating them. An idiom earns a recommendation by what it removes. Committed linter configuration (`.golangci.yml`, ESLint/Biome and `tsconfig` strictness, Checkstyle/PMD/Error Prone/SpotBugs) is the project's adopted choice.
- **New conditional lens: conventions** (`go`/`ts`/`rust`/`java.conventions.follow-established-approach`). Does the change handle a recurring concern differently from how the codebase already handles it? Examples: errors, logging, configuration, HTTP clients, validation, time. The lens searches the owning package, module or crate first, then the repository or workspace for precedent. A single precedent, a deprecated form, or a split between two forms without a direction establishes nothing. When the established mechanism also does something the new code does not, the remedy stays unresolved if the difference is a decision (retrying, mapping errors); otherwise the recommendation states the effect. Reimplementing a helper stays with duplication (in Go, also abstractions).
- **New profile: unused-surface** (owner abstractions). The profile looks for:
  - parameters every caller passes the same;
  - options nobody sets;
  - exports with no importer;
  - variants nothing constructs;
  - the last use of an item that the change removed.

  A used item declared wider than its users is visibility, which stays with dependency-boundaries. Visibility bounds the search. Framework, reflection and signature-fixed uses count as uses. A branch for a value from outside the code is not dead merely because nothing in the snapshot constructs it. An item only tests use is unused surface unless it is a deliberate seam.
- **New profile: defensive-checks** (owner control-flow). A guard for a case the code already rules out tells readers the case can happen. A candidate needs the guarantee traced through quoted lines; without the trace the guard stays. Guards at trust boundaries stay. TypeScript types count as evidence only where checked code produced the value. The opposite shape, the same check repeated downstream, moves to the entry point.
- **New profile: diagnostics** (owner rationale). Can a reader of a log record or error message tell which operation failed, on which subject? The profile covers:
  - missing identifiers;
  - context repeated across wrapping layers;
  - one failure appearing several times in the output (which layer reports it stays with error-expression);
  - inconsistent structured field names.

  Rewording error text checks its consumers first. A level change classifies an outcome, so its remedy stays unresolved. New events and metrics are out of scope.
- A selected profile whose owner is a conditional lens now selects that owner for the area; the workflow notes this exception to "profiles add no workers".

Every claim about language practice was checked against its community source and corrected where the source disagreed. The sources were:
- Go: Effective Go, Go Code Review Comments, the Google Go Style Guide;
- TypeScript: the TypeScript Handbook, typescript-eslint, the Google TypeScript Style Guide;
- Java: Effective Java, the JDK Javadoc and JEPs, the SLF4J and Spring documentation;
- Rust: the Rust API Guidelines, the Cargo SemVer chapter, std, thiserror and anyhow;
- across languages: Fowler's Refactoring and "Parse, don't validate".

Four rounds of independent checks found and fixed errors, overstatements and contradictions with neighboring lenses and the review contract. The last round cut detail a current model already knows from those sources and kept the decision rules, the traps reviewers get wrong, and recent changes such as Next.js 16; the four language versions of each profile now share one structure. Go and Rust compiler behavior was checked with go 1.27 and rustc 1.98, and JavaScript behavior with node 26. Java and TypeScript compiler rules were checked against the JLS and the TypeScript documentation, not with javac or tsc. Not yet compared in model runs, and no evaluation cases were added.

## 3.17.0 — 2026-11-11

Next round of fixes from the same 22 runs. Most problems surfaced only when the report was implemented.

- **A remedy must not duplicate an existing owner.** One recommendation added a `CleanupDisposition` type that infra-webhooks already had; the repository's duplication gate caught it during implementation. A remedy that introduces a type, helper or constant now needs a search of the snapshot for an existing owner. The orchestrator either reuses the owner or says why a new one is needed.
- **Remedy checks cover more project checks.** The viability check from 3.16 covered lints only. It now also reads the other checks the project's CI or build files run, without running them:
  - duplication baselines;
  - generated or template-region markers;
  - documentation checks.

  The reviewed repository has no `SUPER_REVIEW.md`, and runs met these only when implementing.
- **Recent names and shapes stay put without a reason.** Re-reviews renamed names that had just been introduced (`timer` → `watcher`, `Admission`) and revived proposals rejected days before. When `git log` of the target files shows a name or shape is recent, changing it now needs a burden it causes, not a preference. Only the orchestrator uses this history; specialists still get none.
- **The report closes with three instructions for whoever implements it.** In every run the user answered "внеси все рекомендации". The implementing agent then:
  - settled unresolved items itself, including a JWKS `key_ops` relaxation;
  - departed from recommendations without saying so;
  - changed code beyond the report.

  The three instructions are: implement only accepted recommendations, keep the stated observable effects, and name any departure and its reason.
- **Defect Review 0.8.0 and Test Review 0.7.0 get the external-harness launch rules from 3.16:**
  - OpenCode effort is passed as `provider/model#variant`, with no metadata probing or trial tasks;
  - the user's own OpenCode configuration is never loaded;
  - a model or effort that cannot be honored stops dispatch with a question, never a substitution disclosed afterwards.

  Their source rules are unchanged: they read the branch with its uncommitted work by design.

Checked by reading against the runs; not yet tried in a model run.

## 3.16.0 — 2026-11-11

Fixes from 22 Super Review runs on `rust-service-template-rest` (skill 3.5–3.10; specialists on Sonnet, Opus and DeepSeek Flash in OpenCode). Across them, about 400 recommendations reached `main` in about 25 PRs, and none turned out to be wrong in substance. What failed was process.

- **Observable changes are labelled.** A readability change may change what callers, operators or logs see, and that is allowed when the clarity is the gain. Each recommendation now states its observable effect (`none` or what changes). The summary may claim behavior is unchanged only when no recommendation has an effect. Three reports had said "ни одна рекомендация не меняет поведение" while they:
  - added a public error variant;
  - changed `Display` text;
  - removed a runtime check.
- **A change to a decision the code makes stays unresolved**: what it accepts, rejects, retries or permits, or how it classifies an outcome. Examples: `COMMIT` with `25P02` reclassified as `CommitUnknown`, and JWKS keys with `["sign","verify"]` admitted.
- **A specialist's precondition travels into the recommendation**, or the remedy stays unresolved. One run dropped "needs owner confirmation" and recommended deleting a defensive line in authn.
- **Workspace-internal APIs are the orchestrator's call.** Runs had left 13–22 unresolved "public API decisions" each, even where every consumer was inside the workspace. The orchestrator now decides when all inspected consumers are internal and nothing marks the item as published.
- **A model or effort the user chose is not silently replaced.** Runs on 3.9.x replaced the requested OpenCode specialists with native ones, and one replaced "terra 6.1" with Opus; each disclosed the swap only in the report. The contract now says to ask before dispatch. The Claude adapter now says to look for a model that native Agent cannot select in an installed external harness, and to ask.
- **OpenCode effort is passed as `provider/model#variant`.** Missing variants in cached metadata do not mean none exist. Runs had spent 3–10 calls probing, and one dropped the requested `#high`. Never load the user's own OpenCode configuration.
- **Branch is recorded.** Source access records the branch, and the report names which target files differ when HEAD is not the default branch or is behind its upstream. One run reviewed a HEAD that a merged PR had already rewritten; others reviewed another session's unmerged branch.
- **Specialists read the pinned copy, never the live checkout, even when it is clean.** Three runs pointed specialists at a checkout that other sessions were editing.
- **Report hygiene:**
  - stated counts match the R headings and the decision table, with no placeholder R-IDs;
  - the report is in the language of the user's request even when packets are English;
  - a finding's affected files include excluded tests and other uses the change must update. One recommendation broke compilation of an excluded test module.

- **The orchestrator owns its decisions.**
  - The runs checked facts well: they caught a "nonexistent parameter" that was a SQL column and a misread comment, and verified dependency claims in `~/.cargo/registry`.
  - Decisions were the weak part. Two runs rejected nothing (34 of 34 and 55 of 55 accepted); some decision rows had no reason; risky changes were "accepted with disclosure".
  - Remedies broke at implementation: clippy rejections, `dead_code`, an E0618 name clash, a broken test module.
  - Choices between supported alternatives were handed to the user, who answered "возьми ответственность сам".
- **What verification now requires:**
  - The orchestrator answers for each accepted recommendation as if it wrote it, and a decision needs its own reason.
  - It chooses between supported alternatives itself.
  - `unresolved` is kept for a fact the source cannot supply, which must be named, or for a changed decision.
  - Before accepting, it checks the resulting code by reading against lint policy, every use (including excluded tests), name collisions and dead code.
  - A remedy's main point is never optional.

Checked by reading against the runs; not yet tried in a model run.

## 3.15.0 — 2026-11-11

- Fix external-harness waits under the Claude Code commands. `/super-review:review`, `/super-review:defects` and `/super-review:tests` run the orchestrator as a forked turn that ends at its first reply without a tool call, and background processes ended with it. In 6 of 17 Defect Review runs with OpenCode readers in `rust-service-template-rest` the orchestrator wrote "the readers are still running" and returned; every reader then died with ECONNRESET within seconds, which the main session reported as a provider failure. Each skill's `external.md` and Claude adapter now say to wait in foreground shell calls until the review's own exit files appear and never to end the turn while its processes run.
- Keep concurrent reviews apart. Runs matched processes by command line: one `pkill -f 'agent defect-reader'` killed another session's readers, and another session reported a third session's processes and outputs as its own. Each review now records its own PIDs and exit codes in its own directory, waits on, retries and stops only those, never uses `pgrep -f` or `pkill -f`, and does not read other runs' files or the harness's shared logs.
- Defect Review 0.7.0 and Test Review 0.6.0: the orchestrator descriptions say a review is started by its command, not by another agent. Asked in a plain message, main agents had started `defect-orchestrator` directly on Sonnet and added rules of their own: "keep the fan-out modest", lists of deliberate choices not to report, severity, suggested fixes and CONFIRMED/PLAUSIBLE verdicts. Three such runs paired lenses on a large crate, grouped challengers by claim, wrote English reports for a Russian request, and one ran no challenge. The orchestrators now take only the target, its narrowing and the user's harness, model and effort from a request, pass nothing else to readers, name what they set aside, and write in the language of the user's request.
- Defect Review merges candidates with the same cause before the challenge (one bug found by three readers had gone to three challengers), keeps a reader's incomplete trace unproven unless the orchestrator finishes the step from the source instead of handing it to a challenger, and treats a step about standard-library or database behavior nobody read as unproven. The report template repeats that it carries no severity labels or fix advice. Readers no longer get what was settled before the review (earlier findings or fixes, decisions to respect, severity), on every adapter.
- Defect Review looks for what the first runs missed. Second runs on grpc, cache and http found significant bugs the first had not, among them a sibling of a confirmed one: a CA that is not X.509 was caught in grpc and missed in cache. After deciding, the orchestrator now searches for siblings of each bug that stood (the same call elsewhere, the client and server sides of one check, the startup and running paths of one wait) and gives them to one fresh reader as the one task that gets a known bug. Scope a reader reports it could not read goes once to a fresh reader with the same lens, and a lens is split by area when its files are more than one reader reads in full. A package of about a thousand lines reviewed whole gets lens pairs, as a small change does.
- Wrong behavior whose harm is a security one, such as a credential sent to a host nobody configured, stays a bug; only hunting vulnerabilities as such is out of scope. Each finding states its trigger concretely enough for a test to set up and its reach: this repository's own code, or only the public interface. The report puts reachable bugs first and names files that changed while agents read, after checking HEAD and the scope's status again.
- The `/super-review:review` orchestrator gets the same guard against rules a calling agent adds. Of 21 bugs from four of these runs that a separate agent checked, none was shown false; the changes address process failures, not precision. Not yet tried in a model run.

## 3.14.0 — 2026-11-10

- Ship Defect Review 0.6.0 and Test Review 0.5.0 in the OpenCode package. Run `/defect-review` or `/test-review` in a session the `super-review` launcher opened. Each review has its own primary role and subagents: `defect-review` starts only `defect-reader` and `defect-challenger`, and `test-review` starts only `test-reader`. Every role denies all tools but read, glob, grep and shell, and no subagent can delegate or load a skill. The subagents use the specialist model the launcher or `SUPER_REVIEW_SPECIALIST_MODEL` selects, and project configuration cannot replace them. Each skill gains `references/harnesses/opencode.md`.
- The native OpenCode check now covers all seven roles, their commands and skills, including a reviewed repository that defines roles with the same names. It passed locally on OpenCode 2.2.3; OpenCode 1.18.29 is checked in CI. No review has been run through these roles yet.

## 3.13.0 — 2026-11-10

- Let the user run Defect Review readers and challengers, and Test Review specialists, in another installed harness, such as OpenCode subagents under a Claude Code orchestrator, as Super Review already allows. Asked for "subagents through OpenCode Go", the Defect Review orchestrator had refused because its role allowed Bash only to find and read source, and fell back to Claude subagents. Each skill now has its own `references/harnesses/external.md`. OpenCode has no installed Defect or Test Review role, so each process defines a read-only one through `OPENCODE_CONFIG_CONTENT` (deny everything but read, glob, grep and shell), with project configuration disabled and a private server. Only the user's request selects the harness and model, and an unavailable CLI or model is reported instead of silently falling back. Defect Review is now 0.5.0 and Test Review 0.4.0. Not yet tried in a model run.

## 3.12.1 — 2026-11-10

- Fix the OpenCode launcher when it is started through a symbolic link, such as one in `~/.local/bin`: it took the link's directory for the package and found no review agents. It now follows links to the package.

## 3.12.0 — 2026-11-10

- Add Defect Review 0.4.0, a separate experimental skill in the same plugin that hunts bugs in Rust source by reading it. Independent readers each take one lens, or a related pair for a small change: results, boundaries, errors, time, lifecycle, shared state, stated facts and team rules. In a change review they also read removed lines and the callers of what changed. A bug needs a trace through the code (a trigger real use can produce, each step as a quoted line, what the affected party observes), a stated expectation with its basis (a written statement, what the code declares about itself, or a named engineering principle), a harm, and survival of an independent challenge. A written promise is not a precondition, and a document that describes harmful behavior does not settle the claim.
- The challenge is what holds false positives down. A second agent receives each claim with its trace and without the finder's reasoning, follows the trigger through the source itself, and tries to show the claim is wrong. Its verdict is an argument the orchestrator checks. A deliberate choice whose stated reason holds is reported as disputed, with the cost and the decision side by side.
- Add Test Review 0.3.0, a third separate experimental skill: would the tests of Rust source fail if a plausible bug appeared? A finding names a promised behavior no test pins down and shows it with a mutant (one small, plausible mistake in production code that breaks a quoted promise, written as a diff and never applied), why each test that reaches that code would still pass, and a witness: the check that holds for the original code and fails for the mutant. A test that breaks a written team rule for tests is proven by quoting both; an unstable test by two orders of events it permits. Five questions: behavior, failure paths, oracles, determinism and team rules.
- Neither review clones, copies, builds or runs the reviewed project, and none of their roles holds a tool for writing files. Claude Code gets `/super-review:defects` (`defect-orchestrator`, `defect-specialist`, `defect-challenger`) and `/super-review:tests` (`test-orchestrator`, `test-specialist`); Codex gets the `defect-review` and `test-review` skills. Cursor and OpenCode packages do not carry them yet. Standalone archives are `defect-review-0.4.0-skill.zip` and `test-review-0.3.0-skill.zip`. No skill depends on another at run time. Super Review's contract, lenses, 44 rule IDs and roles are unchanged. `docs/review-family.md` records the architecture and its decisions.
- Defect Review's lens principles say where a deliberate design ends and a bug begins: degrading on purpose with the failure still visible, causes merged under one name that nobody acts on, a shared resource retired for a failure that really breaks it, a request that takes effect after a timeout, a wait a caller's limit reaches, and detached work nothing depends on are not bugs. `docs/defect-review.md` lists the lines.
- Unreleased earlier designs of both reviews built the project in a disposable copy and proved findings by a failing test or a surviving mutant. They were run once each on `infra-cache` in `rust-service-template-rest` and then dropped: the run machinery was most of the instructions and about 2.5 million subagent tokens, and the first Defect Review design, which also required a quoted written promise, classified three of seven defects another reviewer had reported as documented behavior. Those records stay under `evals/defect-review/results/` and `evals/test-review/results/`. The instructions were then cut to what a reader needs: one contract per review holding the bar, the basis and the proof rules, a workflow for the orchestrator, and the lenses or questions. The current reading-only versions have not been used on a real repository.

## 3.11.0 — 2026-11-10

- Have Rust reviews recommend the fixed form when every caller sets an option, parameter, enum or type parameter to the same value, instead of leaving the remedy open for a variant nobody uses yet.
- Recommend removing an item kept alive only by `#[allow(dead_code)]` when nothing inside its visibility uses it, and record the reason for other lint suppressions with `#[expect(.., reason = "..")]` where the crate's Rust version supports it.
- Treat a private or `pub(crate)` item's uses as settled by its own crate, so a missing outside consumer no longer blocks advice about it.
- Sixteen contrasting inputs RD53-RD68 probe eight more decisions from the `rust-service-template-rest` skills. The 3.10.0 lenses already found six on these inputs; the two above improved, none regressed, and no retain contrast produced a finding. One run per arm on one model.
- Give Rust reviews a stated standard of well-written Rust to compare source against: types that carry facts, ownership that tells the story, values bound once, the compiler as co-maintainer, standard vocabulary and the least machinery. Assign each kind of idiom to the lens that owns it, replacing the instruction not to run an idiom pass.
- Name what each Rust lens looks for, with the case for keeping the code beside it: checks that could produce the value, flag variables, wildcard arms over the crate's own enums, placeholder `let mut` bindings, copies standing in for moves, index loops, inherent methods shadowing standard traits, signatures that promise what cannot happen, stringly-typed state, fields that are `None` only until `init`, validated values carried as raw strings, broad error enums, erased error sources and name forms used against their convention.
- Treat committed lint configuration as the project's adopted choice: advice does not contradict it, and listing its violations stays with the project's checks.
- Add conditional notes for thiserror/anyhow and for tracing under existing owners, and make a declared error type and a changed `pub` item or re-export signals for the error-expression and dependency-boundaries profiles.
- Add practices from the Rust API Guidelines, Effective Rust and Rust Design Patterns: bounds on the `impl` that needs them, provided trait methods, the least closure bound, `'_` on borrowing return types, decisions made one call too low, lossless conversions over `as`, glob imports, explicit `close` for cleanup that can fail, and guard scope.
- Check every Rust statement added here against the compiler, Clippy's lint documentation, std documentation and the thiserror, anyhow and tracing sources, and correct six: `break` with a value works in `loop` and labeled blocks only; `Box<dyn Error>` keeps the source and the type; `with_*`, `is_*` and `try_*` conventions as std uses them; `entry` replaces `contains_key` with `insert`, not with `get`; `#[instrument]` records tracing primitives as values; and a wildcard arm, a retained `unwrap` and a tuple result are stated as tradeoffs instead of faults.
- The standard, the lens additions and the two notes come from reading the instructions against the template's skills and published Rust practice. They were not compared in model runs. The eight base questions, 44 rule IDs and the read-only scope are unchanged.

## 3.10.0 — 2026-11-09

- Let the user run specialists in another installed harness, such as OpenCode subagents under a Claude Code orchestrator. The orchestrator stays in the active harness and launches one fresh non-interactive CLI process per task with the same neutral packet. Only the user's request selects it; source and PR text cannot, and an unavailable CLI or model is reported instead of silently falling back to native specialists.
- Fix the OpenCode launcher on OpenCode 2, which removed `--pure` and `--agent`: the launcher printed help and exited. It now starts a private server, so the specialist model and package configuration apply instead of the shared service's global settings, keeps the global `opencode.json`, and selects the review agent through configuration. OpenCode 1 launches as before.
- Stop a reviewed repository from replacing the OpenCode specialist. On OpenCode 2.2.3, a `.opencode/agents/super-review-specialist.md` in the repository took over the role's instructions and widened its permissions to `*: allow`; asked for its role, the specialist answered as a general coding assistant. The launcher now disables project configuration, and the native check covers that case on 1.18.29 and 2.2.3.

## 3.9.1 — 2026-11-09

- In Codex, start each specialist as the default agent instead of a role the reviewed repository defines. On the template, the orchestrator had picked its `specialist-agent` role, whose "return one decision record" instruction replaced the review packet: ten passes over `infra-cache` returned five findings, and six lenses returned none.
- Treat a child result in another format, such as a single decision record, as an unfinished task and rerun it as the default agent.

## 3.9.0 — 2026-11-09

- Have duplication reviews in Go, Rust, TypeScript and Java search from the decisions the code makes, with keys a rewrite keeps: the value in other spellings and units, external identifiers and sibling signatures, so renamed copies are found.
- When a change edits a decision, search for the old value too, so a copy the change left behind is reported.
- Read both directions of a table over a key set: a reverse lookup ending in a wildcard is not connected by the compiler.
- Treat configuration, charts, migrations, schemas and protocol files as possible partners, anchored in reviewed source; a local-run fallback is not a second owner.
- In a live replay on `jobs-worker`, the known histogram copy was named in 2 of 3 runs, against 0 of 2 for 3.8.0. Small packets showed no regression. The eight base questions, 44 rule IDs and the read-only scope are unchanged.

## 3.8.0 — 2026-11-09

- Have Rust reviews recommend deleting comments that restate or contradict the code, while keeping reasons, external constraints and doc comments that become help or API text.
- Weigh a handwritten general mechanism (date, URL or CLI parsing, encodings, backoff policies) against a declared dependency or `std`, and surface a new crate as a named decision instead of rejecting it by default.
- Flag a rule copied from its existing owner, and a superseded path, shim or fallback kept without a selecting consumer.
- Cover `From` over `Into`, duplicated `new`/`Default` construction, mock-only traits, one-action objects, Display-text error matching, error variants every consumer treats alike, sleep-polling loops over internal state, type aliases for identifiers and getter layers on passive internal data.
- Decisions transferred from the `rust-service-template-rest` Rust skills, with sixteen contrasting inputs RD37-RD52 and a recorded baseline/candidate comparison: four of eight useful-change inputs improved, four tied, none regressed, and no retain contrast produced a finding. Keep the eight base questions, 44 rule IDs and read-only scope unchanged.

## 3.7.0 — 2026-11-06

- Guide Rust reviews toward representations with fewer manually maintained relationships and clearer data transformations, while retaining required staging and lifecycle guarantees.
- Verify factual premises, complete the assigned scope after the first finding, and include a minimal resulting-shape sketch when structural advice needs one.
- Reconcile recommendations against a coherent resulting design, preserving compatible edits and distinguishing genuine alternatives.
- Preserve sixteen bounded static review outputs, independent assessments, and a code-only application with matching follow-up edits. Results are mixed; general quality gains, runtime correctness and maintenance-time savings are not established.
- Keep the eight base questions, 44 rule IDs, read-only review scope, native adapters and model profiles unchanged.

## 3.6.0 — 2026-11-06

- Have duplication reviews in Go, Rust, TypeScript and Java search the whole snapshot beyond their assigned area, so a large review can find copies across its partitions.
- Judge a copy the Rust, TypeScript or Java compiler connects by the extra edit it costs, not as silent divergence. Go has no equivalent connection.
- In a whole-project review, read lens, profile and aspect wording about changed source or a diff as the included source.
- Keep the eight base lenses, read-only review policy, rule IDs, native adapters and result contracts unchanged.
- Evidence is limited and recorded in `evals/change-together`: a small Rust replay on real code, and one static run per arm for the other languages, where only Java changed.

## 3.5.0 — 2026-09-23

- Route Codex specialist tasks to GPT-6 Luna/medium only for bounded local questions with complete context; use GPT-6 Sol/medium for cross-file, preservation-sensitive, uncertain, or incomplete questions. An explicit user model/effort selection still wins.
- Select the native Opus alias for the Claude Code review command, orchestrator, and specialists. Inherit session effort so a review can use medium, high, or xhigh according to its difficulty; provider alias mappings remain native configuration.
- Keep the existing eight-lens coverage, read-only review policy, rule IDs, native adapters, and source/result contracts. A bounded model-choice comparison passed; GPT-6/Opus specialist quality and effective routing remain unmeasured on this host.

## 3.4.0 — 2026-09-19

- Default to eight concurrent specialist tasks and refill a free slot as each result arrives, instead of three-task Codex/Cursor caps or waiting for unrelated children.
- Honor an explicit user concurrency ceiling; keep host capacity and rate limits binding. Use same-size batches only when the host returns whole batches. Do not invent later reductions to six or three.
- Point Cursor's repository marketplace manifest at the native Cursor adapter so this revision can be submitted or imported. Manual install remains supported; an official public listing still needs Cursor review.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex, Cursor and OpenCode adapters. Scheduling latency comparison remains unrun.

## 3.3.0 — 2026-09-17

- Add six Spring/Spring Boot owner profiles for bean wiring, application operations, HTTP contracts/errors, managed lifecycle and value shapes, plus per-module compatibility context. They deepen existing Java lenses; they do not add a language, rule IDs or extra agent types.
- Deepen TypeScript contract review for generic inputs, overload consumers, schema ownership and public module artifacts, with contrast cases and T07/T10 corrections.
- Deepen Rust API and conditional library quality review: conversion/builders, lifetime and generic contracts, plus Tokio/Serde/clap/Axum notes under existing owners.
- Deepen Go quality contrasts and correct language-scope evaluation; calibrate Java representation evals to accept equivalent remedies without changing runtime instructions.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex, Cursor and OpenCode adapters. Model-backed quality comparisons remain unrun.

## 3.2.0 — 2026-09-17

- Add a native Cursor IDE adapter: `/super-review` skill, a read-only specialist role, and inherit-by-default specialist models with an explicit per-review subagent override. Package a Cursor archive. This does not publish a Cursor marketplace listing.
- Add seven TypeScript owner profiles for React, Next.js, Tailwind CSS and shadcn/ui. They deepen existing lenses from inspected source; they do not add a language, rule IDs or extra agent types.
- Record frontend compatibility context, twenty contrasting fixtures and mechanical integrity checks, plus Cursor adapter configuration tests. Independent-agent and behavioral model evaluations remain unrun.
- Preserve all 44 `go.*`, `ts.*`, `rust.*` and `java.*` rule IDs, native 3.x packaging, and existing Claude, Codex and OpenCode model profiles.

## 3.1.0 — 2026-09-17

- Add Java review context, ten lens modules and four owner profiles with eleven stable `java.*` IDs. Preserve all existing `go.*`, `ts.*` and `rust.*` identities (44 rules total).
- Route Java through the native 3.x language catalog and read-only Maven/Gradle compatibility context. Do not restore the removed MCP reader or custom source runtime.
- Add eighteen contrasting Java judgment fixtures and mechanical routing/identity tests. Model-backed Java evaluation has not been run.
- Pin staged, unstaged and combined local snapshots, including old/new finding anchors, renamed/deleted coordinates, symlink/gitlink handling and source-evidence checks.
- Match specialist results to the assigned task, snapshot, lens/profiles, scope and policy before treating `completed` as coverage.
- Clarify explicit launch versus help/missing-target handling in the core skill and native entry points; reuse an already selected target without repeated confirmation.
- Load orchestration, verification, reporting and supported continuation guidance at their applicable stages. Preserve full preliminary declaration reading, independent specialists, eight base questions and every accepted recommendation.
- Distinguish confirmed absence of optional team policy from unavailable policy evidence; keep explicit source selection, scoped overrides and proposed-policy isolation.
- Clarify unfinished missing results, completion of the declared plan and compact reports without empty tables or dropped coverage/candidate decisions.
- Update repository-maintenance guidance and add bounded evaluation suites for instruction boundaries, evidence boundaries and source views. Model comparisons for these changes have not been run; no quality or latency gain is claimed.

## 3.0.0 — 2026-09-10

- Breaking: remove all MCP servers, custom source tools, source/result caches, setup scripts and bundled runtime dependencies.
- Use native file/search, Git/GitHub and agent completion tools in Codex, Claude and OpenCode. Native shell access is governed by host permissions and review instructions, not the old reader allowlist.
- Support explicit local-change and whole-project review targets with pinned source identities, alongside PR review.
- Preserve model profiles, all 33 rule IDs, independent lens coverage and candidate reconciliation.
- Generate instruction-only packages and document removal of the legacy Codex waiting namespace.

## 2.3.0 — 2026-09-10

- Favor demonstrated improvements in readability and maintainability across Go, TypeScript, and Rust; distinguish patch-writing effort from lasting code complexity.
- Assess compatibility from supported boundaries and known consumers rather than treating public visibility as a frozen API. Retain established external contracts.
- Revise weak remedies without discarding supported observations; ground specialist findings in actual declarations and calls, and make review extent explicit in assignments.
- Clarify Rust boolean-mode judgment and align language-specific compatibility guidance with the shared contract.
- Record four independent baseline/candidate stage runs on Rust fixtures using Astra/medium. Results are bounded and do not establish a general quality gain or default Terra-profile improvement.
- Preserve all 33 rule IDs, model profiles, source-reader behavior, and read-only permissions; regenerate native Codex and Claude payloads.

## 2.2.0 — 2026-09-10

### TypeScript

- Add language routing, TypeScript context, ten TS lens resources and four owner profiles with eleven stable `ts.*` rules; preserve all Go IDs.
- Support TS/TSX/MTS/CTS and handwritten declarations in pinned source reads and caller search, with compatibility metadata and existing read-only boundaries.
- Add contrasting evaluation inputs and mechanical source/resource tests; behavioral model evaluation remains separate and has not been run.
- Regenerate native Claude/Codex payloads without changing models, permissions, or dependencies.

The skill, rules, templates, and adapters share one SemVer version. Changes to
review decisions are product behavior, even when they only edit Markdown.

### Rust and review instructions

- Add Rust-specific review lenses/profiles and 11 stable `rust.*` rules without changing Go or TypeScript IDs.
- Integrate Rust source/Cargo context into shared Go/TypeScript routing and classification; preserve test/generated-code scope limits.
- Add Rust evaluation packets and mixed-language regression tests; live model quality remains unevaluated.

- Clarify the MCP resource description: reuse complete supplied materials and load missing shared role resources, the assigned lens, and selected profiles rather than the full catalog.
- Audit model-visible tool metadata alongside role instructions; add selective resource-delivery checks for canonical, Claude, and Codex skill roots. Record blocked model comparisons separately from mechanical validation.
- Distinguish trusted instruction revision/digest from SemVer and reviewed source identity; do not treat a missing digest alone as a source-coverage gap or a reason for redundant reads.
- Support selectively loaded, explicitly labeled code illustrations in team rules at the pinned policy revision, without new authority, rule fields or permissions.
- Align unresolved remedy fields around the exact missing evidence or necessary team decision; preserve ordinary reviewer judgment.
- Clarify instruction ownership and neutral delegation across actual model configurations; retain all base lenses and Go-specific preservation guidance.
- Correct the source record using the retrieved official Anthropic article; distinguish tool demonstrations from team-specific references.
- Add eight evaluator-only follow-up stages and an isolated routing-first replacement; preserve default preliminary reading until behavioral comparisons justify a change. Model-backed comparisons remain unexecuted.
- Separate evidence-backed observations from accepted implementation remedies; keep unresolved observations visible without lowering the acceptance bar.
- Define neutral task packets, reuse complete matching supplied resources, and move shared candidate metadata into one task result header.
- Clarify instruction authority, local conflict handling, source-first clarification, and fresh assignments for focused continuations.
- Preserve review decisions and retrievable evidence at supported in-session compaction boundaries without promising persistence or expanding permissions.
- Align Claude, Codex, and OpenCode instructions while retaining model defaults, independent base coverage, native waiting, and source-reader behavior.
- Add 18 prompt/context stage inputs, separate evaluator expectations, compilable Go fixtures, and mechanical integrity checks; model-backed gains remain unmeasured.
- Refine existing Go judgments for standard-library reuse, interfaces/generics, results, zero values, package boundaries, and caller documentation; add no agents or rule IDs.
- Constrain suggested Go cleanups by the actual module baseline, error matching, method sets, and defer/ownership contracts rather than happy-path resemblance.
- Add 24 Go-specific evaluation inputs with separate expectations; record fixture compilation separately from unexecuted model evaluation.
- Preserve the eight-base-lens plan; select representation and rationale lenses from changed-source signals.
- Load lifecycle-ownership, dependency-boundaries, effects-separation, and error-expression profiles only for their owning tasks.
- Track selection separately from completed coverage, honor explicit scope, and resolve newly discovered signals without recursive review waves.
- Add `go.representation.express-concepts` and `go.rationale.explain-constraints`; all nine existing IDs and overrides remain valid. Profiles use their owner's rules, not a new namespace.
- Add contrastive judgment and routing evaluation packets plus mechanical resource/packaging checks. Model-backed evaluation remains unexecuted; no quality or cost improvement is measured.
- Extend the OpenCode resource allowlist to the seven new Markdown resources; source access and tool permissions stay unchanged.
- Preserve model selection, dependencies, and read-only permissions.

## 2.1.0

- Add a Codex completion barrier: one pending MCP call collects all reports in a group without model polling.
- Use foreground native specialist calls in Claude Code and OpenCode.
- Package Codex's native MCP configuration with a 660-second tool timeout and a fixed ten-minute group deadline.
- Preserve unfinished coverage on failure or timeout; retain full reports with explicit continuation offsets.
- Keep orchestration models, specialist profiles, all nine Go rule IDs, and the eight-lens plan unchanged.

## 2.0.0

- Breaking: specialists no longer silently inherit the orchestrator model.
- Codex balanced workers use Terra/medium; explicit economy uses Luna/medium.
- Claude workers use Sonnet/medium while the orchestrator inherits the session.
- OpenCode requires one explicit provider/model selection, preserved outside release folders.
- Reduce repeated orchestration turns through longer completion-aware waits and larger resource batches.
- Record blinded model screens, live routing/usage, and quality-evidence limitations.
- Preserve all nine Go rule IDs and the default eight-lens plan.

## 1.1.0

- Native Claude Code and Codex plugins with standard installation and update flows.
- Claude's isolated review command and constrained specialist roles.
- A bundled Node MCP bridge over the existing GitHub reader; no consumer package install.
- Shared immutable snapshot receipts for Codex's separate child reader processes.
- Setup guidance, reader checks, natural-language lens scope, actual progress, and outcome-first reports.
- An OpenCode launcher selects the review agent and trusted directory automatically.
- Preserved all nine Go rule IDs and the full default review plan.

## 1.0.0

- First Go readability and maintainability review skill.
- Eight independent lenses with orchestrator verification and complete reports.
- Team policy from a pinned base, with explicit overrides and conflict handling.
- OpenCode primary agent, specialist, command, and bounded GitHub source reader.
- Versioned complete-adapter and standalone-skill archives.

Default rule IDs are listed in `evals/go/rule-ids.json`. No rule-ID migration is
required for 3.0.1.
