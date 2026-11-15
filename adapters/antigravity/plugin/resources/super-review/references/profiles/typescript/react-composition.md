# React component contracts

Owner: api-clarity
Rule: ts.api.express-the-call

**Readable composition.** Can callers express what a component does without
knowing its internal flag combinations, prop translation or state plumbing?
Inspect the component/Hook and its actual callers. Favor meaningful values and
events, children/slots or a named mode when they clarify an existing contract.
A few orthogonal booleans, a direct callback, explicit props through a shallow
tree, or a concrete component can already be clearer than context, a render-prop
protocol or a generic polymorphic factory. Do not invent future variants.

A proposed props shape must preserve accepted calls, inference, defaults,
controlled/uncontrolled ownership and the distinction between event handlers and
value callbacks. Do not erase primitive props with `any`, broad assertions or
unnecessary wrappers. Separate a specific reading problem from TypeScript syntax
preferences. A discriminated union is useful for actual meaningful alternatives,
not an excuse to redesign every component API.

For React 19 function components, `ref` as a prop can simplify an involved local
contract only where the supported runtime/types and consumers allow it. Retain
`forwardRef` or `Context.Provider` when compatible and clear; their older spelling
alone is not a finding. Preserve ref targets and cleanup, component identity,
keys, DOM/event semantics and provider ancestry. React Compiler is a configured
build tool, not an automatic consequence of React 19; do not add or remove
`memo`, `useMemo` or `useCallback` as a style campaign, even when it is enabled.

**Visible child roles.** Inspect component-type/position checks and `cloneElement`
prop injection when callers must know a hidden children protocol. Named slots,
explicit data or a render prop can expose that existing contract. Compare actual
uses and accepted children; preserve keys, refs, prop/event merging and ordering.
Keep a purposeful primitive/Slot adapter that implements a documented composition
contract. Do not ban cloning or replace one explicit API with a compound-component
factory merely for a pattern name. Library render props are not inherently opaque.

On a supported React 19.3 RSC integration, a Server Component can render Context
exported by a client module directly. Consider eliminating a provider wrapper
only when its API adds unexplained forwarding and no state, adaptation or useful
meaning. Context creation remains in the client module. Keep stateful providers,
consumer compatibility and wrappers naming a genuine domain boundary. Check the
actual renderer and consumers, not React's package version alone; no relocation
of state or mandatory removal of provider components follows from this feature.

Background: [passing props](https://react.dev/learn/passing-props-to-a-component),
[React 19 refs/providers](https://react.dev/blog/2024/12/05/react-19),
[Compiler tradeoffs](https://react.dev/learn/react-compiler/introduction),
[child composition alternatives](https://react.dev/reference/react/cloneElement),
[React 19.3 RSC Context](https://react.dev/blog/2026/09/09/react-19-3).
