# React state transitions

Owner: representation
Rule: ts.representation.express-concepts

**Named transitions.** Read initialization, every writer, and the rendered
branches together so one interaction lifecycle has one representation.

- **Boolean status soup**: correlated flags (`isLoading`, `isError`, `isSuccess`,
  `hasData`), optional payloads, or multi-setter updates that force JSX to guard
  contradictory states -> collapse into a discriminated status union or an
  event-named reducer (`draftConfirmed`), and name which coordinated edits
  disappear. Counting `useState` calls alone proves nothing.
- **Raw form leakage**: conflating raw HTML input strings (`""` while editing)
  with parsed domain payloads (`number | null`) across downstream consumers ->
  decode once at the submission or schema seam so domain callers receive the
  parsed type.

**Keep when:** selections, drafts, and visibility toggles vary independently, or
a proposed union/reducer would merely rename per-field setters or forbid
combinations callers currently rely on. Preserve updater order, functional
updates, lazy init, `key`/reset lifetime, committed versus optimistic meaning,
and observable intermediate states, keeping I/O outside pure reducers. Leave
remedies unresolved when external state consumers are outside visibility. State
ownership belongs to `data-flow`; hand cross-owner signals back to the parent.

Background: [reducers](https://react.dev/learn/extracting-state-logic-into-a-reducer)
and [state structure](https://react.dev/learn/choosing-the-state-structure).
