# Control flow

## ts.flow.show-main-path

**Visible decisions.** Can readers follow the main result and its alternatives
without mentally evaluating nested callbacks, ternaries, or scattered state flags?
Name a meaningful condition or use a guard when it removes that burden. Retain a
short conditional or a straightforward loop when extraction adds navigation cost.

Use existing discriminants and control-flow narrowing to make branches legible.
Do not add branches, validation, or exhaustiveness machinery merely to prevent a
hypothetical bug. Preserve distinctions among missing, nullish, and falsy values;
`||`, `??`, optional chaining, and explicit checks are not interchangeable.

Compare `async`/`await` and promise chains by how clearly they expose the existing
sequence. Neither spelling is mandatory. A rewrite must preserve when work starts,
serial versus concurrent execution, short-circuiting, rejection handling, callback
invocation, and cleanup boundaries. `Promise.all` is not a cosmetic replacement
for sequential awaits; removing `await` inside `try` can alter error handling.
These are constraints on advice, not a search for async bugs. Identify the actual
path that becomes easier to read, or keep the existing expression.
