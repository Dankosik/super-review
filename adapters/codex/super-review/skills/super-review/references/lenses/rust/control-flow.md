# Rust control flow

## rust.flow.show-main-path

**Main path.** Can readers see the operation, alternatives and exits without
mentally evaluating nested plumbing? Compare the current structure with the
simplest expression of the same decisions, not the fewest lines.

A supported `?`, `if let`, `let else` or `match` can expose intent. Keep a match
whose arms express recovery or distinct work. Keep an ordinary loop when a
combinator chain hides state, effects or stopping conditions. Do not translate
all code into iterator pipelines or infer a finding from nesting alone.

Preserve the relevant error conversion, return boundary, evaluation order,
eager/lazy defaults and drop scopes. A closure changes the return boundary;
short-circuiting can skip effects an eager collection performed. Establish the
supported edition/MSRV before introducing syntax. Show which decisions become
easier to follow, or retain the clear form.
