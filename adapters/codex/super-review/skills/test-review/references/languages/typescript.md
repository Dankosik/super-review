# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Tests in
another language are listed as excluded.

## Where tests live

- Unit, component and integration files (`*.test.ts`, `*.test.tsx`, `*.spec.ts`,
  `__tests__/**`) configured in Vitest, Jest, Node's test runner or Playwright.
- Excluded or muted tests: `.skip`, `.todo`, `xit`/`xdescribe`, `test.fixme`,
  files filtered out by `include`/`exclude` in `vitest.config.*` or
  `jest.config.*`, and `retry` counts in test-runner configs that hide flakes.

## Choosing a mutant

Under `tsc` / typechecked test runs, a mutant that breaks parameter types or
leaves unused locals under `noUnusedLocals` is caught by the compiler, not the
tests. Note however that Vitest/esbuild/SWC often transpile tests without
running `tsc`, so runtime validation boundaries (`Zod`, `JSON.parse`, route
inputs) still rely on tests even when TypeScript types look strict.

Forms a plausible TypeScript mistake takes:

- `<` for `<=`, `||` for `??` (clobbering `0`, `""` or `false`), strict vs loose
  missing-key handling.
- Dropping `await` on an async effect, replacing `Promise.all` error handling
  with a silent `.catch(() => undefined)`, or dropping `{ signal }` propagation.
- Mutating an input array via `.sort()`/`.splice()` instead of copying, or
  omitting comparator `(a, b) => a - b` on numeric sort.
- Returning early on a fallback (`if (!item) return;`) instead of throwing or
  surfacing the promised error status/code.
- Omitting a filter/tenant/locale parameter from a query key, cache key or
  `useEffect` dependency list, or skipping schema parsing on a Server Action /
  route input.

## Writing a witness

Write the witness in the suite's own runner (`vitest`, `jest`, `node:test`,
 Testing Library, Playwright) using its existing fixtures and HTTP/boundary
doubles (such as MSW or local handlers) rather than spying on internal module
functions. Use fake timers (`vi.useFakeTimers()`) for scheduled work, `await`
every async assertion (`await expect(p).rejects.toThrow(...)` — an unawaited
`expect(p).rejects` passes before `p` settles!), and assert rendered/returned
outcomes rather than mock call choreography.

## Reading a test for stability

Unawaited promises (`expect(...).rejects` without `await`, `forEach(async ...)`),
real `setTimeout` sleeps, shared module-level state or unreset mocks/MSW
handlers between tests, `Date.now()` / local timezone formatting without a
fixed clock/locale, `Math.random()`, and fixed TCP ports cause flaky or
false-green runs.

## Dependencies

The version in use is resolved by `package-lock.json`, `pnpm-lock.yaml`,
`yarn.lock` or `bun.lock`/`bun.lockb`. Read dependency source on disk under
`node_modules/` without installing or fetching packages; when absent, record the
assumption.

## Not a finding in TypeScript

Type-only properties already rejected by `tsc` when CI runs typechecking.
Snapshot style preferences when assertions still fail on broken behavior.
