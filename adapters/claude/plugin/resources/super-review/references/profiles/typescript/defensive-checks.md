# Defensive checks

Owner: control-flow
Rule: ts.flow.show-main-path

**Settled facts.** Trace each changed guard or fallback back to every path that
produces the value inside the snapshot.

- **Dead guards on checked values**: optional chaining, `??`/`||` defaults,
  `typeof` checks, `Array.isArray`, or optional calls (`onSave?.()`) on values
  and required props whose callers all sit in typed reviewed source -> drop the
  unreachable branch and show the quoted trace that rules the case out.
- **Browser-only SSR guards**: `typeof window === "undefined"` or
  `typeof document === "undefined"` inside `useEffect` callbacks or DOM event
  handlers (`onClick`, `onSubmit`) that only run in a browser -> remove the dead
  branch.
- **Redundant catch or post-parse checks**: `try`/`catch` around code that
  cannot throw, `catch` blocks that only rethrow, `default` arms after an
  exhaustive union `switch`, or validation repeated downstream of a schema parse
  -> parse once at the entry seam ("parse, don't validate", handing any new type
  design to `representation`) and pass the narrowed type forward. (`x || fallback`
  also overrides `0` and `""` whereas `??` preserves them.)

**Keep when:** a guard sits at an unchecked trust seam (`JSON.parse`, `fetch`,
storage, DOM reads, `any`, `as` casts, loose `.d.ts`, `catch` bindings, external
package consumers, `strictNullChecks` off, or index reads without
`noUncheckedIndexedAccess`), `typeof window` guards module-scope or initial SSR
render code, a `default` enforces `never` exhaustiveness or rejects external
inputs, or no complete caller trace exists in the snapshot.
