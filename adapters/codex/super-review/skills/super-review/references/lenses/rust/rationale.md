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

Prefer a clearer name, type, assertion or structure when it removes the need for
commentary. Keep comments that record a reason, rejected alternative, external
constraint or invariant spanning items the code cannot enforce. A comment that
restates what the adjacent name, signature or statement already shows still
costs an edit whenever the code changes; recommend deleting it or moving its fact
into a name or type. Remove or correct a comment only with evidence that it is
redundant or stale. Doc comments that become product output, such as clap help,
OpenAPI or schema descriptions, and configuration notes, are interface text,
not commentary. A rustdoc reference to an item can use an intra-doc link, which
`cargo doc` reports after a rename or removal for the items it documents. Show what a future
reader would learn and where it belongs without turning documentation into a
correctness review.
