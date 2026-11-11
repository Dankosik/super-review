# Rust defensive checks

Owner: control-flow
Rule: rust.flow.show-main-path

**Settled facts.** Read each changed guard with the origin of the value it tests.
Does it check a case the types or the code have already ruled out? Such as an
`is_empty` check before an iteration that does nothing on empty input, a bounds
check before `get`, an `unwrap_or_default` on an `Option` the code always
fills, a match arm for an error that a function in the snapshot never returns,
or validation repeated on a value whose type was constructed by validating it.
Each guard tells the reader the case can happen, sends them looking for where,
and adds a branch to the main path.

In Rust such a guard often means a value travels as a looser type than it is: a
`String` that is always a valid identifier, an `Option` that is always `Some`
after initialization. Name that gap; the type that would carry the fact is the
representation lens's remedy ("parse, don't validate").

This profile traces whether a guard's case can occur, which control-flow
otherwise leaves alone. A candidate needs the guarantee traced through quoted
lines, from where the fact is established to the guard, along every path inside
the visibility, including `cfg` branches and features. Without that trace there
is no candidate: the guard is doing its job. An arm for another
crate's error type is a compatibility choice. Keep guards at trust boundaries:
deserialized input, arguments, FFI, `unsafe` preconditions and public functions
that callers outside the snapshot reach. Keep assertions, `expect` and
`unreachable!` that state an invariant; their message is the rationale lens's
concern.

The opposite shape also belongs here: one check repeated in several functions
that receive the same value. Check once where the value enters and pass on a
type that holds the fact, so downstream code drops its checks.

Show the guard that disappears, the trace that makes it unreachable, and what
the main path looks like without it. Do not trade a removed guard for an
`unwrap` whose reason nothing nearby states.
