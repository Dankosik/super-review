# Java function cohesion

## java.functions.coherent-purpose

**One story.** Read the changed method, its private helpers, collaborators, and
calls as one operation. Separate responsibilities when a method mixes high-level
orchestration with low-level parsing, formatting, or mode-switched branches
sharing little. Inline or regroup single-caller private helpers when they chop
one linear sequence into step-by-step fragments that force readers to jump
across methods without hiding a decision; neither a line budget nor helper count
establishes cohesion.

## java.functions.extract-for-clarity

**Load-bearing helpers.** Extract the smallest method with explicit inputs and
return value when it names a real domain rule, isolates an independent
calculation, or removes repeated knowledge. Avoid helpers that take opaque
parameter rows, boolean modes, or hidden mutable fields just to relocate lines;
keep temporary state local and pass needed inputs explicitly.

**Keep when:** a linear method already tells its story clearly in place; or
moving statements across a method or bean boundary would alter checked-exception
propagation, `synchronized` scope, `try`-with-resources lifetime, or
annotation-driven proxy behavior (self-invoking a private `@Transactional` or
`@Async` helper bypasses Spring/CDI proxies, while moving code to another bean
adds a real boundary). Keep local calculations as methods; new service layers or
interfaces belong to abstractions. Show the named operation and what becomes
independently understandable.
