# Function cohesion

## go.functions.extract-for-clarity

**Cohesion.** Read the function, its immediate helpers, and their calls as one
operation. Extract when a helper names an independently meaningful responsibility,
centralizes shared knowledge, or hides a level of detail the caller need not
understand. Judge the resulting call and remaining body together.

A helper earns its place when readers can use its contract without immediately
opening it. Account for parameters, returned bookkeeping, and hidden effects;
moving the same mental work behind a call is not decomposition. Neither function
length nor a separate verb justifies extraction.

## go.functions.coherent-purpose

A handler may coherently read, validate, act, and render. Keep such a sequence
together when it tells one story. Conversely, inline or regroup fragmentary
helpers when they force readers to reconstruct that sequence across declarations
without hiding useful knowledge. Keep even a one-line helper when it names a
real concept or owns a meaningful boundary.

In Go, a helper also creates a new defer boundary. Do not move cleanup, a lock's
scope, or named-result updates across that boundary merely to separate steps.
A closure may deliberately retain local state; compare that purpose with explicit
inputs rather than extracting captured variables into bookkeeping parameters.

Compare keeping, extracting, and inlining only where the observed burden warrants
it. Preserve contracts, needed values, resource lifetime, and effect ordering.
Do not invent a service or interface to shorten a function. This lens owns local
cohesion, not a replacement package architecture.
