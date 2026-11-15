# Control flow

## ts.flow.show-main-path

**Visible main path.** Trace the normal result, alternatives, and exits through
the function. Target nested ternaries, callback pyramids, mutable loop flags,
repeated checks on already-narrowed values, and decisions pushed one call too
low (passing an optional or union value into a single-caller helper only to
return immediately on `undefined` or branch back out).

Use guard clauses, named predicates, existing discriminants, and TypeScript
control-flow narrowing to expose the main path, and choose `async`/`await` or a
promise chain according to whichever states the sequence directly. Spell out
variants over module-owned discriminated unions when a catch-all `default` hides
which cases reach it.

**Keep when:** a short conditional or direct loop already reads clearer than
extracted helpers; or changing the expression would alter distinctions among
missing properties, `undefined`, `null`, and falsy values (`||`, `??`, optional
chaining, and `in` are not interchangeable), serial versus concurrent work
(`Promise.all` is not a cosmetic substitute for sequential `await`), error
capture (`return await` inside `try`/`catch`/`finally`), short-circuiting, or
cleanup timing. Judge reading burden rather than hunting async bugs, and show
which path becomes easier to follow.
