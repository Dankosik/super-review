# React state ownership

Owner: data-flow
Rule: ts.data.make-transformations-visible

**Source of truth.** Can a reader trace a displayed value to its owner without
following synchronization between equivalent copies? Distinguish props, local UI
state, editable drafts, URL state, external stores, server/query data and pending
or optimistic overlays. Show the actual reads and writes that make a value's
meaning difficult to follow. Derivation during render can clarify a value that
has no independent lifecycle; a custom Hook or global store is not inherently
clearer. Keep intentional snapshots, debounced values and unsaved drafts rather
than equating them with their latest input.

Inspect initialization, update paths and consumers before proposing a new owner.
Moving a value across components, replacing reset logic with a key, or changing
controlled/default state can alter state lifetime and intermediate UI. Preserve
those contracts or leave the remedy unresolved. A shorter Effect chain is not
proof of equivalent behavior. Preserve subscription and ref ownership; do not
replace an external-store adapter just to remove an Effect.

For React 19 Actions, `useActionState` and `useOptimistic`, separate committed data
from action results, pending state and temporary presentation. Recommend a clearer
owner or named transformation only for an observed reading burden. Do not replace
an existing form/query library, add Actions to every handler, or invent optimistic
behavior. Hook dependency bugs, race conditions, render counts and performance
speculation are not findings for this profile.

Background: [state structure](https://react.dev/learn/choosing-the-state-structure),
[Effects versus derivation](https://react.dev/learn/you-might-not-need-an-effect),
[Action state](https://react.dev/reference/react/useActionState),
[optimistic state](https://react.dev/reference/react/useOptimistic).
