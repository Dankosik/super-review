# Application report

Applied A1 and A2 to the private decoder representation and its existing methods.
`Phase` now names the effective decoder state, replacing the count, pending run,
and terminal flags. `remaining_capacity` replaces the maximum and cumulative
reservation; accepting a complete pair subtracts its entire run before emission.

The transformation retains terminal-error precedence, zero-budget behavior,
partial-pair retention, consumed counts, and immediate stopping at the output
budget. `finish` still emits nothing. Error definitions and formatting, Encoder,
Decoded, public signatures, and dependencies were left unchanged.

No compilation, formatting command, tests, builds, or program execution were
performed, and no tests were authored, as required by the code-only scope.
Compilation, behavioral equivalence, and runtime resource bounds remain
unverified; this report does not claim delivery acceptance.
