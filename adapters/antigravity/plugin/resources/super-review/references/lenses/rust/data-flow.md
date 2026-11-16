# Rust data flow

## rust.data.make-transformations-visible

**Visible ownership and transitions.** Follow each value from origin through
transformations, mutation, and eventual owner across actual uses (never from
isolated `.clone()` or `&mut` tokens). Name the obscured transition and the
smallest direct rewrite.

Bind values where they are decided and let ownership tell the true story:
- Replace placeholder `let mut` bindings assigned in branches below, variables
  reused for a second meaning, or numbered/type-suffixed twins of one value with
  `let x = if ..`, `match`, a block expression, or idiomatic refinement
  shadowing (`let line = line.trim();`), and drop `mut` once setup finishes
  (`let config = config;`).
- Replace borrow-appeasing copies (`clone` made only to end a borrow, `to_owned`
  passed to a read-only callee, or cloning out of a value consumed on the next
  line) with a borrow, move, destructuring, or `mem::take`/`Option::take` when
  the state left behind stays valid on every exit.
- When `&mut self` blocks a borrow of another field and triggers a `clone` or
  `RefCell`, pass only the needed fields or group them into a smaller struct;
  replace `Rc`, `Arc`, `RefCell`, or `Mutex` with a plain field when one owner
  already holds `&mut`.
- Collapse cross-seam repackaging and staging ceremony: `collect` used only to
  iterate once more, check `len`, cross an internal helper seam, or feed
  `fmt::Debug`/a builder that accepts items directly (`fmt::from_fn`); manual
  index loops fetching `v[i]` and neighbors where slices, `windows`, `zip`,
  `chunks`, `chunk_by` (within MSRV), or `enumerate` name the unit;
  `contains_key` before `insert`/`get` where `entry` or `if let Some(..) =
  map.get(..)` asks once; and hand-rolled folds matching `sum`, `any`, `all`,
  `find`, `min_by_key`, or `max_by_key`.
- Express conversions directly: `From` for lossless widening, `TryFrom` for
  checked conversions, `format!` over multi-step string `+`/`push_str` assembly,
  `Cow::Borrowed` when an unchanged slice stays borrowed, and direct checks on
  parsed values or input bytes/chars instead of round-trip formatting or
  re-parsing text across internal calls.

**Keep when:** an owned parameter states a real transfer, snapshot, shared
handle (`Arc::clone` is not a deep copy), or task move without spreading
lifetime parameters; a copy of small immutable data beats lifetime noise; `as`
expresses intentional truncating or wrapping semantics; `insert` versus `entry`
differs on existing keys; byte iteration serves byte offsets or cost bounds; an
ordinary loop makes effects, early exits, or multi-step accumulators clearer
than combinators; or a `collect`/staging step releases a borrow, establishes
error precedence, guarantees all-or-nothing output, or preserves bounded
streaming/suspension state (moving a container into the caller removes nothing).
Name the reading benefit itself; a speedup or allocation reduction is not a
readability claim.
