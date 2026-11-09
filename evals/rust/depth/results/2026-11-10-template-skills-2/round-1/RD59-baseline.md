<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD59; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD59

- Snapshot: local packet, whole supplied source (no diff or base). Location: `.../scratchpad/packets/RD59` (`Cargo.toml`, `src/lib.rs`). No commit or hash identity was supplied.
- Instructions: Super Review installed resources under `.../scratchpad/baseline/skills/super-review`, content identity unverified.
- Assignment: lens `representation` (`rust.representation.express-concepts`), selected profiles none. Scope is all production declarations and uses in a private, unreleased module, with no external API commitment and no team policy. Edition 2021, rust-version 1.85.
- Status: completed
- Inspected evidence: `Cargo.toml`, and all of `src/lib.rs`: `ProbeConfig`, `new`, `add_region`, `remove_region`, `regions`, `deadline_budget`, `next_probe_in` and `is_slow`. Context facts were taken from the packet. No tests or generated files exist in the packet.
- Coverage: base representation question completed over every declaration. Profiles: none selected. Missing evidence: none. The only consumer information is the packet's context facts, namely that `regions()` has one reader that iterates and that reports print regions sorted and deduplicated.
- New applicability signals: none

## C-RD59-1: `regions` is a sorted, duplicate-free set kept as a `Vec<String>` plus an upkeep protocol

- Change anchor: `src/lib.rs`, `ProbeConfig.regions: Vec<String>` (line 6). `add_region` runs `contains`, then `push`, then `sort`. `remove_region` runs `retain`. `regions()` returns `&[String]`. This is whole-source scope, anchored directly in the snapshot.
- Basis: `rust.representation.express-concepts`. Profiles: none.
- Observation: The field is a set of region names. The context facts say order has no meaning and reports print the regions sorted and without duplicates. The only reader iterates. The type does not say this. A reader has to infer the "unique and sorted" invariant from the body of `add_region`. The invariant also depends on `add_region` being the only mutation path that keeps it. `remove_region` is order-safe only because `retain` preserves order. `new` establishes it through emptiness. That is a protocol spread over three methods plus a private field. `add_region` does a linear scan and then a full sort on every insert, for a result the data structure could carry by definition. The strongest alternative is to keep the `Vec` with the private field and documentation. That already prevents outside mutation, but the three-step upkeep and the unstated meaning remain for the maintainer.
- Remedy: Store `regions: BTreeSet<String>`. This gives the concept one home: uniqueness and sorted iteration are properties of the type. The sketch below shows the shape.
  ```rust
  regions: BTreeSet<String>,
  pub fn add_region(&mut self, region: String) { self.regions.insert(region); }
  pub fn remove_region(&mut self, region: &str) { self.regions.remove(region); }
  pub fn regions(&self) -> impl Iterator<Item = &String> { self.regions.iter() }  // or &BTreeSet<String>
  ```
  The `contains`/`push`/`sort`/`retain` choreography and the "sorted and unique" convention disappear. The remaining obligation is the `regions()` return type, which changes from a slice to an iterator or `&BTreeSet`. The only reader iterates, and no external API commitment exists, so this is compatible with the known use. Slice indexing or `len` by any consumer outside the packet would need `len()` or iteration instead.
- Preserve: reports print the regions sorted and deduplicated (`BTreeSet<String>` iterates in `Ord` order, the same as `sort` on `String`). Removal by `&str` works through `Borrow<str>`. No serialization of `ProbeConfig` is known. A packet-visible consumer outside `regions()` is not available, so only the stated single iterating reader is verified.
- Affected files: `src/lib.rs` (inspected). Report code that calls `regions()` is not in the packet, so its call site is not inspected.

## C-RD59-2: Timeout and interval are bare integers whose unit conversion is repeated in each consumer

- Change anchor: `src/lib.rs`, `pub timeout_ms: u64`, `pub interval_secs: u64` (lines 4-5). The conversions are `Duration::from_millis(config.timeout_ms)` and `Duration::from_secs(config.interval_secs)` in `deadline_budget` (lines 31-32), `next_probe_in` (line 36) and `is_slow` (line 40).
- Basis: `rust.representation.express-concepts`. Profiles: none.
- Observation: Both fields are durations, but they sit in different units (`u64` ms and `u64` s) and are distinguished only by name suffix. Every consumer re-applies the matching `Duration::from_*` constructor. Each function must pick the right constructor for the right field. `new(timeout_ms: u64, interval_secs: u64)` has two adjacent `u64` parameters whose order is also tracked only by position. The existing domain type `std::time::Duration` is already used in all three functions' signatures and results. The strongest alternative is to keep the suffixed names. They do make each use legible locally and are cheap. The cost is that the unit knowledge is duplicated at four sites, and the field type does not say what the number measures.
- Remedy: Store `timeout: Duration` and `interval: Duration` and convert once at the startup site that builds the config from parsed settings. The sketch below shows the shape.
  ```rust
  pub fn new(timeout: Duration, interval: Duration) -> Self
  // deadline_budget: config.timeout * attempts + config.interval * attempts.saturating_sub(1)
  // next_probe_in:   config.interval.saturating_sub(elapsed)
  // is_slow:         took > config.timeout
  ```
  The unit conversions and the per-field unit convention move to the single construction site. The remaining tradeoff is that the startup code, which holds the parsed integers, has to call `from_millis` and `from_secs` itself. That code is outside the packet.
- Preserve: The numeric results are unchanged because `Duration` arithmetic is the same as before. `Duration * u32` is already used, so the `u32` attempt counts are unaffected. `ProbeConfig` is not serialized, so no wire encoding changes. The `pub` field names and types are visible to the startup code, so that code needs the one-time edit. That code is not in the packet and is not inspected.
- Affected files: `src/lib.rs` (inspected). The startup code that constructs `ProbeConfig` is needed context and was not inspected.
