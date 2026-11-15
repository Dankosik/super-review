# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code states its cost

JSDoc complexity or batching notes, benchmark scripts (`*.bench.ts`), committed
CPU/heap profiles or bundle reports, pagination/batch limits, and target
runtime/compiler settings in `package.json` and `tsconfig.json`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation or the resolved dependency version, not from memory.

- **Quadratic array/object copying in loops.** Returning `[...acc, item]` or
  `{ ...acc, [k]: v }` inside `.reduce()` or a loop copies all previously
  accumulated elements on every iteration (`O(N^2)` copies and allocations);
  mutating a local array/map/`Set` inside the function is `O(N)` while keeping
  the function pure to callers. `arr.includes(x)` or `arr.find(...)` inside
  another loop over `M` items scans linearly (`O(N * M)`) where a `Set` or `Map`
  answers in `O(1)` per lookup. `Array.prototype.shift()` moves every remaining
  element (`O(N)`).
- **Event-loop blocking and sequential awaits.** Synchronous file, crypto or
  compression calls (`fs.readFileSync`, `pbkdf2Sync`, `gzipSync`) and large
  synchronous `JSON.parse`/`JSON.stringify` on a server hot path stall every
  concurrent request on that worker. `for (const x of items) await fetchOne(x)`
  pays `N` sequential round-trip latencies when operations are independent and a
  bounded concurrency helper or batch endpoint applies.
- **Repeated object construction.** Constructing `new RegExp(...)`,
  `new Intl.DateTimeFormat(...)`, `new Intl.NumberFormat(...)`, `new TextEncoder()`,
  or re-compiling validation schemas per element or per request repeats setup
  work that gives the same instance every time.
- **Data access and UI serialization.** ORM/query calls inside loops (Prisma,
  Drizzle, TypeORM, GraphQL resolvers without DataLoader) issue `N+1` round
  trips; fetching entire rows/relations only to read one column or count
  transfers unneeded payloads (`select` / `count`). In React Server Components
  and SSR routes, passing whole domain records across client boundaries
  serializes unused subtrees into every response.
- **What a cheaper form may use.** Check `target`/`lib` in `tsconfig.json` and
  `engines` in `package.json` before relying on newer runtime APIs (`Map.groupBy`,
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
