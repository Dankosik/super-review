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

Under `tsc` or typechecked test runs, a mutant that breaks parameter types or
leaves unused locals under `noUnusedLocals` fails compilation before tests run.
Vitest, esbuild, and SWC often transpile tests without `tsc`, so runtime seams
(`Zod`, `JSON.parse`, route/action inputs) still rely on tests even when types
look strict.

Forms a plausible TypeScript mistake takes:

- **Nullish and input coercion**: `<` for `<=`, `||` for `??` (clobbering `0`,
  `""`, or `false`), `Number("")` or `z.coerce.number()` turning cleared HTML
  input `""` into `0`, or loose missing-key handling.
- **Dropped async failure or race**: dropping `await`, treating HTTP 4xx/5xx
  `fetch()` as success by omitting `res.ok`, skipping `finally` cleanup of
  `isSubmitting`, swallowing rejections with `.catch(() => undefined)`, or
  dropping `{ signal }` / stale-response guards across rapid query switches.
- **In-place mutation and lexicographic sort**: mutating inputs or cached
  arrays via `.sort()`/`.splice()` instead of copying, or omitting
  `(a, b) => a - b` on numeric sort.
- **Silent fallback or implicit form submit**: returning early (`if (!item) return`)
  instead of surfacing the promised error status/code, or omitting
  `type="button"` on a non-submit `<button>` inside `<form>`.
- **Missing key, stale cache, or broken persisted schema**: omitting a
  filter/tenant/locale from `queryKey` or `useEffect` dependencies, omitting
  entity `key` across record switches, breaking prior-revision (`D`)
  `localStorage`/URL/Zustand `persist` payloads, or skipping schema parsing at
  a Server Action or route seam.

## Writing a witness

Test at real **seams** in the suite's own runner (`vitest`, `jest`,
`node:test`, Testing Library, Playwright) using existing fixtures and boundary
doubles (MSW, fake storage, local handlers). Replace **hollow mocks**
(`vi.mock('./ChildDialog')`, `vi.mock('@tanstack/react-query')`) that sever
prop, `queryKey`, form-serialization, and error contracts. Drive scheduled work
with `vi.useFakeTimers()`, `await` every async interaction and rejection
(`await user.click(...)`, `await expect(p).rejects.toThrow(...)`, since an
unawaited `rejects` passes before `p` settles), and assert accessible behavioral
state (`toBeDisabled()`, payload sent, alert role) rather than mock call counts
or **cosmetic tokens** (`opacity-50`).

## Reading a test for stability

- **Unawaited async work**: `expect(...).rejects` without `await`,
  `forEach(async ...)`, or unawaited `@testing-library/user-event` calls
  (`user.click`, `user.type`).
- **Synchronous race against async UI**: `screen.getBy*` immediately after an
  async transition instead of `await screen.findBy*`, or **premature negative
  checks** (`expect(await page.locator(...).isVisible()).toBe(false)`,
  immediate `expect(screen.queryByRole('alert')).toBeNull()`) evaluated before
  the pending request settles.
- **Wall-clock and shared-environment leaks**: real `setTimeout` or
  `waitForTimeout` sleeps, shared module state, uncleaned
  `localStorage`/`window.location`/DOM portals or MSW handlers across tests,
  unpinned `Date.now()`/timezone/locale, unseeded `Math.random()`, and fixed
  TCP ports.

## Dependencies

The version in use is resolved by `package-lock.json`, `pnpm-lock.yaml`,
`yarn.lock` or `bun.lock`/`bun.lockb`. Read dependency source on disk under
`node_modules/` without installing or fetching packages; when absent, record the
assumption.

## Not a finding in TypeScript

Type-only properties already rejected by `tsc` when CI runs typechecking.
Snapshot style preferences when assertions still fail on broken behavior.
