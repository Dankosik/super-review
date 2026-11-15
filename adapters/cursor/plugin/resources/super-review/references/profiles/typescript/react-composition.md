# React component contracts

Owner: api-clarity
Rule: ts.api.express-the-call

**Self-evident component seams.** Inspect each component or Hook alongside its
callers so callers express intent without internal flag combinations or state
plumbing.

- **Type-erased props**: `any`, `Record<string, any>`, `Control<any>`,
  `ColumnDef<any>`, or `as unknown as T` escapes on component, form, or table
  interfaces -> thread the concrete domain or schema type across the seam.
- **Hidden child protocols**: child-type/index inspection or `cloneElement` prop
  injection that callers must discover by reading the body -> expose named
  slots, explicit props, or a render prop while preserving keys, refs, and event
  merging.
- **Ceremonial memoization**: `useCallback`/`useMemo` wrapping trivial values or
  handlers passed solely to native DOM nodes (`<button>`, `<input>`) with no
  memoized child, Effect dependency, or Context identity consumer (or where
  React Compiler is verified active without an identity escape hatch) -> inline
  the expression directly.
- **Pass-through wrappers**: `forwardRef` boilerplate on a verified React 19
  function-component contract, or a stateless RSC provider wrapper on verified
  React 19.3+ RSC Context support (Context still created in a client module) ->
  simplify only when callers, consumers, and ref cleanup stay identical.

**Keep when:** orthogonal booleans, direct callbacks, shallow prop passing,
documented primitive/Slot adapters, library render props, compatible
`forwardRef`/`Context.Provider` spellings, stateful or domain-named providers,
or load-bearing memoization already state the contract clearly. Preserve
accepted calls, inference, defaults, controlled/uncontrolled ownership, and
event-handler versus value-callback shapes.

Background: [passing props](https://react.dev/learn/passing-props-to-a-component),
[React 19 refs/providers](https://react.dev/blog/2024/12/05/react-19),
[Compiler tradeoffs](https://react.dev/learn/react-compiler/introduction),
[child composition alternatives](https://react.dev/reference/react/cloneElement),
[React 19.3 RSC Context](https://react.dev/blog/2026/09/09/react-19-3).
