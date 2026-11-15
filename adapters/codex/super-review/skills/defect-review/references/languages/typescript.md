# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code says what it does

JSDoc comments (`@throws`, `@param`, `@returns`), exported types and
discriminated unions, runtime schemas (Zod, Valibot, ArkType, JSON Schema),
HTTP/RPC route contracts, React component prop types, HTML form/input and ARIA
contracts, URL/storage/query-key shapes, custom `Error` subclasses and `code`
fields, and units in property or parameter names.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source,
`tsconfig.json`, `package.json`, or the resolved dependency version rather than
memory.

- **Types erase at runtime**: `JSON.parse`, `Response.json()`, env vars, URL
  params, `localStorage`/`sessionStorage`, `FormData`, `MessageEvent.data`, DB
  rows, `any`, and `as T` casts perform zero runtime validation. Check
  `tsconfig.json` (`strict`, `strictNullChecks`, `noUncheckedIndexedAccess`):
  without `noUncheckedIndexedAccess`, `arr[i]` and `record[k]` typecheck as `T`
  while yielding `undefined` at runtime.
- **Event target drift**: on DOM events, `e.target` is the deepest clicked child
  (such as a nested `<svg>` or `<span>`), whereas `e.currentTarget` is the
  element carrying the listener.
- **Nullish, falsy, and HTML input coercion**: `x || fallback` clobbers `0`,
  `""`, `false`, and `NaN`, while `x ?? fallback` replaces only `null` and
  `undefined`; `a?.b.c` short-circuits only when `a` is nullish. HTML `<input>`
  values are strings (`""` when cleared): `Number("")`, `Number(" ")`, and
  `z.coerce.number()` evaluate `""` to `0` instead of absence, while
  `input.valueAsNumber` yields `NaN` (`JSON.stringify(NaN)` produces `null`).
  Initializing a React input's `value` as `undefined` and later passing a string
  flips uncontrolled to controlled and breaks form `reset()`.
- **Unchecked fetch and dropped rejections**: an `async` function runs
  synchronously to its first `await`; calling it without `await`, `return`, or
  `.catch`, or inside `Array.prototype.forEach(async ...)`, drops rejections and
  finishes early. `fetch()` resolves normally on HTTP 4xx/5xx (`res.ok` is
  `false`; only network or abort failures reject). `Promise.all` rejects on the
  first failure while sibling promises keep mutating state, and
  `AbortController.abort()` stops work only where `signal` is wired through.
- **Stuck pending state and double submit**: setting `isSubmitting`/`isLoading`
  before an early `return` or throwing `await` without `try`/`finally` wedges UI
  controls permanently, and an async submit handler without an in-flight guard
  fires duplicate mutations before React re-renders.
- **Stale async generation and stale invalidation**: in `useEffect`,
  search/tab/filter handlers, or optimistic mutations without `AbortController`
  or a request-generation guard, a slower prior response or rollback resolves
  after a newer selection and overwrites current state. Mutating server state
  while invalidating a mismatched `queryKey` or `revalidateTag` leaves active
  views stale.
- **In-place mutation and shallow copies**: `.sort()`, `.reverse()`, and
  `.splice()` mutate the receiver (`toSorted`/`toReversed` copy), and `.sort()`
  without a comparator orders numbers lexicographically (`[10, 2]`). Mutating
  React state or query-cache objects in place skips change detection or corrupts
  rollback snapshots; `{ ...obj }` and `[...arr]` copy only the top level.
- **Prototype keys, IEEE-754 bounds, and UTC date strings**: `k in obj` matches
  `Object.prototype` keys (`"toString"`, `"constructor"`) unless `Object.hasOwn`
  or `Object.create(null)` is used. JS numbers lose integer precision above
  `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). `new Date("YYYY-MM-DD")` parses as UTC
  midnight whereas `new Date(y, m, d)` uses local midnight, shifting the
  calendar day in negative UTC offsets.
- **Render-nested components and unstable keys**: declaring a component function
  inside another component's body creates a fresh component type every render,
  unmounting subtree DOM, state, and focus on each update. `key={index}` on
  reorderable, filterable, or deletable stateful rows binds state to position;
  `key={Math.random()}` or `crypto.randomUUID()` during render remounts every
  pass; and rendering a stateful editor (`useState(item.field)`) across changing
  `item` records without `key={item.id}` or an explicit reset carries the prior
  entity's draft onto the next.
- **Stale closures, render-scoped timers, and leaky Effects**: creating
  `debounce`/`throttle` inside render starts an independent timer per render.
  Closures in `useEffect`, timers, or `addEventListener` capture values from one
  render unless dependencies, functional updaters (`setState(prev => ...)`), or
  latest-value refs/`useEffectEvent` refresh them. Effect cleanup must release
  listeners, `ResizeObserver`/`IntersectionObserver`/`MutationObserver`,
  `matchMedia`, sockets/channels, `URL.createObjectURL`, and `document.body`
  scroll/inert locks on dependency re-runs, unmount, and `StrictMode` replay.
- **Form defaults, IME composition, and keyboard reach**: inside `<form>`, a
  `<button>` without `type="button"` defaults to `type="submit"` and submits the
  form. `onKeyDown` handlers acting on `e.key === "Enter"` fire mid-composition
  for IME users unless `!e.nativeEvent.isComposing` (or `!e.isComposing`) is
  checked, and click-only `<div onClick>` controls without button/keyboard
  semantics lock out keyboard activation.
- **Hydration drift and cross-request SSR state**: reading `window`, `document`,
  `localStorage`, `navigator`, `Date.now()`, `Math.random()`, or locale-implicit
  `toLocale*` during initial render of an SSR'd Client Component crashes SSR or
  mismatches hydration, and mutable module-level variables or stores in SSR/RSC
  leak data across concurrent user requests.
- **Browser trust seams, `D -> H` storage, and dynamic utility purge**: Next.js
  Server Actions are public HTTP endpoints requiring their own auth and schema
  checks; `dangerouslySetInnerHTML`, unverified `postMessage` `event.origin`,
  and `javascript:` or `//host` URLs cross browser trust seams; changing
  persisted `localStorage`, URL query, or Zustand `persist` shapes (`D -> H`)
  without migration breaks returning clients; and interpolated Tailwind fragments
  such as `` `bg-${tone}-500` `` are stripped by static source scanning unless
  complete literal classes or safelists exist.

## Dependencies

The version in use is the one `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
or `bun.lock`/`bun.lockb` resolves. Read a dependency's source or `.d.ts` where
it already is on disk under `node_modules/`. Do not install or fetch packages.
When it is not on disk, a step that depends on it is an assumption: name the
package, version and question its source would answer.

## Not a bug in TypeScript

Type-gymnastics or style preferences with no wrong runtime behavior. Skipping
runtime checks on internal calls whose callers in the snapshot already parsed
the value at the trust boundary.
