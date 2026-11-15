# Lifecycle ownership

Owner: data-flow
Rule: go.data.make-transformations-visible

**Lifetime.** Trace creation, use, ownership transfer, and completion of the changed
resource or background operation. Can readers identify who owns each phase without
assembling a hidden protocol across unrelated callbacks or objects?

Prefer a visible operation or bringing related ownership steps together. Keep
simple acquisition with nearby `defer`; defer runs at the enclosing function's
return, not at the end of a block or loop iteration. Extraction can change that
lifetime. Check argument evaluation and closure captures only where the proposed
transformation moves them; do not turn this into a scan for unsafe defers.

For concurrent work, make the existing start, cancellation, completion, and channel
ownership understandable. A synchronous operation can be simpler when concurrency
belongs to the caller, but changing return timing, streaming, buffering, or joining
is not a stylistic rewrite. Preserve legitimate asynchronous APIs. Choose neither
channels nor mutexes by slogan; explicit ownership matters more than the primitive.

Respect request context propagation and resource ownership across calls. A context
parameter can make a request's lifetime explicit, but fixed interface signatures
and existing lifecycle contracts can justify adapters. Do not introduce a lifecycle
framework, replace contexts, or add goroutines to make code look idiomatic.

Show which responsibility becomes local and what extra state or coupling the
proposal introduces. Preserve timing and cleanup contracts. Do not search for
leaks, races, missing closes, or missing joins. Apply the owner's effective team
rule; this profile cannot bypass its disable, replacement, or conflict.
