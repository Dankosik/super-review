# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code states its cost

JSDoc complexity or batching notes, benchmark scripts (`*.bench.ts`), committed
CPU/heap profiles, DevTools/Web Vitals traces or bundle reports,
pagination/batch/virtualization limits, React Compiler settings
(`babel-plugin-react-compiler` or `reactCompiler` in framework/bundler configs),
and runtime/compiler settings in `package.json` (`engines`, peer ranges) and
`tsconfig.json` (`target`, `lib`).

## Verify in source

The version in use is what the lockfile resolves (`package-lock.json`,
`pnpm-lock.yaml`, `yarn.lock`, `bun.lock` or `bun.lockb`), never `package.json`
ranges or memory. Inspect dependency source already on disk under
`node_modules/` to verify both the current cost (internal caches, store
persistence middleware, framework memoization) and what a proposed cheaper form
actually does. Check API availability against `tsconfig.json` and `package.json`.
Do not install or fetch packages. When needed source is absent on disk, mark the
step as an assumption: name the package, the version, and the question its
source would answer.

## Questions to settle before claiming

- **Quadratic copies, clones, and streaming tails**: does a loop, `.reduce()`,
  edit handler, or streamed chunk re-copy prior entries, deep-clone an entire
  state tree, or re-parse completed prefix content from offset 0 where
  structural sharing or completed-item memoization avoids it?
- **Frame loops, sub-frame input, and React renders**: check React Compiler
  config first (it memoizes intra-component derivations and JSX, not external
  store subscriptions). Does high-frequency input or animation state reconcile
  React subtrees where a `ref` or element-scoped CSS variable suffices? Do
  sub-frame events (`pointerrawupdate`, uncoordinated sources) run multiple
  passes per paint, or do `requestAnimationFrame` loops keep ticking after
  motion settles or while offscreen/hidden in an active tab (browsers pause
  `rAF` only when `document.hidden`)?
- **Layout, style invalidation, and canvas**: do DOM geometry reads and style
  writes interleave to force synchronous reflows? Do animations drive layout
  geometry where compositor `transform` and `opacity` keep sibling layout, fixed
  descendants, and text/stroke rendering unchanged? Do per-tick style or CSS
  variable updates invalidate the document root instead of the consuming
  element? On Canvas/WebGL, does each frame reallocate scratch storage, reset
  unchanged canvas dimensions, or encode synchronously on the main thread?
- **Fan-out, per-row setup, and server/client boundaries**: do `N` rows
  subscribe to a whole collection/Context, compute synchronous derived state in
  `useEffect`, or duplicate observers, formatters, or closed portals per row? Do
  high `"use client"` boundaries, over-serialized server props, barrel imports,
  or eager priority media multiply work across `N` rows or route load?
- **Event loop, storage, and worker transfers**: do `*Sync` I/O, large JSON
  passes, or synchronous `localStorage`/`sessionStorage` writes run on hot
  ticks? Do loops open separate IndexedDB `readwrite` transactions per item, or
  structured-clone unretained buffers across `postMessage` where `Transferable`
  ownership transfer keeps the message contract?

## TypeScript boundaries

- **Finding**: builds within `tsconfig.json` and `package.json`, keeps visual
  rendering, event fidelity, commit boundaries, and public/message contracts
  (including bypassing an existing virtualizer or keeping ephemeral state out of
  persisted stores).
- **Tradeoff**: introducing virtualization or `content-visibility: auto` from
  scratch (changes find-in-page and scroll geometry), delaying visual updates
  (`useDeferredValue`, `startTransition`, `debounce`), coalescing where
  sub-frame stroke fidelity drops, debouncing persisted drafts, splitting
  in-flight Markdown blocks across CommonMark boundaries, code-splitting
  interactive UI (`React.lazy`, `next/dynamic`) or adding `loading="lazy"`
  (never on LCP media), or changing sync/Base64/`postMessage` contracts.

## Not a finding in TypeScript

Style preferences. Claims about V8/JavaScriptCore hidden classes, JIT
deoptimizations, minor CSS selector matching differences, or `for` versus
`for..of` micro-differences without a supplied profile or benchmark: these are
claims about runtime code generation or engine internals. Adding `will-change`
without a profile (promotes persistent GPU layers and raises memory), replacing
React's root-delegated `onClick` with manual DOM event delegation on bounded
lists, or memoizing cheap React props (`useMemo`/`useCallback`) without a
demonstrated expensive subtree render or per-item multiplier. Uncleaned
listeners, timers, or observers that leak across unmounts and unstable React
`key` expressions that reset component state are correctness bugs, outside this
review unless live per-item instances multiply active hot-path work.
