# React interaction cohesion

Owner: function-cohesion
Rule: ts.functions.coherent-purpose

**Separated render, event, and external sync.** Each unit should do one job:
compute during render, handle a user action in an event/Action handler, or
synchronize with an external system in an Effect.

- **Flag-driven Effect chains**: setting command state (`shouldSave`,
  `submittedPayload`) only so a `useEffect` runs user-initiated work and chains
  further setters -> run the operation directly in the originating event or
  Action handler unless post-commit DOM state is required.
- **Render-nested components**: declaring a child component function inside
  another component's body, hiding closure captures and recreating its type per
  render -> hoist to module scope with explicit props.
- **Tangled workflows**: one component or custom Hook mixing unrelated UI flows
  (filters, table selection, edit drawer, delete dialog) or unrelated mount
  callbacks -> extract a subcomponent, pure calculation, or domain-named Hook
  whose inputs and return value state one responsibility.
- **Latest-value ref plumbing** (when `useEffectEvent` is supported by resolved
  React runtime/types): a ref plus sync Effect written solely so another Effect
  reads fresh committed values without re-subscribing -> replace with
  `useEffectEvent` inside that Effect, keeping genuinely reactive subscription
  inputs in dependencies.
- **Client-only mount gates** (when `use(browser())` is supported by resolved
  React/React DOM and the renderer): a mounted-flag Effect whose sole job is
  skipping SSR -> consider `use(browser())` only when the nearest `<Suspense>`
  fallback and first-commit timing match; defer when timing differs.

**Keep when:** an Effect synchronizes a real widget, observer, timer, or
browser subscription with colocated cleanup; moving work to an event would drop
an intended mount run or post-commit DOM read; a ref has non-Effect readers or
independent mutable storage; or server output before hydration carries meaning.
Preserve Hook order, closure captures, cleanup symmetry, and existing form or
handler conventions; leave duplicated state ownership to `data-flow`.

Background: [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks),
[Effect lifecycle](https://react.dev/learn/lifecycle-of-reactive-effects),
[React 19 Actions](https://react.dev/blog/2024/12/05/react-19),
[Effect Events](https://react.dev/reference/react/useEffectEvent),
[browser-only rendering](https://react.dev/reference/react-dom/browser).
