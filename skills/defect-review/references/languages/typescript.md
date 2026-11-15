# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code says what it does

JSDoc comments (`@throws`, `@param`, `@returns`), exported types and
discriminated unions, runtime schemas (Zod, Valibot, ArkType, JSON Schema),
HTTP/RPC route contracts, React component prop types, custom `Error` subclasses
and `code` fields, and units in property or parameter names.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source,
`tsconfig.json`, `package.json` or the resolved dependency version, not from
memory.

- **Types erase at runtime.** `JSON.parse`, `Response.json()`, environment
  variables, URL params, database rows, `MessageEvent.data`, `any`, and `as T`
  casts perform zero runtime validation. Check `tsconfig.json` (`strict`,
  `strictNullChecks`, `noUncheckedIndexedAccess`): without
  `noUncheckedIndexedAccess`, `arr[i]` and `record[k]` are typed as `T` even
  when runtime reads yield `undefined`.
- **Nullish versus falsy.** `x || fallback` replaces `0`, `""`, `false` and
  `NaN` as well as `null` and `undefined`; `x ?? fallback` replaces only `null`
  and `undefined`. Optional chaining `a?.b.c` short-circuits `b.c` only when `a`
  is nullish, returning `undefined`.
- **Async execution and promises.** An `async` function runs synchronously up
  to its first `await`. Calling an `async` function without `await`, `return`,
  or `.catch` drops rejections into unhandled-rejection handlers and lets the
  caller finish before effects complete. `Array.prototype.forEach(async ...)`
  ignores returned promises. `Promise.all` rejects on the first rejection while
  sibling promises keep running and mutating state; `AbortController.abort()`
  cancels work only if every downstream step wires `signal`.
- **In-place mutation and aliasing.** `Array.prototype.sort`, `reverse` and
  `splice` mutate the receiver in place (`toSorted`/`toReversed` copy); numeric
  values in `sort()` without a comparator are sorted lexicographically as
  strings (`[10, 2].sort()` -> `[10, 2]`). Spread `{ ...obj }` and `[...arr]`
  copy only the top level.
- **Object keys and numbers.** `k in obj` matches `Object.prototype` keys such
  as `"toString"` and `"constructor"` unless `Object.create(null)` or
  `Object.hasOwn` is used. `Number(" ")` and `Number("")` evaluate to `0`, not
  `NaN`. JS numbers are IEEE-754 doubles (`Number.MAX_SAFE_INTEGER` is
  `2^53 - 1`).
- **UI and full-stack boundaries.** In React, closures inside `useEffect`,
  timers or event handlers read state from the render that created them unless
  refreshed; Next.js Server Actions are reachable HTTP endpoints that require
  their own authentication and input validation regardless of client UI guards.

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
