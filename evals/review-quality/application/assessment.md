# Blind static maintenance comparison

Both supplied reset implementations appear to satisfy the added contract without changing existing decoding paths. C has the narrower edit; D retains the stronger representation of mutually exclusive decoder stages. My bounded design preference is A under the original contract and D after the maintenance request, for that state-representation reason. This is a qualitative judgment about the supplied parser, not a measured or generalized maintainability improvement. Static contract findings are tied: I identified no definite contract violation in either pair.

## Evidence and limits

I read the complete `Cargo.toml` and `src/lib.rs` supplied for each of A, B, C, and D, plus the original contract, added request, and correspondence in `blind-input.json`. A→D and B→C were used solely to inspect the maintenance edits. No provenance or instruction-arm identity was inferred.

The findings below are source deductions. No source was executed, compiled, tested, benchmarked, or submitted to another model. No other artifacts, reviews, or instruction variants were inspected. Compilation, runtime correctness, and behavior outside the supplied files remain unverified. The packet contains no test files, so this assessment does not establish test coverage or changes outside the packet. It grants no delivery acceptance.

## A and B under the original contract

The manifests, error type and formatting, encoder, and returned `Decoded` structure are identical. Neither manifest declares dependencies. Both implementations use standard-library storage and expose the requested public calls. Their substantive difference is the decoder's representation and control flow.

| Concern | A | B | Assessment |
| --- | --- | --- | --- |
| Decoder stages | `Phase` holds `AwaitCount`, `AwaitValue(count)`, `Emit { remaining, value }`, `Ended`, or `Failed`. | Separate `count`, `pending`, `ended`, and `failed` fields describe progress and terminal conditions. | A makes stage exclusion explicit in the representation. B requires the reader to follow relationships among fields. |
| Budget accounting | `remaining_capacity` is checked and decremented when a complete pair is accepted. | `max` and `reserved` are related by `reserved <= max`; accepted pairs increase `reserved`. | A's original accounting needs one mutable quantity. B explicitly preserves the constructor limit, although reuse is not yet required. |
| Boundary ordering | `Failed` and `Ended` arms precede the output-budget guard in the main match. Input exhaustion is checked before indexing. | Failed and ended checks occur before the decoding loop; the loop condition enforces the budget. Input exhaustion is checked before indexing. | B makes entry-state precedence especially easy to locate. A gathers progression into one match, whose arm order remains important. |
| Terminal state | Transitioning to `Failed` replaces any pending stage. | Failure can coexist with old progress fields; a post-end error can leave both `ended` and `failed` true. | A discards obsolete stage data structurally. B is still correct on inspection because failure is checked first. The extra combinations are an invariant burden, not an observed bug. |

A's enum is doing a present job: representing stages that own different pending data. It is not a dependency, framework, or extra execution layer. The count belongs to `AwaitValue`; remaining output and its value belong to `Emit`. In B, those responsibilities are carried by optional fields and branch order. For example, the reader must establish that pending output is drained before a count or value is read, that `count` and `pending` do not represent simultaneous live stages, and that terminal failure suppresses any retained progress.

Neither representation removes all procedural invariants. A still relies on transitions to keep counts nonzero, keep emission counts valid, and reserve capacity before entering `Emit`. B's `take()` operations make consumption of pending state explicit, and its small private implementation makes the relationships inspectable. Consequently, A's advantage is specific to stage visibility; it does not establish that B is defective or that enums always yield better designs.

The following contract conclusions are supported by both supplied sources:

- The shared encoder preserves partial runs across calls, emits a full run when an existing count of 254 receives the next matching byte, and then starts a new pending run if more bytes arrive. `finish` emits a pending pair and one terminator; repeated finishes return no bytes, and subsequent pushes return `Closed`.
- Active zero-budget decoding does not consume input or emit output. Terminal failure and successful completion are handled before the active budget condition, preserving their required precedence even at zero budget.
- Pending repetitions are handled before additional input. A count can be retained without a value and without a reservation. A complete pair is checked against the entire remaining cap before any of that pair is emitted.
- Filling the output budget prevents inspection of subsequent wire bytes. With capacity left in the output batch, a terminator is consumed and extra bytes in that same input cause `TrailingData`. The end state accepts empty calls and rejects nonempty calls.
- `finish` succeeds only in the end state. Any first decoder error makes later calls return `Failed`; local output from the failing call is not returned.
- Retained state is bounded and contains no unconsumed input slice. Output vectors grow with produced output rather than with the requested budget. The decoding loops advance an input position or emit a bounded run portion; this supports the specified work bound as a static structural deduction, not a timing measurement.

Arithmetic safety has an identifiable source basis. A checks before subtracting a count from capacity. B checks `count <= max - reserved` before increasing `reserved`, preserving `reserved <= max` and preventing addition overflow, including when `max == usize::MAX`. Both limit each emission to the remaining output budget; the narrowing cast used to subtract an emitted portion is taken only when that portion is smaller than the retained byte-sized count. Indexing follows an input-exhaustion guard. These observations support the contract but are not a compiled or exhaustive runtime proof of the no-panic requirement. Ordinary allocation failure remains excluded by the contract.

## The actual maintenance edits

Exact text comparisons of the packet established:

- B→C adds only `pub fn reset(&mut self) { *self = Self::new(self.max); }` to the supplied library source.
- A→D adds a private `max_decoded_bytes: usize` field, initializes it from the constructor argument, and adds `pub fn reset(&mut self) { *self = Self::new(self.max_decoded_bytes); }`.
- Removing precisely those additions restores the respective supplied predecessor source. All four manifests are identical. The existing encoder, decoder `push` and `finish`, error definitions, and output structure are unchanged by each maintenance edit.

C already has the original limit available in `max`. Its edit introduces a reset operation that depends on the existing constructor as the owner of fresh state. D must preserve the original limit separately because `remaining_capacity` alone loses that information as streams advance. Its new field therefore has a concrete responsibility introduced by reset. It does not duplicate another stored original-limit field or create a configuration path.

Both edits reuse constructor initialization instead of maintaining a second list of fields to clear. This directly expresses the requested equivalence to `Decoder::new(original_limit)`. Future changes to initialization will flow into reset through this shared owner. A future policy change that makes reset differ from construction would require revisiting this dependency; no such distinction is requested here.

## C and D under the added contract

Both methods are unconditional and replace the whole decoder with a newly initialized value using the preserved constructor limit. C restores `reserved`, both optional progress fields, and both terminal flags. D restores `remaining_capacity` and `Phase::AwaitCount`. Neither decoding path modifies its stored original limit. These facts support reset from every reachable state, including abandonment and failure, and support repeated-reset equivalence.

The following are hand-derived consequences of the source, not executed checks:

| Old state or limit | Result after reset in both versions |
| --- | --- |
| A count is awaiting its value | The retained count is discarded. Subsequent input is interpreted as a new stream, beginning with a count. |
| A complete pair has reserved capacity and has output remaining | Pending repetitions and the reservation are discarded. The full original stream capacity is available again. |
| Successful end or successful finish | The decoder is active again; an empty zero-budget call returns zero consumption, empty output, and `ended: false`. |
| Any failure, including truncation caused by `finish` | Failure is cleared. Calling `finish` immediately after reset produces a new `Truncated`, followed by `Failed` on later calls until another reset. |
| Original limit is zero | `[0]` can end the new stream with positive output budget; a complete nonempty pair fails its unchanged cap check. A lone count still awaits its value. |
| Original limit is `usize::MAX` | The exact limit is retained; the same guarded arithmetic applies afresh. |

Previously returned `Vec<u8>` values are owned by the caller, and reset holds no reference to them. Neither representation retains an input suffix, so reset cannot recover one; supplying an old suffix afterward necessarily presents it as new-stream input. Reset adds no I/O, dependency, encoder operation, output allocation, or changed byte-cap API. D adds fixed-size retained state, which remains within the required resource bound; no memory-performance benefit is claimed for either version.

For callers that never reset, the source comparisons show unchanged decoding bodies. D's extra field is initialized and read by reset but does not participate in existing decoding. Thus there is no identified new preservation defect in either edit. C exposes fewer existing definitions to modification, which is a concrete review-scope advantage. D's additional constructor and field changes are directly required by its previous representation and are small enough to inspect completely here; their necessity is not evidence of an inferior final design.

## Comparative judgment

The functional result is a static tie, with compilation and runtime behavior unverified. C has the narrower maintenance delta because B already retained the constructor limit. D remains preferable to me for this parser's state visibility: one phase owns the currently meaningful pending data, and completion and failure cannot coexist with another stage in that field. D now also visibly separates immutable stream policy from mutable remaining capacity. C preserves B's useful explicit terminal preflight, but its independent progress fields still require relational reasoning.

The followup therefore demonstrates two different facts: existing limit retention reduced the edit needed for B→C, while the final D design kept a concrete state-model advantage despite requiring an extra field. It does not establish editing time, token cost, measured performance, generalized maintainability gains, or any score derived from source length.
