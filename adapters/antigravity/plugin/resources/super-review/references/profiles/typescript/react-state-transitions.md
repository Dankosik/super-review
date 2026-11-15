# React state transitions

Owner: representation
Rule: ts.representation.express-concepts

**An action with a name.** Do readers reconstruct one existing interaction from
correlated flags, optional payloads or coordinated setters scattered across
handlers? Read initialization, every writer and the rendered alternatives. A
named state shape or an event-oriented reducer can expose the relationship and
give an existing transition one owner. Explain which repeated interpretation or
coordinated edit disappears; counting `useState` calls is not evidence.

Keep independent selections, drafts and visibility controls independent. A reducer
that only renames setters, a generic dispatch protocol, or a union that forbids
currently accepted combinations adds obligations rather than meaning. Prefer
actual interaction names such as `draftConfirmed` over one action per field only
when the interaction really governs those fields. Neither reducers nor state
machines are mandatory dependencies or architecture.

Preserve updater ordering, queued/functional update semantics, lazy initialization,
reset/key lifetime, committed versus optimistic meaning and existing observable
intermediate states. Keep I/O and user interactions outside a pure reducer. Do not
invent valid/invalid domain states or add exhaustive guards to hunt bugs. If
external state owners or consumers are unavailable, separate the supported
representation observation from the unresolved remedy.

This profile deepens the conditional representation lens; it does not replace the
data-flow question about who owns each value. Report new cross-owner signals to
the parent rather than performing a second lens in this task.

Background: [reducers](https://react.dev/learn/extracting-state-logic-into-a-reducer)
and [state structure](https://react.dev/learn/choosing-the-state-structure).
