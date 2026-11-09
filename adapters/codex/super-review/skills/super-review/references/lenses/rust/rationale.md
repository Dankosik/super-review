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

A lint suppression states an exception, not its reason. Where the crate's
baseline supports it, `#[expect(lint, reason = "..")]` carries the reason and
reports the suppression once it stops applying; an adjacent comment serves an
older MSRV. `#[allow(dead_code)]` on an item that nothing inside its visibility
uses is not a constraint to explain: recommend removing the item together with
the suppression. Keep one whose user sits under another target, feature or
`cfg` branch, and say which.

An `expect` message, an `assert!` message and an `unreachable!` argument are
where code records why a state cannot occur. Std's convention phrases the
expectation: "port should have been validated by `Config::load`" names the
guarantee a maintainer must keep, where "failed to parse port" restates the
failure. Recommend the reason when the invariant is established elsewhere and
nothing nearby names it; a longer justification belongs in a comment above the
call. Where the adjacent code already makes the reason plain, a bare `unwrap`
needs no ceremony. An `unsafe` block without a `// SAFETY:` comment leaves its
obligation unrecorded in the same way: recommend recording what the author
relied on, without judging whether it holds. Commented-out code, and a `todo!()`
or `unimplemented!()` on a reachable path, record an intention without its
condition: recommend deleting the former and naming the decision the latter
waits for.

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
