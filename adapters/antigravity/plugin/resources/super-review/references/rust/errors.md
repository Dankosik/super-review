# thiserror and anyhow inside existing Rust questions

Use only for an implicated error type, conversion or context chain and the
assigned owner under [Rust context](../languages/rust.md). This is not a
separate profile or a requirement to adopt either crate. Resolve the declared
versions and features before relying on an attribute or macro.

## control-flow with error-expression

Does handwritten error plumbing say anything the declared crate would not? With
thiserror already a dependency, a manual `Display`, `Error` and `From` triple
that only formats fields and forwards a source repeats what `#[error("..")]`,
`#[source]` and `#[from]` state beside the variant. Keep a manual impl that
redacts, localizes or computes its message.

`#[from]` both converts and marks the source, so `?` needs no `map_err`. It
suits a conversion that needs no call-site context. Two variants cannot take
`#[from]` the same type, and `#[from]` on a broad type such as `io::Error` lets
every `?` in the crate land on one variant whatever the operation was. Where a
caller or a report needs to know which file or request failed, a `map_err` or a
variant with fields carries it. `#[error(transparent)]` forwards message and
source to the wrapped error and adds none of its own: it fits a pure wrapper.
A message that interpolates the field it also marks as its source prints the
cause twice in a chained report.

With anyhow, `.context("..")` and `.with_context(|| ..)` add the operation and
its subject without erasing the cause, and `with_context` builds the message
only on failure. `map_err(|e| anyhow!("..: {e}"))` flattens the cause into text
and drops its type. `bail!` and `ensure!` state an early failure exit in one
line. Recovery that depends on the kind of failure needs a typed error or
`downcast_ref`, never the rendered text.

## api-clarity

Which failures does a caller have to tell apart? A library whose public
functions return `anyhow::Error` leaves its callers only `downcast` to branch
on, and puts anyhow in its public API. An
application boundary that only reports can use it and avoid variants nobody
consumes. A typed enum inside a binary earns its matching only where some
caller branches on it. Converting between the two at one boundary reads more
clearly than mixing both through a call chain.

Do not prescribe either crate, a migration between them or a new dependency.
Compare what the declared one already offers, and preserve error types,
sources and downcasting that existing consumers use.

Sources: [thiserror](https://docs.rs/thiserror/latest/thiserror/),
[anyhow](https://docs.rs/anyhow/latest/anyhow/),
[Context](https://docs.rs/anyhow/latest/anyhow/trait.Context.html),
and [Error](https://doc.rust-lang.org/std/error/trait.Error.html).
