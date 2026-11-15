# Java defensive checks

Owner: control-flow
Rule: java.flow.show-main-path

**Settled facts.** Read each changed guard with the origin of the value it tests.
Does it check a case the code has already ruled out? Such as a null check on a
`final` field the constructor already checked (the constructor's own
`requireNonNull` is the check, not noise), `requireNonNull` on a private
method's parameter every caller has checked, `isPresent` then `get` on an
`Optional` that cannot be empty, a `catch` for an exception nothing in the `try`
can throw, a `catch` that only rethrows with no broader `catch` after it, or a
`default` in a `switch` expression that already covers every constant or
subtype, which also turns off the compiler's check for a new one. Each guard
tells the reader the case can happen, sends them looking for where, and adds a
branch to the main path.

This profile traces whether a guard's case can occur, which control-flow
otherwise leaves alone. A candidate needs the guarantee traced through quoted
lines, from where the fact is established (a constructor, a final field's
initializer, an earlier check, a framework guarantee whose configuration is in
the snapshot, a documented contract) to the guard, along every path inside the
visibility. Without that trace there is no candidate: the guard is doing its
job.

Two traps. `@Valid` or `@Validated` does not by itself mean the value is valid:
Spring rejects an invalid command object only when no `Errors` or
`BindingResult` follows it, not for a `Map` or `Collection`, and only for the
validation groups that ran. Fields set by reflection, such as JPA entities and
Jackson targets, can be null whatever the constructor does.

Keep guards at trust boundaries: controller and message inputs, deserialized
objects, values read from the database or configuration, and `public` methods of
a library that callers outside the snapshot reach; a `requireNonNull` there is a
fail-fast decision. Keep an always-on check that names a violated invariant; an
`assert` statement is not one, because it is usually disabled. Removing a
`default` that throws changes which exception a constant added without
recompiling produces; name that effect.

The opposite shape also belongs here: one check repeated in several methods that
receive the same value. Check once where the value enters and pass on something
that holds the fact, so downstream code drops its checks. A new type that carries
the fact is the representation lens's remedy ("parse, don't validate"); name it
and leave its design there.

Show the guard that disappears, the trace that makes it unreachable, and what the
main path looks like without it.
