# Rust rationale

## rust.rationale.explain-constraints

**Recoverable intent.** Does a non-obvious changed choice leave maintainers unable
to distinguish a deliberate constraint from accidental complexity? Read nearby
contracts and uses before suggesting an explanation. Explain a supported reason
or caller obligation, not the syntax.

A deliberate clone, guard lifetime, MSRV workaround or established FFI precondition
may deserve explanation. Rustdoc sections such as Errors, Panics or Safety can
expose an existing contract otherwise buried in the implementation. Do not invent
a safety proof, assess soundness, audit every unsafe block or demand comments on
every public item. Unverified rationale remains an evidence gap.

Prefer a clearer name or structure when it removes the need for commentary.
Keep accurate existing explanations. Show what a future reader would learn and
where it belongs without turning documentation into a correctness review.
