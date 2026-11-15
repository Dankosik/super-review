# Rust function cohesion

## rust.functions.extract-for-clarity

**Load-bearing helpers.** Read the function, its immediate helpers, and their
calls as one operation. Extract a helper when its name, inputs, output, and
error state a complete decision the caller can use without opening its body.
Inline existing helpers that chop one linear pipeline into single-caller
fragments, forward arguments unchanged, or mutate the caller's locals through a
row of `&mut` parameters and bookkeeping tuples; they scatter the story across
declarations without hiding a decision. Compare knowledge removed from the
caller against added arguments, lifetimes, trait bounds, and navigation; line
count alone never earns a split.

## rust.functions.coherent-purpose

**One story.** Separate mixed responsibilities when one function interleaves
orchestration with byte, index, or wire arithmetic; switches between unrelated
bodies on a boolean or mode parameter; threads a Data Clump of parameters across
calls instead of naming one value; buries inputs inside a long mid-function
closure's captures; takes `self` without reading it (an associated or free
function states that directly); or hides I/O or task spawning behind `new` where
Rust names the effect (`File::open`, `TcpListener::bind`, `thread::spawn`).

**Keep when:** a linear transformation, clear orchestration with `?`, or a long
flat `match` with parallel arms already tells one story; a single-caller helper
encapsulates a complete decision; a trait fixes an unused `&self` signature; or
moving code across a call would shift a guard, transaction, or owned value's
`Drop` boundary or manufacture borrow-checker friction solved by extra `.clone()`,
boxing, or `Arc`. Ordinary functions suffice here; new service structs, builders,
or traits belong to abstractions.
