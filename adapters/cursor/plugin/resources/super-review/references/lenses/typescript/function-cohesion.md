# Function cohesion

## ts.functions.extract-for-clarity

**Useful names.** Does a helper name an independent operation or remove repeated
knowledge, rather than simply hide lines? Compare the whole affected function and
its calls. Extract a cohesive transformation when the caller becomes a clearer
account of its task; retain a linear sequence when helpers would scatter the story.
Function length alone is not a finding. Check closure captures, `this`, callback
identity, and async boundaries implicated by extraction.

## ts.functions.coherent-purpose

**One responsibility.** Can a reader describe the operation without combining
unrelated responsibilities? Separate independent calculations or adapters when the
boundary makes their inputs and outcomes intelligible. Do not turn each branch,
object construction, or JSX fragment into a new function or component.

For established UI code, distinguish presentation, state transitions, and external
effects only where the changed function genuinely mixes separate concepts. A
custom hook or component should encapsulate a meaningful responsibility, not merely
reduce line count. Preserve the framework's actual invocation, identity, and lifetime
contracts; do not create a general hooks-correctness or performance review.
