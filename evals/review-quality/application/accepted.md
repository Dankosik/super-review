# Accepted application input

This is the parent's bounded acceptance of the recommendations in the preselected
q07 report, against the original application source and CONTRACT.md. It is not a
new review, a test result or permission to extend the codec.

## A1: name the effective decoder phase

Accept the private phase-enum proposal with a corrected factual explanation.
The original terminal flags can coexist with inaccessible residual data:
finish can set failed while a count or pending run remains, and trailing data
after a completed stream can leave both ended and failed true. Current branch
precedence determines the effective phase. The representation burden survives;
do not copy the raw report's blanket exclusion claim.

A sufficient shape is:

```rust
enum Phase {
    AwaitCount,
    AwaitValue(u8),
    Emit { remaining: u8, value: u8 },
    Ended,
    Failed,
}
```

The names are illustrative. A count enters AwaitValue only when nonzero.
Accepting its value reserves the complete run before entering Emit. Draining a
run returns to AwaitCount. An end marker enters Ended; the first error enters
Failed, whose future calls return Error::Failed. Terminal latent progress is
not observable after failure under the existing contract.

Keep the original zero-output-budget behavior, greedy stopping boundary,
consumed counts, partial-pair retention and first-error precedence. finish must
not drain output. No input bytes after the reached output budget may be examined.

## A2: store available capacity directly

Accept remaining_capacity in place of max and reserved under this existing
contract. The original cap and consumed reservation have no independent reader.
Initialize available capacity from the constructor's argument, compare a complete
pair's count against it, and subtract only on acceptance. Reserve the whole run,
including output deferred to later calls; a count without a value reserves none.
Keep inclusive caps and usize::MAX behavior. Do not add reporting, reset or any
other capability to justify retaining a second value.

## Combined scope and evidence

A1 and A2 can be applied together: capacity is independent of the phase payload.
Change only the private Decoder representation and its existing methods.
Preserve Error display/traits, Encoder, Decoded, public signatures and resource
bounds. Do not rewrite unrelated code or add tests.

Acceptance is based on static source reasoning. No compilation, execution or
behavioral-equivalence proof has been performed. Implementer owns the concrete
equivalent transformation within these constraints.
