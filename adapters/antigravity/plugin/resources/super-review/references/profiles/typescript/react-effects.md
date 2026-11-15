# React interaction cohesion

Owner: function-cohesion
Rule: ts.functions.coherent-purpose

**A coherent interaction.** Can a reader distinguish render-time calculation,
a user-triggered operation and synchronization with an external system? Locate
the meaningful computation or interaction currently obscured by unrelated work.
An ordinary event handler may be the clearest complete task. Extract a named
calculation or a custom Hook when it expresses an independently understandable
responsibility, not to meet a component line limit or move JSX into another file.

Custom Hooks should expose domain meaning through their inputs/results, not
hide a collection of unrelated mount/update callbacks. Reuse of stateful logic
does not imply shared state. Keep a straightforward Effect that synchronizes a
widget, subscription or browser API; do not turn a legitimate external lifecycle
into a render calculation. Keep related setup and cleanup understandable together.
The data-flow owner handles duplicated state ownership; this owner handles the
mixing of responsibilities, without suppressing independently useful evidence.

Extraction must preserve Hook placement/order, dependency meaning, closure
captures, event arguments, setup/cleanup and async ordering. Moving work from an
Effect to an event changes when it occurs; establish the intended interaction
from source before accepting that remedy. React 19 Actions may express a coherent
submission but are not a mandatory rewrite of existing handlers or form adapters.
Do not use newer minor-version APIs to silence dependencies, prescribe `useMount`
wrappers, run lint, or turn the pass into Rules-of-Hooks bug hunting.

**Remove an actual adapter obligation.** On a supported React 19.2+ baseline,
consider `useEffectEvent` when a latest-value ref and its synchronization Effect
exist solely to deliver current committed values to an event within another
Effect. Separate the cause of subscription/timer lifetime from that event's work.
Keep genuinely reactive inputs as dependencies. Compare old ref-update timing,
callback capture and cleanup before calling the replacement equivalent; Effect
Events are local to Effects, not general stable callbacks or props for children.
A ref with independent mutable storage or non-Effect callers must not be replaced
on sight. A clear ordinary Effect or domain Hook needs no new API.

For a genuinely browser-only component on a supported React/React DOM 19.3+
renderer, `use(browser())` may replace a mount-flag/Effect gate whose only purpose
is opting out of server rendering. It suspends on the server to the nearest
Suspense fallback. Inspect that boundary and the prior first-render/commit timing;
matching eventual content is insufficient. Retain meaningful server output,
post-commit prerequisites and lifecycle guards. Without a supported, behavior-
preserving remedy, record the gate observation separately rather than recommend
an SSR/fallback change. Neither mechanism is an upgrade or memoization campaign.

Background: [custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks),
[Effect lifecycle](https://react.dev/learn/lifecycle-of-reactive-effects),
[React 19 Actions](https://react.dev/blog/2024/12/05/react-19),
[Effect Events](https://react.dev/reference/react/useEffectEvent),
[browser-only rendering](https://react.dev/reference/react-dom/browser).
