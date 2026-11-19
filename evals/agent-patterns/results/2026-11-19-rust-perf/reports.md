# Reader reports

Final responses from each fresh reader. Local path prefixes have been normalized. Run names match the comparison record.

## Cache comparison

### fir · AP33

````text
## Reader result

**Lens and scope:** allocation review of the whole `src/ingest.rs` module. Read the module, `Cargo.toml`, `Cargo.lock`, the four requested review documents, and relevant Rust 1.100.0 and resolved regex source. No in-scope code was unread. Hot-path basis: the user describes a long-lived worker processing each manifest, with up to 2,000 records and recurring tenants.

### 1. Avoid owned sort keys on every comparison

- **Location:** [src/ingest.rs:37]($PACKET/src/ingest.rs:37).
- **Cost, traced:** For each sort comparison, Rust’s `alloc/src/slice.rs:247–253` calls the key function for both operands. Each call executes `code.to_ascii_lowercase()` and `tag.clone()`. `alloc/src/str.rs:889–893` constructs a new lowercase byte buffer; `alloc/src/string.rs:2428–2431` clones the tag’s backing vector. Thus each comparison creates two lowercase buffers for nonempty codes and up to two tag buffers for nonempty present tags. There is no cached key.
- **Cheaper form:** Use stable `sort_by`, comparing `a.code.bytes().map(|b| b.to_ascii_lowercase())` against the corresponding iterator for `b`, then `a.tag.cmp(&b.tag)` on equality. This preserves ASCII-only folding, bytewise string order, optional-tag order, and stable ordering, including for invalid codes that are checked later. It requires no new dependency and uses APIs available under Rust 1.80.
- **Resource:** Key-buffer allocations go from up to four per comparison to zero; stable sort’s own auxiliary storage and the parsed records remain. The comparator still scans code bytes. An independent alternative is `sort_by_cached_key`, which evaluates each key at most once per record but holds cached keys and an index vector for the sort; that trades additional temporary retained memory for fewer key constructions.

### 2. Move the tenant into the route map

- **Location:** [src/ingest.rs:47]($PACKET/src/ingest.rs:47).
- **Cost, traced:** Every record reaching the map calls `.entry(rec.tenant.clone())`; `String::clone` clones its vector. The original tenant is not used afterward. The clone occurs on both hits and misses, including recurring tenants.
- **Cheaper form:** Pass `rec.tenant` directly to `entry`. The map keeps it on a miss and drops it on a hit; the selected first shard, order, errors, API and cache behavior stay the same.
- **Resource:** One allocation and byte copy per nonempty tenant reaching the map becomes zero. Deserialization still creates the original tenant string, and the map can still allocate when it grows.

### 3. Defer the missing-tag error

- **Location:** [src/ingest.rs:42]($PACKET/src/ingest.rs:42).
- **Cost, traced:** `ok_or(format!(...))` formats an owned error before `ok_or` chooses its branch, even when the tag is present. The value is then discarded on success.
- **Cheaper form:** Use `ok_or_else(|| format!("missing tag on {}", rec.id))`. It preserves the error text and the point at which a missing tag stops processing.
- **Resource:** A formatted error buffer per present tag becomes zero; formatting remains on missing-tag errors. Parsing and the sort still allocate on the same manifest path.

### 4. Test regex membership without capture storage

- **Location:** [src/ingest.rs:43]($PACKET/src/ingest.rs:43).
- **Cost, traced:** Only `captures(...).is_none()` is observed. In resolved `regex` 1.13.2, `regex/string.rs:1193–1205` creates captures before searching; `regex-automata` 0.4.19 `meta/regex.rs:1635–1637` calls `Captures::all`, whose `util/captures.rs:215–217` allocates initialized slots. This occurs for a match or miss. `is_match` instead uses the membership search in `regex/string.rs:1120–1123`.
- **Cheaper form:** Use `!CODE_RE.is_match(&rec.code)`. It preserves the validity decision and error behavior; capture contents were never read.
- **Resource:** One capture-slot allocation per record reaching validation becomes zero. Regex search and any engine cache work remain, as do parsed-record allocations.

All four sketches are local to the reviewed module and preserve the public API and accepted-record ordering. They are static source findings; no build, benchmark, or project code was run.
````

### oak · AP33

````text
**Allocation reader result — `src/ingest.rs`**

Read the entire module, `contract.md`, `rust.md`, `allocation.md`, `finding-template.md`, `Cargo.toml`, and relevant lockfile entries. Consulted installed Rust 1.100.0 sorting, string and option implementations, plus the resolved `regex` 1.13.2 and `regex-automata` 0.4.19 sources. The user’s workload establishes one invocation per manifest, up to 2,000 records, with recurring tenants and debug tracing disabled. No in-scope source was unread; no outside-scope costs are reported.

### 1. Allocate sort keys on every comparison

- **Location:** [src/ingest.rs:37]($PACKET/src/ingest.rs:37).
- **Hot path and cost:** Each manifest sorts its records before accepting assignments. `sort_by_key` calls `f(a).lt(&f(b))` for each comparison; each key lowercases and copies the code and clones the optional tag. For nonempty strings, that is two code-buffer allocations per comparison, plus one for each present, nonempty tag. The keys are discarded immediately. Output capacity is reserved later, but does not avoid these keys.
- **Cheaper form:** Use stable `sort_by`, comparing `code.bytes().map(|b| b.to_ascii_lowercase())` lexicographically, then comparing the borrowed `Option<String>` tags. ASCII folding leaves other UTF-8 bytes unchanged, so this retains the existing ordering, including stable ties and decoded optional-tag ordering. It uses standard APIs available at the Rust 1.80 baseline.
- **Resource:** Temporary key allocations fall from up to four per comparison to zero; stable-sort scratch storage and the deserialized records remain. As an alternative, `sort_by_cached_key` bounds key construction to at most once per record, but retains cached keys and their storage for the sort.

### 2. Format a missing-tag error for every accepted tag

- **Location:** [src/ingest.rs:42]($PACKET/src/ingest.rs:42).
- **Hot path and cost:** For each processed record, `ok_or(format!(...))` constructs the error before `ok_or` checks the option; the standard-library implementation drops it on `Some`. Thus every present tag incurs a formatted string allocation that is discarded.
- **Cheaper form:** Use `ok_or_else(|| format!("missing tag on {}", rec.id))?`. It keeps the same error text, failure point and prior cache mutations; formatting moves to the missing-tag path.
- **Resource:** One discarded formatting allocation per present tag becomes zero. Parsing, sorting and regex matching remain on the same path.

### 3. Allocate capture slots for a boolean regex check

- **Location:** [src/ingest.rs:43]($PACKET/src/ingest.rs:43).
- **Hot path and cost:** Each record with a tag calls `captures(...).is_none()`. In the resolved dependency, `captures` calls `captures_at`, which creates capture storage; `Captures::all` initializes `vec![None; slots]`, including slots for the overall match. No capture is read.
- **Cheaper form:** Replace the condition with `!CODE_RE.is_match(&rec.code)`. Both ask whether this same regex matches, preserving validation and the error point.
- **Resource:** One explicit capture-slot allocation per checked record becomes zero. Regex search and its internal cache behavior remain; this count does not claim that the entire search is allocation-free.

### 4. Clone a tenant string before moving it into the cache

- **Location:** [src/ingest.rs:47]($PACKET/src/ingest.rs:47).
- **Hot path and cost:** Each valid record calls `entry(rec.tenant.clone())`. `String::clone` clones its underlying vector, allocating and copying a nonempty tenant. On a cache hit the cloned key is discarded; on a miss it is retained while the original is dropped.
- **Cheaper form:** Pass `rec.tenant` directly to `entry`. The field is not used afterward, and the other fields used for output can still be moved individually. This preserves first-accepted-record assignment, including across manifests and differing shard inputs.
- **Resource:** One tenant-buffer allocation and copy per nonempty tenant processed becomes zero. On misses, the original parsed string becomes the cache key; on hits it is dropped by the entry operation. Parsing still creates the owned tenant string, and map growth may allocate.
````

### lime · AP34

````text
## Reader result

**Lens and scope:** Allocation review of the whole `src/ingest.rs` module.

**Candidates:** None established.

The module already borrows unescaped input strings, compares codes without allocating, reserves output capacity, and allocates a tenant key only on a cache miss. The owned fallback for an escaped string is needed to retain its decoded value while the records are sorted. No independently supported cheaper alternative was established.

**Read:** [src/ingest.rs]($PACKET/src/ingest.rs) in full, including `ingest_manifest` and `cmp_ascii_case_insensitive`; the four requested review documents; `Cargo.toml` and `Cargo.lock`; and relevant Serde and serde_json string-deserialization source. The load basis is the user’s description of a long-lived worker processing up to 2,000 records per manifest. Nothing in scope was unread.

**Outside scope:** No costs identified whose cheaper form changes only code outside the selected module.

No builds, tests, benchmarks, or sample execution were performed.
````

### ash · AP34

````text
## Reader result

**Lens and scope:** allocation review of the whole [src/ingest.rs]($PACKET/src/ingest.rs). **No supported allocation candidates or independently supported alternatives found.**

The review covered the module in full, the requested packet, `Cargo.toml` and `Cargo.lock`, plus the relevant string-deserialization paths in the installed `serde` 1.0.229 and `serde_json` 1.0.154 sources. The hot-path basis is the supplied workload: one call per manifest, with up to 2,000 records and recurring tenants. No part of the module was unread.

The existing path borrows strings where deserialization permits, looks up tenants by borrowed key before allocating an owned key on a miss, reserves output capacity, and moves bucket vectors into the result. The comparator does not construct lowercase strings. Stable ordering and decoded-tag ordering remain required.

**Outside-scope costs:** none identified. No code was built or executed.
````

### olive · AP37

````text
## Reader result

**Lens and scope:** Complexity of manifest routing in `src/lib.rs`.

**Read:** `contract.md`, `rust.md`, `complexity.md`, `finding-template.md`, `src/lib.rs`, `Cargo.toml`, `Cargo.lock`, and the relevant Rust 1.100.0 standard-library and bundled hashbrown source. The load basis is the user’s statement that the worker calls `shards` once per manifest. Nothing in scope was unread.

### 1. Remove the route map per manifest

- **Location:** [src/lib.rs]($PACKET/src/lib.rs:3), `shards`.
- **Hot path:** One call per manifest, with one iteration per input tenant. Tenant names and their byte lengths are client-chosen; names may repeat.
- **Cost, traced:**
  1. Lines 4–8 create a map and call `routes.entry(tenant)` for every tenant. The map is local to the call; there is no cache across manifests.
  2. Rust’s `HashMap::entry` delegates to `rustc_entry` (`std/src/collections/hash/map.rs:1012–1013`). The bundled implementation hashes every key before its lookup and reserves space on a miss (`vendor/hashbrown-0.17.1/src/rustc_entry.rs:35–50`).
  3. `&str` hashing delegates to `str`, which calls `write_str` (`core/src/hash/mod.rs:863–867, 941–946`). The default hasher processes the string’s bytes (`std/src/hash/random.rs:130–136`; `core/src/hash/sip.rs:256–305`). Thus each manifest pays **N key hashes over the sum of tenant-name byte lengths**, including repeats, plus lookups, possible rehashing and map growth.
  4. The cached value is only `(tenant.len() as u32) % 16`; `str::len` returns the byte-slice length (`core/src/str/mod.rs:155–157`). Equal strings necessarily have equal byte lengths.
- **Cheaper form:** Keep the existing output vector and loop, replacing the map operation with `out.push((tenant.len() as u32) % 16)`. This retains the cast and modulo, output values and positions, public API, and `Send`/`Sync` properties. It uses the existing Rust 1.100 baseline and no dependencies. It removes the internal map and its allocations and drops; there are no explicit error returns or externally visible intermediate effects.
- **Resource:** Per manifest, key hashes and map lookups go from **N to zero**, and map growth and rehashing disappear. The replacement performs N constant-time length calculations instead of one per distinct key. Output construction remains N pushes and is the remaining linear CPU and allocation work. No work moves elsewhere. No independently supported alternative is needed.
````

### fern · AP37

````text
## Reader result

- **Lens and scope:** Complexity of manifest routing in [src/lib.rs]($PACKET/src/lib.rs).
- **Read:** The complete task packet, `shards`, `Cargo.toml` and `Cargo.lock`; Rust 1.100.0 standard-library and bundled hashbrown source for entry lookup, string hashing and string length. The user states that the ingestion worker calls `shards` once per manifest. Nothing in scope was unread.
- **Outside scope:** None.

### 1. Remove the route map for each manifest

- **Location:** [src/lib.rs:3]($PACKET/src/lib.rs:3), `shards`; whole-file review, so no change attribution.
- **Hot path:** The user states that the ingestion worker calls this once per manifest. The loop at lines 6–8 runs once per input tenant, including repeated names.
- **Cost: traced.**
  1. Line 7 calls `routes.entry(tenant)` for each of N positions. The installed `std` `HashMap::entry` delegates to hashbrown’s `rustc_entry` (`std/src/collections/hash/map.rs:1012–1013`); that calls `make_hash` before looking for the key (`vendor/hashbrown-0.17.1/src/rustc_entry.rs:35–46`).
  2. `make_hash` calls `hash_one` (`map.rs:236–242`); reference hashing forwards to `str::hash`, which calls `write_str` (`core/src/hash/mod.rs:863–866, 941–945`). The default hasher forwards to SipHash, whose `write_str` hashes the bytes and whose `write` processes them in chunks (`std/src/hash/random.rs:125–136`, `core/src/hash/sip.rs:256–306`). Thus every occurrence hashes its name, with work proportional to its byte length; map growth can add rehashing.
  3. The only cached value is `(tenant.len() as u32) % 16`. `str::len` reads the byte-slice length (`core/src/str/mod.rs:155–156`); the map avoids recomputing that constant-time expression on repeats but does not avoid hashing them.
- **Cheaper form:** Keep the existing loop and output capacity, replacing the lookup with `out.push((tenant.len() as u32) % 16)`. Equal names have equal byte lengths, so this preserves every result and position, including the existing cast behavior. It keeps the API, output allocation, and `Send`/`Sync` properties; there are no returned errors or user-defined destructors. The internal map’s allocations and drops disappear, so allocation-failure behavior can differ. The sketch uses only standard Rust within the declared 1.100 baseline, edition, features and targets.
- **Resource:** Per manifest, N entry lookups and at least N hashes over the names become zero; map allocation, probing and possible rehashing also disappear. Direct length-and-modulo calculation becomes N operations instead of one per distinct name. CPU work becomes O(N), independent of total name bytes; writing N output values and allocating the output vector remain required costs. A faster hasher is not needed: client-chosen keys currently require the table’s flooding protection.
````

### elm · AP38

````text
**Complexity lens — manifest routing in `src/lib.rs`**

Read `shards` in full, the review packet and `Cargo.toml`, plus Rust 1.100’s `str::len` implementation. The hot-path basis is the user’s statement that the ingestion worker calls `shards` once per manifest. Nothing in scope was unread.

**No candidates.** For N input positions, `shards` reserves N output slots and performs one length lookup and one push per position ([src/lib.rs]($PACKET/src/lib.rs:1)). `str::len` obtains the byte-slice length; it does not scan the tenant’s bytes. Routing therefore takes O(N) work regardless of name lengths or repetitions, matching the N output positions required.
````

### birch · AP38

````text
**Lens and scope:** Complexity of manifest routing in `src/lib.rs`.

**Read:** The four requested review documents, `src/lib.rs` and `shards` in full, `Cargo.toml`, and the Rust 1.100.0 implementation of `str::len`. The user supplied the load basis: the ingestion worker calls `shards` once per manifest. Nothing in scope was unread.

**No candidates.** For a manifest with N tenant names, `shards` reserves space for N results and performs one constant-time length lookup and one push per input. Rust’s `str::len` returns the byte-slice length; it does not scan the name. The O(N) work matches the N position-preserving outputs required, regardless of repeated names or their byte lengths. Caching repeated names would add lookups without avoiding a string scan.
````

## Copy-on-write and task lifetime

### beech · AP39

````text
## Reader result

**Lens:** allocation, `src/lib.rs`. Read `Board` and `Snapshot` in full, the four requested review documents, and the installed Rust 1.100.0 `Arc` clone, `make_mut`, slice conversion and cloning implementations. Load basis: the user’s command and snapshot frequency. The project’s manifest and target configuration were outside the permitted packet, so their compatibility cannot be independently verified.

### 1. A temporary snapshot forces a full image copy per valid hold command

- **Location:** [src/lib.rs:24]($PACKET/src/lib.rs:24), `Board::toggle_hold`.
- **Hot path:** The user states that boards receive thousands of commands between reloads and that most run without a reader holding the current version.
- **Cost, traced:**
  1. Lines 25–26 call `self.snapshot()` solely to obtain the length. Lines 20–21 clone the `Arc`; the installed [Arc implementation](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2504>) increments its strong count without copying the image.
  2. The local `current` remains alive through line 30, so `Arc::make_mut` sees another strong owner even when no reader exists. Its [implementation](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2645>) allocates a new `Arc` and clones the slice. This is **one allocation and N bytes copied per valid command**, where N is the slot count. Invalid indices return before this work.
  3. The existing copy-on-write check cannot avoid that copy because the command itself supplies the extra owner.
- **Cheaper form:** Obtain the length with `let slots = self.flags.len();` and keep the bounds check and `make_mut`. Alternatively, explicitly `drop(current)` after obtaining the length. Both preserve the public API, immediate toggle, invalid-index result, snapshots and `Send`/`Sync` properties. An actual reader still causes a copy, preserving its old version; without one, the board mutates in place. The temporary `Arc` is dropped earlier, but the board retains ownership until mutation. These use standard APIs already present in the code; the uninspected project baseline remains a verification limit.
- **Resource:** For a valid command with no external snapshot, image allocations and copied bytes change from **1 and N → 0 and 0**. With a current snapshot held by a reader, they remain **1 and N → 1 and N**. The remaining allocation and full-image copy in that shared case are the largest allocation costs on this path. No work is moved to load or snapshot creation.
````

### maple · AP40

````text
**Lens and scope:** Allocation review of `src/lib.rs`. Read the file in full, `Cargo.toml`, the four requested review documents, and the relevant Rust 1.100 `Arc` and slice-cloning source. The workload basis is the user’s description. Nothing in scope was unread.

**No finding:** With no snapshot holding the current version, `Arc::make_mut` changes the byte in place without allocating or copying the image. The invalid-index return also precedes mutation. Loading must give the board owned state, and snapshots must preserve their old bytes.

**Alternative — move copying from commands to snapshots (tradeoff).** Store the board’s flags in a `Vec<u8>` and construct `Snapshot(Arc::from(flags.as_slice()))` when a snapshot is requested. Keep the existing bounds check and toggle the vector directly.

For a board of \(N\) slots:

- Today, the first valid toggle while the current version is shared allocates one new `Arc` image and copies \(N\) bytes; subsequent toggles allocate nothing until another snapshot shares that version. A snapshot itself clones only the `Arc` pointer.
- The alternative makes every valid toggle allocation-free, including while snapshots are held. Every snapshot instead allocates an `Arc` image and copies \(N\) bytes, even if no command follows.

The trace is [src/lib.rs]($PACKET/src/lib.rs:20): `snapshot` clones the pointer; at line 29, `Arc::make_mut` clones the slice when another strong pointer exists. Rust 1.100’s `alloc/src/sync.rs:2645–2660` selects that clone, and `:1560–1568` allocates and invokes slice cloning. Its `From<&[T]> for Arc<[T]>` at `:4082–4098` documents the allocation and item copy used by the alternative.

The alternative preserves immediate toggles, snapshot contents, invalid-index results and the public method signatures, but changes allocation and copy timing, allocation-failure timing, and backing-storage drop timing. Its value depends on snapshot frequency and overlap with commands; the supplied workload establishes that most commands already take the allocation-free path.
````

### aspen · AP41

````text
## Reader result

- **Lens and scope:** Async performance in `src/lib.rs`.
- **Read:** `contract.md`, `rust.md`, `async.md`, `finding-template.md`, `src/lib.rs`, `Cargo.toml`, and `Cargo.lock`; Tokio 1.54.1’s watch, timeout, and task join implementations. Load basis: the user’s batch duration, progress cadence, and dashboard timeout. No in-scope source was unread.

### 1. Detached dashboard worker continues consuming progress after timeout

**Tradeoff.** Each admitted batch starts two independent `final_total` tasks. The ledger task must survive dashboard disconnection; the dashboard task also survives, although its result can no longer be returned.

- **Location and hot path:** [`wait_for_total`]($PACKET/src/lib.rs:27), once per admitted batch. The user states progress arrives every 50 ms and dashboards often wait 100 ms while batches can run for 30 seconds.
- **Cost trace:**
  1. [Lines 32–38]($PACKET/src/lib.rs:32) clone the receiver and spawn one ledger task and one dashboard task. Each runs [the same loop]($PACKET/src/lib.rs:18), borrowing the current value and awaiting `changed()` until completion or closure.
  2. [Lines 40–43]($PACKET/src/lib.rs:40) put the dashboard `JoinHandle` inside `timeout`. Tokio’s `timeout.rs:86–98, 204–223` stores and polls that handle; dropping a `JoinHandle` detaches its task (`runtime/task/join.rs:18`). Thus timeout or cancellation of `wait_for_total` leaves the dashboard task running.
  3. Each observed update can resume both loops. Tokio’s `watch.rs:676–687` takes a read lock in `borrow_and_update`; `watch.rs:1001–1018` registers for notifications and checks the version. Watch updates can coalesce, so neither one wakeup per emission nor a fixed count is guaranteed. There is no cancellation of the dashboard worker in the reviewed code.
- **Cheaper form:** Retain the dashboard handle and abort it on timeout, with a drop guard that also aborts it if the enclosing future is cancelled. Continue the existing ledger task independently. Success, `Closed`, `Deadline`, and `WorkerStopped` handling can remain on the existing join path; feed closure still drops the receipt without a total. Tokio cancellation is asynchronous, so the worker may finish before abort takes effect.
- **Behavior changed:** The dashboard receiver drops earlier after timeout or cancellation. This is observable through `watch::Sender::receiver_count()` and potentially `Sender::closed()` (`watch.rs:1031–1037, 1432–1434`). Hence this is a **tradeoff**, not a behavior-preserving finding. The sketch uses the existing Tokio features and public API; no build was run.
- **Resource:** After timeout or cancellation, continuing dashboard watch loops go from **one per batch to zero once abort completes**; the required ledger loop remains one. This saves task scheduling and watch synchronization CPU across observed updates, alongside the ledger’s corresponding work. It does not shorten the already-returned dashboard wait.

**Alternative:** A single persistent task could watch progress and deliver its result both to the ledger and to the dashboard through a separate channel. That removes a watch loop while the dashboard is active too, but changes receiver counts, task and channel lifetimes, and panic/`WorkerStopped` handling; those semantics would need explicit design and validation.
````

### yew · AP42

````text
## Reader result

- **Lens and scope:** Async review of `src/lib.rs`.
- **Read:** `contract.md`, `rust.md`, `async.md`, `finding-template.md`, `src/lib.rs` in full, `Cargo.toml`, the Tokio entry in `Cargo.lock`, and relevant Tokio 1.54.1 watch, timeout, spawn and join-handle source. Load basis: the user’s stated one call per batch, 50 ms progress updates, 30-second batches and 100 ms dashboard waits. Nothing in scope was unread.
- **No supported in-scope performance finding.** [final_total]($PACKET/src/lib.rs:18) waits for feed changes; [wait_for_total]($PACKET/src/lib.rs:32) spawns a worker so it can deliver the ledger total after the dashboard times out or disconnects. Dropping Tokio’s join handle detaches the task. Awaiting `final_total` directly inside the timeout would lose that behavior. Tokio’s `watch::Receiver::wait_for` also checks changes in a loop, so it does not independently eliminate progress wakeups.

- **Outside scope / alternative:** The feed producer could expose a separate terminal-only signal, allowing the ledger worker to wait without processing progress updates. This changes the producer and interface outside the selected file; preserving feed-close behavior, failure reporting and receipt delivery would need review there. Coalescing means the current code need not process every emitted update, so the saving cannot be counted exactly from the supplied evidence.
````

## Preliminary manifest

### reed · AP33

````text
## Reader result

**Lens and scope:** Allocation review of the whole `src/ingest.rs` module. The user describes a long-lived worker processing one manifest per invocation, with up to 2,000 records and recurring client-supplied tenants.

**Read:** `contract.md`, `rust.md`, `allocation.md`, `finding-template.md`, `Cargo.toml`, `Cargo.lock`, and all of [src/ingest.rs]($PACKET/src/ingest.rs). Consulted Rust 1.100 standard-library source for sorting, ASCII lowercasing and `String::clone`, and resolved `regex` 1.13.2 and `regex-automata` 0.4.19 source for matching and capture storage. No in-scope source was unread.

**Outside scope:** None identified. No build, benchmark, or sample was run. Counts below describe the named work, not total allocations; parsing, sorting workspace and retained output also allocate.

### 1. Allocate lowercase strings for every sort comparison

- **Location and hot path:** [ingest.rs:36]($PACKET/src/ingest.rs:36) deserializes each manifest; line 37 sorts its records. The user’s file-size bound is 2,000 records.
- **Cost, traced:** `sort_by_key(|r| r.code.to_ascii_lowercase())` invokes the key function for both operands of each comparison: Rust’s `sort_by_key` calls `f(a).lt(&f(b))` (`alloc/src/slice.rs:247–253`). `str::to_ascii_lowercase` creates a lowercase byte vector and converts it into a `String` (`alloc/src/str.rs:889–893`, `alloc/src/slice.rs:678–679`). Thus each comparison creates **two temporary buffers for nonempty codes**, then discards them. Sorting occurs before validation, so even invalid codes must retain their present ordering semantics.
- **Cheaper form:** Keep stable `sort_by`, comparing `a.code.bytes().map(|b| b.to_ascii_lowercase())` lexicographically against the corresponding iterator for `b`. ASCII case conversion leaves other UTF-8 bytes unchanged, so this preserves the lowercase byte ordering, including ties and their original order. It preserves validation order, errors, cache updates and the public API. The APIs predate the declared Rust 1.80 baseline.
- **Resource:** Temporary lowercase-key allocations go from two per comparison for nonempty codes to zero. The comparator still scans bytes; the stable sort may itself use workspace. Deserialization and retained record strings remain other allocation costs.
- **Independent alternative:** `sort_by_cached_key` computes at most one lowercase key per record, preserving stable order, but retains those keys and allocates an index vector during the sort (`alloc/src/slice.rs:312–335`). It trades peak temporary storage for fewer key computations.

### 2. Allocate an error message for every record with a tag

- **Location and hot path:** [ingest.rs:40]($PACKET/src/ingest.rs:40) iterates over records; line 42 checks each tag until the first error.
- **Cost, traced:** `ok_or(format!("missing tag on {}", rec.id))` evaluates `format!` before `ok_or`, including when `tag` is present, then discards the formatted string. There is one formatted error buffer per reached record; no earlier guard avoids it.
- **Cheaper form:** Use `ok_or_else(|| format!("missing tag on {}", rec.id))`. A missing tag produces the same message at the same point, after the same prior cache updates; success produces the same result. API and concurrency properties are unchanged.
- **Resource:** Error-message buffers change from **one per reached record to zero on success**, remaining one on a missing-tag failure. Parsing and sorting still allocate on the same manifest path.

### 3. Allocate capture slots when only match existence is used

- **Location and hot path:** [ingest.rs:43]($PACKET/src/ingest.rs:43) checks every reached record with a tag.
- **Cost, traced:** `captures(...).is_none()` discards all capture information. In resolved `regex`, `captures` calls `captures_at`, which calls `meta.create_captures()` before searching (`regex/src/regex/string.rs:404–405, 1193–1205`). That calls `Captures::all`, which initializes a slot vector (`regex-automata/src/meta/regex.rs:1635–1637`, `util/captures.rs:215–217`). The regex has the implicit whole-match group, so this is one nonempty slot allocation per check, including a miss.
- **Cheaper form:** Replace the condition with `!CODE_RE.is_match(&rec.code)`. The same regex tests existence, preserving the error and its position relative to earlier work and cache updates. `is_match` uses `search_half` without constructing the capture object (`regex/src/regex/string.rs:253–254, 1120–1124`).
- **Resource:** Capture-slot allocations go from **one to zero per checked record**. Regex search and any engine cache activity remain; owned deserialized records and the result vector are other allocation costs.

### 4. Clone tenant strings before inserting or looking them up

- **Location and hot path:** [ingest.rs:47]($PACKET/src/ingest.rs:47) handles each validated record. The user states tenants usually recur and may carry different shard assignments.
- **Cost, traced:** `entry(rec.tenant.clone())` clones the owned `String` for every reached record; `String::clone` clones its underlying vector (`alloc/src/string.rs:2428–2431`). On a hit the clone is discarded; on a miss it becomes the map key, while the original is later dropped. Nonempty tenant keys therefore incur one extra string-buffer allocation and copy per record.
- **Cheaper form:** Pass `rec.tenant` directly to `entry`. The record is consumed by the loop and its tenant is not used afterward. `or_insert(rec.assigned_shard)` still retains the first accepted shard, including when later assignments differ. The same records are accepted in the same order, with the same errors and prior cache mutations. The original tenant allocation moves into the map on a miss and is dropped on a hit.
- **Resource:** Extra tenant-copy allocations change from **one to zero per nonempty tenant**, on hits and misses. Deserialization still creates the tenant string; new map entries can still grow the map.
````

### sedge · AP33

````text
## Reader result

**Lens:** allocation, whole module [src/ingest.rs]($PACKET/src/ingest.rs). The user specifies a long-lived worker, up to 2,000 records per manifest, recurring client-supplied tenants, and disabled debug tracing.

**Read:** the four requested review documents, the full module, `Cargo.toml`, relevant lockfile entries, and the relevant Rust 1.100.0 and regex 1.13.2 source. No in-scope source was unread. No outside-scope costs identified.

### 1. Remove cloned tenant keys

- **Location and hot path:** [ingest.rs:40]($PACKET/src/ingest.rs:40) and [ingest.rs:47]($PACKET/src/ingest.rs:47): once per accepted record, up to 2,000 per file.
- **Cost:** `entry(rec.tenant.clone())` clones the `String`; Rust’s [String clone](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/string.rs:2428) clones its byte vector. The original tenant is otherwise unused after this point. Cache hits also discard the cloned key.
- **Cheaper form:** pass `rec.tenant` directly to `entry`. This preserves the first accepted shard, including when later assignments differ, as well as ordering and failure behavior. The retained key’s allocation is moved into the map on a miss.
- **Resource:** one string-buffer copy and allocation for each nonempty tenant → zero per accepted record; deserialization still allocates the original tenant and other owned fields.

### 2. Defer the missing-tag message

- **Location and hot path:** [ingest.rs:42]($PACKET/src/ingest.rs:42), once per processed record.
- **Cost:** `ok_or(format!(...))` constructs the error string before `ok_or` receives it, including when the tag exists.
- **Cheaper form:** use `ok_or_else(|| format!("missing tag on {}", rec.id))?`. It preserves the error text and the point at which a missing tag stops processing.
- **Resource:** error-message construction on every processed record → only on the first missing tag. Record deserialization and sorting remain on the same path.

### 3. Avoid capture storage for validation

- **Location and hot path:** [ingest.rs:43]($PACKET/src/ingest.rs:43), once per record with a tag, until an error.
- **Cost:** `captures(...).is_none()` only tests existence. In regex 1.13.2, [`captures_at`](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/regex-1.13.2/src/regex/string.rs:1193) creates captures before searching; [`Captures::all`](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/regex-automata-0.4.19/src/util/captures.rs:215) allocates the slot vector, including on a miss.
- **Cheaper form:** `if !CODE_RE.is_match(&rec.code)`. It preserves match acceptance and the existing error and mutation order.
- **Resource:** one capture-slot vector allocation → none per validation; regex searching and the allocations for parsed records remain. Regex engine cache initialization or growth is separate from this count.

### 4. Compare folded bytes without allocating sort keys

- **Location and hot path:** [ingest.rs:37]($PACKET/src/ingest.rs:37), once per manifest before validation.
- **Cost:** `sort_by_key(|r| r.code.to_ascii_lowercase())` constructs keys during comparisons. The installed [sort implementation](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/slice.rs:247) calls the key function for both operands; [ASCII lowercase](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/str.rs:889) creates a byte vector. Thus each comparison creates two temporary strings for nonempty codes.
- **Cheaper form:** stable `sort_by` comparing `a.code.bytes().map(|b| b.to_ascii_lowercase())` with the corresponding iterator for `b`. Bytewise ASCII folding also preserves the existing ordering for non-ASCII input, which matters because sorting precedes validation. Stable sorting preserves equal-key order and therefore which shard wins.
- **Resource:** two temporary key buffers per comparison → zero. The sort’s own storage and deserialized record allocations remain. As an alternative, `sort_by_cached_key` limits key construction to at most once per record, but retains keys and auxiliary storage during sorting.

All sketches use existing dependencies and APIs available within the declared Rust 1.80 baseline. They preserve the public API and introduce no new `Send` or `Sync` bounds. These are reader candidates; no independent challenger review, build, or benchmark was run.
````

### cedar · AP34

````text
## Reader result

**Lens and scope:** allocation review of the whole [src/ingest.rs]($PACKET/src/ingest.rs). I read the module, the four requested review documents, `Cargo.toml`, `Cargo.lock`, and relevant Serde 1.0.229 and serde_json 1.0.154 deserialization source. The load basis is the user’s description: one invocation per manifest, up to 2,000 records, with debug tracing disabled. No in-scope source was unread; no outside-scope costs were identified.

### 1. Avoid retaining decoded tag strings

- **Location:** [BorrowedStr and RawRecord]($PACKET/src/ingest.rs:14); [ingest_manifest]($PACKET/src/ingest.rs:49).
- **Hot path:** Each manifest deserializes every record before processing it. The saving applies to each tag containing JSON escapes; the supplied workload does not establish how often those occur.
- **Cost, traced:** `tag` is an `Option<BorrowedStr>` whose inner `Cow<str>` has `#[serde(borrow)]`. Serde’s transparent derive uses the borrowed-Cow deserializer; for a copied string, its `visit_str` calls `v.to_owned()` ([derive](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/serde_derive-1.0.229/src/de.rs:390), [visitor](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/serde-1.0.229/src/private/de.rs:79)). For escaped strings, serde_json decodes into reusable scratch storage and passes `visit_str` ([reader](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/serde_json-1.0.154/src/read.rs:541), [deserializer](~/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/serde_json-1.0.154/src/de.rs:1535)). The owned tag is retained through sorting, but processing only checks that it is present. Unescaped tags already borrow without this allocation.
- **Cheaper form:** Deserialize the option’s inner value with a string visitor that validates the same string type and discards its contents, retaining only presence. Preserve the visitor’s expected-type error text, null and missing handling, and validation timing. Record order, cache updates, returned results, public API and concurrency bounds stay the same; decoded tag storage is no longer retained. This uses existing Serde APIs and the declared Rust baseline.
- **Resource:** For **E nonempty escaped tags**, this removes E owned-string allocations and copies; serde_json’s scratch-buffer growth remains. Manifest bytes, record storage, bucket vectors and any new route keys still allocate on the same path. No allocation profile establishes which dominates.
````

### larch · AP34

````text
**Allocation lens — whole module:** one conditional candidate, affecting records whose tags contain JSON escapes. The worker processes up to 2,000 records per manifest, as supplied in the request.

Read [src/ingest.rs]($PACKET/src/ingest.rs) in full, the four requested review documents, `Cargo.toml`, `Cargo.lock`, and relevant resolved Serde and serde_json source. No in-scope source was unread. No outside-scope costs identified.

### 1. Avoid retaining decoded tag strings

- **Location:** [ingest.rs:14]($PACKET/src/ingest.rs:14), [ingest.rs:57]($PACKET/src/ingest.rs:57).
- **Hot path:** `ingest_manifest` deserializes every record before sorting and checks each tag while processing the manifest. The user describes this as a long-lived worker invoked per incoming file.
- **Cost, traced:**
  1. `RawRecord` stores `tag: Option<BorrowedStr<'a>>`; the wrapper contains a borrowed `Cow<str>`. Serde 1.0.229’s derive selects `borrow_cow_str` for that field, and `Option` delegates present values to the wrapper’s deserializer.
  2. For an escaped JSON string, serde_json 1.0.154 decodes into scratch storage and calls `visit_str`; Serde’s visitor then does `Cow::Owned(v.to_owned())`. This creates one additional owned string per escaped tag during parsing.
  3. The processing loop only checks whether the tag exists. The decoded value is otherwise unused with debug tracing disabled. Unescaped tags already borrow from the input and incur no tag-string allocation.
- **Cheaper form:** Replace the internal tag wrapper with a custom `Deserialize` visitor that accepts a string through `deserialize_str`, discards its contents, and retains only presence; retain `Option` and the visitor’s `"a string"` expectation. This uses existing Serde APIs and preserves JSON type validation, missing/null handling, processing order, shard selection, errors, and the public API. The decoded tag is no longer retained or available for debug formatting if debug tracing is later enabled; the supplied workload has it disabled.
- **Resource:** For each escaped, nonempty tag, the extra owned tag allocation and copy go from **1 to 0**. serde_json’s decode scratch work remains, as do allocations for the input, record/output vectors, buckets and newly cached tenants. The relative magnitude is unknown without workload measurements.
````

## Preliminary append

### hazel · AP39

````text
**Lens:** allocation, `src/lib.rs`.

**Read:** the four review packet files and all of `src/lib.rs`; consulted the installed Rust 1.100.0 `Arc`, `Vec`, and slice sources. Load basis: the user states that each incoming record calls `append`, most appends have no reader of the current version, and snapshots may survive several appends. The project’s manifest and supported Rust baseline were outside the permitted packet.

### 1. Avoid copying the journal on every successful append

- **Location:** [src/lib.rs]($PACKET/src/lib.rs:24), `TagLog::append`.
- **Hot path:** one call per incoming record, per the user’s scope. The copied bytes are multiplied by the journal length at each successful append.
- **Cost, traced:**
  1. Lines 25–26 call `snapshot()` and read its length. Lines 20–21 clone the `Arc`, so `current` holds another strong reference until it is dropped.
  2. On a matching offset, line 30 calls `Arc::make_mut` while `current` is still alive. Installed `alloc/src/sync.rs:2645–2658` clones the inner value when another strong reference exists.
  3. `Vec::clone` delegates to slice copying (`alloc/src/vec/mod.rs:3832–3840`); for `u8`, `alloc/src/slice.rs:443–457` allocates capacity for the length and copies the bytes. `push` may then grow the new buffer. There is no earlier uniqueness check or capacity reuse on this path.
- **Cheaper form:** read `let end = self.tags.len();` directly before the existing offset check. An independently supported alternative is to keep the snapshot and explicitly `drop(current)` after reading its length, before `make_mut`. Both retain the offset error and leave the journal untouched on mismatch; an actual outstanding snapshot still causes copy-on-write and retains its old bytes. Results, ordering, public API and `Send`/`Sync` properties remain unchanged. The temporary snapshot is released earlier, so allocation and destruction timing changes. These use standard APIs, though the project baseline could not be checked within the permitted scope.
- **Resource:** with no actual reader and a nonempty journal, the direct-length form removes **one new `Arc` allocation, one new vector-buffer allocation, and a copy of the current length** per successful append. The push can still grow the existing vector when capacity is exhausted; with a real reader, copy-on-write remains necessary. The journal copy is the largest allocation-related work on the original path. On mismatches, direct length also avoids the temporary `Arc` clone; neither form allocates a new journal there.
````

### alder · AP40

````text
**Lens and scope:** Allocation review of `src/lib.rs`. The user’s workload establishes one `append` per incoming record, occasional snapshots, and usually no reader of the current version.

**Read:** `src/lib.rs` in full, `Cargo.toml`, the four requested review documents, and the relevant Rust 1.100 `Arc`, `Vec`, and slice allocation source. No in-scope source was unread. There are no outside-scope costs to report.

### 1. Avoid growing the newly cloned buffer on a shared append

- **Location:** [src/lib.rs:24]($PACKET/src/lib.rs:24), `TagLog::append`.
- **Hot path:** Each incoming record calls `append` once. This cost applies when the offset matches and a snapshot still shares the current version.
- **Cost, traced:** The mismatch check returns before mutation ([lines 25–28]($PACKET/src/lib.rs:25)). Otherwise, line 29 calls `Arc::make_mut(...).push(tag)`. Rust’s [`Arc::make_mut`](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2656>) clones a shared value into a new `Arc`. [`Vec::clone`](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/vec/mod.rs:3838>) copies the slice into a buffer sized for its current length; the [`u8` slice path](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/slice.rs:444>) copies `N` bytes. The subsequent push needs room for one more byte and grows that buffer. Growth may extend in place; an additional physical copy is not guaranteed. When the `Arc` is unique, `make_mut` already avoids the clone.
- **Cheaper form — tradeoff:** After the offset check, use `Arc::get_mut` for the unique case. For the shared case, construct a new vector with capacity for at least `N + 1`, copy the existing bytes, push the tag, then replace the `Arc`. This keeps the API, byte order, snapshot contents, mismatch result, and `Send`/`Sync` properties; it uses stable APIs available on the stated Rust baseline. If a reader drops concurrently after `get_mut` reports sharing, this form can still copy where `make_mut` might subsequently see uniqueness. Capacity selection also changes future growth and retained memory; allocating only `N + 1` may cause an earlier later growth than the current geometric growth. Capacity overflow and allocation-failure behavior need to be preserved when implementing it.
- **Resource:** For a nonempty shared version, the current path performs one new `Arc` allocation, one vector allocation, and one vector growth request; the sketch removes that growth request. Both still copy `N` bytes for snapshot isolation, the dominant size-dependent work. Most appends are unique and do not receive this saving.

This is a reader candidate, not an independently challenged finding: the requested no-delegation constraint prevented the contract’s independent challenge.
````

## Preliminary fixed-size vector

### plum · AP39

````text
**Lens and scope:** Allocation review of `src/lib.rs`.

**Read:** `src/lib.rs` in full, `Cargo.toml`, the four review packet files, and the relevant Rust 1.100.0 `Arc`, `Vec`, and slice source. Load basis: the user’s description of thousands of hold commands between reloads, with most commands having no reader holding the current version. Nothing in scope was unread.

### 1. Avoid copying the board on every valid hold command

- **Location:** [src/lib.rs]($PACKET/src/lib.rs:24), `Board::toggle_hold`.
- **Hot path:** One call per hold command. The user states that boards receive thousands of commands between reloads.
- **Cost, traced:**
  1. Lines 25–26 create a `Snapshot` solely to read the length. `snapshot()` at lines 20–22 clones the `Arc`, adding a strong reference.
  2. The local `current` remains in scope at line 30, so `Arc::make_mut` sees another strong reference even when no external reader exists. Rust’s `alloc/src/sync.rs:2645–2658` takes the clone branch and allocates a new `Arc` ([`sync.rs:1560–1568`](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:1560>)).
  3. The contained `Vec<u8>` is deep-cloned: [`vec/mod.rs:3832–3841`](<~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/vec/mod.rs:3832>) delegates to slice `to_vec_in`, allocating and copying all **N** bytes. A valid index implies N is nonzero. No reuse or uniqueness check precedes this copy.
- **Cheaper form:** Read `let slots = self.flags.len();` directly, retain the existing bounds check and `Arc::make_mut` toggle. This keeps the public API, result and error behavior, immediate update, snapshot isolation, and `Send`/`Sync` properties. Existing snapshots still force copy-on-write; invalid indices still return the count without mutation. The temporary snapshot’s reference-count operations and drop disappear. This uses APIs available within the stated Rust 1.100 baseline.
- **Resource:** With no external reader, **two allocations and N copied bytes → zero allocations and zero copied bytes** per valid command; the single-byte toggle remains. With a reader holding the current version, the two allocations and N-byte copy remain necessary for this representation. The full-board copy is the largest allocation-related work on the current path.

An independently supported equivalent is to keep the length read through `current` and explicitly `drop(current)` before `Arc::make_mut`; direct length access also avoids creating the temporary reference.
````

### pine · AP40

````text
**Allocation lens — `src/lib.rs`.** Read the complete review packet, `src/lib.rs`, `Cargo.toml`, and the relevant Rust 1.100 `Arc` and `Vec` source. The hot-path basis is the user’s workload: thousands of commands between reloads, usually without a reader holding the current version. No in-scope source was unread. No outside-scope costs identified.

No behavior-preserving finding was established. One alternative has a supported allocation saving with a load-time tradeoff.

### 1. Use a single allocation for each shared board version — tradeoff

- **Location:** [src/lib.rs]($PACKET/src/lib.rs:3), `Board::load`, `snapshot`, and `toggle_hold`.
- **Hot path:** Each valid hold command toggles one byte; occasional snapshots can retain the current version.
- **Cost, traced:**
  1. `snapshot` clones the `Arc` ([line 21]($PACKET/src/lib.rs:21)). An invalid index returns before mutation ([lines 25–27]($PACKET/src/lib.rs:25)).
  2. A valid command calls `Arc::make_mut` ([line 29]($PACKET/src/lib.rs:29)). When another strong reference exists, [Rust’s `make_mut`](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2656) clones into a new `Arc`; [the clone operation](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:1560) allocates the `Arc` and clones its contents. [`Vec::clone`](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/vec/mod.rs:3832) allocates and copies the bytes.
  3. Thus, for a nonempty board, the first command that diverges from a retained current snapshot performs **two allocations and copies N bytes**. Later commands on the unique version allocate nothing until another snapshot retains it. A snapshot held across several commands alone does not cause repeated copies.
- **Alternative:** Store `Arc<[u8]>` in both opaque types, convert the input with `Arc::from(flags)` at load, and retain `Arc::make_mut` for toggles. A shared-version divergence then needs **one allocation and an N-byte copy**; the unique path still allocates nothing. It preserves the public methods, snapshot bytes, immediate toggles, invalid-index result, and `Send`/`Sync`. The APIs fit the declared Rust 1.100 baseline.
- **Tradeoff:** [`Arc::from(Vec)`](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:4199) copies N bytes and releases the original vector buffer during load; the current code moves the vector into an `Arc` without copying that buffer. This changes allocation and deallocation timing and shifts an N-byte copy to every reload. On shared-version commands, the N-byte copy remains the largest byte-processing cost; the saving is one allocation per divergence, not per command.
````

## Preliminary shared loader

### linden · AP39

````text
**Allocation lens — `src/lib.rs`.** One candidate: every valid hold command copies the entire flag image, even when the board is its sole owner.

Read in full: `src/lib.rs`, `Cargo.toml`, `contract.md`, `rust.md`, `allocation.md`, and `finding-template.md`. Consulted Rust 1.100.0 source for `Arc::clone`, `Arc::make_mut`, `Arc::get_mut`, allocation, and slice cloning. Load evidence is the user’s description: thousands of commands between reloads, with no reader holding the current version for most commands. No in-scope source was unread.

### 1. Avoid copying the image on uniquely owned valid commands

- **Location:** [src/lib.rs:24]($PACKET/src/lib.rs:24), `Board::toggle_hold`.
- **Hot path:** One invocation per hold command; the multiplier is commands between reloads.
- **Cost, traced:**
  1. Lines 25–26 call `self.snapshot()` and read its length. `snapshot` at line 21 clones the `Arc`; [Rust’s `Arc::clone`](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2504) increments the strong count and shares the allocation.
  2. For a valid slot, that local snapshot remains alive at line 30, so [`Arc::make_mut`](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:2645) sees another strong pointer and calls `clone_from_ref_in`. It [allocates an `Arc` and clones the slice](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/alloc/src/sync.rs:1560); the [`Copy` slice specialization](~/.rustup/toolchains/1.100.0-aarch64-apple-darwin/lib/rustlib/src/rust/library/core/src/clone/uninit.rs:67) copies all **N** bytes. Then one byte is toggled.
  3. There is no uniqueness fast path in the method. Invalid indices return before `make_mut` and do not allocate an image.
- **Cheaper form:** Before the existing code, check the index and try `Arc::get_mut`; if it succeeds, toggle the byte and return. Otherwise retain the existing path unchanged:

  ```rust
  if slot < self.flags.len() {
      if let Some(flags) = Arc::get_mut(&mut self.flags) {
          flags[slot] ^= 1;
          return Ok(());
      }
  }
  ```

  `get_mut` succeeds only without other strong **or weak** pointers. Thus shared snapshots and loader-held references retain the existing copy-on-write path; invalid indices retain their existing return path. Results, immediate visibility, snapshot contents, public API, and `Send`/`Sync` remain unchanged. The fast path has no temporary snapshot or image allocation to drop. The APIs are available within the declared Rust 1.100 baseline; no dependency or feature is added.
- **Resource:** For a valid command with no other strong or weak references, **one image allocation and N-byte copy → zero**, leaving the single-byte toggle. With another reference, the original allocation and copy remain. Allocation and full-image copying are the largest same-resource work on the original valid-command path.

An alternative is to read the length directly and call `make_mut` without creating the temporary snapshot. It also avoids the copy when uniquely owned, but is a **tradeoff**: with only external `Weak` references, `make_mut` can dissociate them instead of taking the existing strong-reference cloning branch, changing what concurrent `Weak::upgrade` calls can observe.

This is the reader result; no independent challenger was run, as requested.
````

### poplar · AP40

````text
**Allocation lens — `src/lib.rs`: no candidates.**

Read the complete review packet and `src/lib.rs`, including `Board::load`, `snapshot`, `toggle_hold`, and `Snapshot::bytes`. Consulted the installed Rust 1.100.0 source for `Arc::make_mut`. The workload basis is the user’s description: thousands of commands between reloads, with most commands running without a reader holding the current version. Nothing in scope was unread.

[`toggle_hold`]($PACKET/src/lib.rs:24) rejects an invalid index before mutation. For a valid slot, `Arc::make_mut` reuses the allocation when it is uniquely owned. If another strong reference exists—including a retained loader reference or snapshot—it allocates and clones the image so the existing reference keeps its version. Subsequent commands reuse the new image until it is shared again. Thus the full-image copy is conditional, not per command.

An eager copy at load or snapshot time would move or add copying; the supplied workload does not establish an allocation saving from it.
````

## Supplementary desktop baseline

### vinca · AP37

````text
## Reader result

- **Lens and scope:** Complexity of manifest routing in `src/lib.rs`.
- **Read:** `shards` in full, `Cargo.toml`, `Cargo.lock`, and the relevant Rust 1.100 standard-library and bundled hashbrown source. The assignment establishes that the ingestion worker calls `shards` once per manifest and that tenant names can repeat and vary in byte length. Nothing in scope was unread.
- **Outside scope:** None.

### 1. Remove the per-manifest routing map

- **Location:** `src/lib.rs:4–8`, `shards`.
- **Hot path:** Per the assignment, the worker calls `shards` once per manifest. The loop at line 6 runs once for each of its N tenant positions.
- **Cost, traced:**
  1. Line 7 calls `routes.entry(tenant).or_insert_with(|| (tenant.len() as u32) % 16)`. Repeated names avoid recomputing the expression, but still perform an entry lookup.
  2. Rust 1.100 `std/src/collections/hash/map.rs:1012–1013` delegates `entry` to `rustc_entry`; bundled `hashbrown-0.17.1/src/rustc_entry.rs:35–47` computes `make_hash` and searches the table, reserving on misses. `map.rs:236–242` calls `hash_builder.hash_one(val)`.
  3. `core/src/hash/mod.rs:863–867,940–945` hashes `&str` through `str::hash` and `write_str`. `std/src/hash/random.rs:135–136` forwards to SipHash; `core/src/hash/sip.rs:256–303` processes the string bytes. Thus each manifest hashes all tenant bytes at least once, with additional lookups, comparisons, map growth and potential rehashing.
  4. The cached calculation only uses `tenant.len()`; `core/src/str/mod.rs:155–156` returns the byte-slice length without scanning. `out` already reserves N positions at line 5.
- **Cheaper form:** Remove `routes` and push `(tenant.len() as u32) % 16` directly for each input. Equal strings necessarily have equal byte lengths, so repeated and distinct names produce the same shard and retain input order. The public signature, output, `Send`/`Sync` properties and lack of recoverable errors remain unchanged; no dependency or feature is needed under the declared Rust 1.100 baseline. The internal map and its allocation/drop disappear.
- **Resource:** N entry lookups and at least the sum of tenant byte lengths hashed become zero; N constant-time length/cast/modulo calculations and N output pushes remain. This saves CPU and map allocator work. Output allocation and N writes remain; without measurements, their relative CPU cost is unknown. Removing the map also removes its allocation-failure opportunities.

No separate faster-hasher recommendation is supported: clients choose the inserted keys, and the map itself is unnecessary.
````

## CLI authentication failure

### vinca-cli-no-config · AP37

````text
unexpected status 401 Unauthorized: Missing bearer or basic authentication in header, url: https://api.openai.com/v1/responses, cf-ray: a5ced11f6d79e3e3-IAD, request id: req_b8af3020b513411abf844c3d7ce9e0f4
````
