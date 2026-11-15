# React state ownership

Owner: data-flow
Rule: ts.data.make-transformations-visible

**Single source of truth.** Every displayed value should trace to one clear
owner: props, local UI state, editable drafts, URL/router state, client stores,
query caches, or optimistic overlays.

- **Cache mirroring**: `useEffect` copying query-cache, loader, or prop data
  into `useState` or a client store without an independent draft lifecycle ->
  derive the value during render from its owner.
- **Misplaced state scope**: single-component UI toggles pushed into a global
  store, or shareable route filters held in local `useState` beside URL-owned
  controls -> move ownership to the component or URL seam that governs its
  lifetime.
- **Action versus committed state**: on React 19 Actions (`useActionState`,
  `useOptimistic`), mixing committed server data with pending or temporary
  action state -> separate committed state, action outcome, and optimistic
  presentation.

**Keep when:** an intentional snapshot, debounced input, cross-tree shared
state, external-store subscription adapter, or unsaved user draft has its own
lifecycle, or the project's established form/query library already owns the
flow. Moving state across components, swapping reset logic for a `key`, or
switching controlled and default props alters lifetime and intermediate UI:
verify initialization, writers, and consumers before proposing a new owner, or
leave the remedy unresolved. Hook dependency bugs, races, and render counts
stay outside this profile.

Background: [state structure](https://react.dev/learn/choosing-the-state-structure),
[Effects versus derivation](https://react.dev/learn/you-might-not-need-an-effect),
[Action state](https://react.dev/reference/react/useActionState),
[optimistic state](https://react.dev/reference/react/useOptimistic).
