# Abstractions

## go.abstractions.earn-the-boundary

**Load-bearing boundaries.** Test each interface, struct wrapper, generic
parameter, and helper layer against the direct concrete call. Ask what policy,
variation, representation, or dependency knowledge the boundary removes from
callers versus the concepts and hops it adds. A deep boundary hides decisions
behind a small contract; a shallow one forwards the same knowledge through
another layer as a Middle Man.

Check whether each seam is real. A producer-mirroring interface whose only
other implementation is an internal test double is a hypothetical seam that
charges production readers for a boundary the program does not vary. Look first
for a concrete type, a plain function parameter for one operation, a narrow
consumer-side interface, or a standard capability such as `io.Reader`. Flag
pass-through wrapper types, single-use cleanup or action structs that a plain
function, `defer`, or `context.AfterFunc` expresses inline, options or mode
fields given the same value by every caller, and type parameters used where an
interface or concrete type states the contract directly, or custom mechanics
that duplicate a supported library operation.

**Keep when:** the boundary owns units, adaptation, error translation, retries,
domain meaning, or lifetime across callers; explicit forwarding intentionally
restricts a method set (embedding promotes methods and exposed fields rather
than merely shortening delegation); generics preserve a typed result or caller
relationship without erasing types or forcing artificial frameworks onto
dynamic reflection; or a factory contract or exported signature serves external
consumers. Inspect real callers, interface uses, and exposed fields, show what
knowledge callers drop, and preserve the observable contract.
