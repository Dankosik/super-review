# Defensive checks

Owner: control-flow
Rule: go.flow.show-main-path

**Settled facts.** Read each changed guard with the origin of the value it tests.
Does it check a case the code has already ruled out? Such as a nil check on a
result whose constructor never returns nil, a length check before a `range`, a
fallback for a map key a preceding loop guaranteed, or validation repeated after
the value was parsed into a type that holds the fact. Each guard tells the reader
the case can happen, sends them looking for where, and adds a branch to the main
path. Go's zero values already cover much of what defensive code re-checks (the
spec's nil slice and map semantics, `errors.Is` and `errors.As` on a nil error).

This profile traces whether a guard's case can occur, which control-flow
otherwise leaves alone. A candidate needs the guarantee traced through quoted
lines, from where the fact is established (a constructor, an earlier check, a
parse step, a type or a documented contract) to the guard, along every path
inside the visibility. Without that trace there is no candidate: the guard is
doing its job.

Some Go checks look redundant and are not: an interface holding a typed nil
pointer is not nil, and a method can deliberately support a nil receiver. Keep
guards at trust boundaries: values from requests, files, the environment, the
network, other processes, or exported functions that callers outside the
snapshot reach. Keep a panic or check that names a violated invariant; it records
a fact rather than pretending a case is possible.

The opposite shape also belongs here: one check repeated in several functions
that receive the same value. Check once where the value enters and pass on
something that holds the fact, so downstream code drops its checks. A new type
that carries the fact is the representation lens's remedy ("parse, don't
validate"); name it and leave its design there.

Show the guard that disappears, the trace that makes it unreachable, and what the
main path looks like without it.
