# Rust API clarity

## rust.api.express-the-call

**Call contracts.** Read declarations and representative calls together. Can
callers understand units, alternatives, absence, failure, ownership and sequencing
without reconstructing the body? Identify implicit knowledge and show a concrete
before/after call or compatible clarification.

`Option`, `Result`, a domain enum or an existing value type may clarify a hidden
protocol. A clear boolean does not automatically need a wrapper or builder.
Borrowed views such as `&str` or `&[T]` fit access-only work; owned inputs can
express storing, consuming or transferring data. Do not generalize every argument
to `AsRef` or `IntoIterator` without an actual gain.

Standard conversion traits can make a conversion recognizable: `From` requires
infallible work; fallible conversion can use `TryFrom`. Implementations are public
commitments, not cosmetic wrappers. Inspect consumers, inference, function values
and relevant impls before changing signatures. Missing downstream context limits
the remedy; it does not establish that a breaking change is harmless.
