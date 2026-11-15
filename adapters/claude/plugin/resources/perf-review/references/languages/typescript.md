# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code states its cost

JSDoc complexity or batching notes, benchmark scripts (`*.bench.ts`), committed
CPU/heap profiles or bundle reports, pagination/batch/virtualization limits,
React Compiler settings (`babel-plugin-react-compiler` / `reactCompiler` in
`next.config.*` or Vite/Babel configs), and target runtime/compiler settings in
`package.json` and `tsconfig.json`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation, or the resolved dependency version rather than memory.

- **Quadratic spread and linear inner scans**: `[...acc, item]` or
  `{ ...acc, [k]: v }` inside `.reduce()` or a loop copies every prior element
  per step (`O(N^2)`); mutate a local collection inside the function for
  `O(N)`. Calling `.includes()` or `.find()` inside a loop or per-row `.map()`
  over `M` items scans `O(N * M)` where a `Set` or `Map` answers in `O(1)` per
  lookup; `Array.prototype.shift()` moves every remaining element (`O(N)`).
- **Main-thread blocking and sequential waterfalls**: `*Sync` I/O, crypto, or
  compression calls and large synchronous `JSON.parse`/`JSON.stringify` stall
  server event loops or browser input frames. `for (const x of items) await fetchOne(x)`,
  sequential independent `await` statements in route loaders, Server Components,
  or Effects, and `await` placed before a branch or `<Suspense>` boundary that
  does not read the result pay serial round trips where `Promise.all`, bounded
  concurrency, or deferred `await` overlaps them.
- **Layout thrashing and non-passive scroll**: interleaving DOM geometry reads
  (`getBoundingClientRect()`, `offsetHeight`, `scrollTop`, `getComputedStyle()`)
  with style or DOM writes inside an `N`-element loop forces `N` synchronous
  browser reflows; batch reads before writes. `wheel`/`touchstart`/`touchmove`
  listeners that never call `preventDefault()` block compositor scrolling
  unless `{ passive: true }` is set.
- **Render-tick multipliers**: check whether React Compiler is active first.
  Without it, inline `O(N)` sort/filter on per-keystroke or hover renders,
  fresh `<Context.Provider value={{ ... }}>` literals across `M` subscribers,
  Zustand/Redux selectors returning fresh `.filter()`/`.map()` arrays without
  shallow equality, or `JSON.stringify` inside render/dependency lists repeat
  `O(N)`/`O(M)` work per state tick.
- **Repeated setup and RSC request reads**: constructing `new RegExp(...)`,
  `new Intl.DateTimeFormat(...)`, `new Intl.NumberFormat(...)`,
  `new TextEncoder()`, or compiling schemas per element or per request repeats
  invariant setup. Identical data reads across a React Server Component tree
  within one request re-run unless wrapped in `React.cache()` or passed down.
- **N+1 queries, RSC over-serialization, and eager client graphs**: ORM/resolver
  queries inside loops issue `N+1` round trips; fetching whole rows/relations
  for one column or count transfers unneeded payloads (`select`/`count`).
  Passing whole server records per row across `"use client"` serializes
  `N × unused fields` into every RSC response. Importing a barrel (`index.ts`)
  that evaluates `M` unused sibling modules or pulling heavy/server-transform
  modules into an initial `"use client"` file runs unneeded module init per
  route load: direct module imports or server-side execution keep behavior
  (**finding**), whereas deferring an interactive modal or editor behind
  `React.lazy` or `next/dynamic` trades route-load work against first-open
  latency (**tradeoff**).
- **Runtime baseline**: check `target`/`lib` in `tsconfig.json` and `engines`/peer
  ranges in `package.json` before relying on newer runtime APIs (`Map.groupBy`,
  iterator helpers, `Set` methods).

## Dependencies

The version in use is resolved by `package-lock.json`, `pnpm-lock.yaml`,
`yarn.lock` or `bun.lock`/`bun.lockb`. Read dependency source on disk under
`node_modules/` without installing or fetching packages; when absent, record the
assumption.

## Not a finding in TypeScript

Style preferences. Claims about V8/JavaScriptCore hidden classes, JIT
deoptimizations or `for` versus `for..of` micro-differences without a supplied
profile or benchmark: these are claims about runtime code generation. Memoizing
cheap React props (`useMemo`/`useCallback`) without a demonstrated expensive
subtree render or per-item multiplier.
