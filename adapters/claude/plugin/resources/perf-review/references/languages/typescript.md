# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code states its cost

JSDoc complexity or batching notes, benchmark scripts (`*.bench.ts`), committed
CPU/heap profiles, DevTools/Web Vitals traces or bundle reports,
pagination/batch/virtualization limits, React Compiler settings
(`babel-plugin-react-compiler` / `reactCompiler` in `next.config.*` or
Vite/Babel configs), and target runtime/compiler settings in `package.json` and
`tsconfig.json`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation, or the resolved dependency version rather than memory.

- **Quadratic spread, inner scans, and deep state clones**: `[...acc, item]` or
  `{ ...acc, [k]: v }` inside `.reduce()` or a loop copies every prior element
  per step (`O(N^2)`) -> mutate a local collection inside the function for
  `O(N)`. Calling `.includes()` or `.find()` inside a loop or per-row `.map()`
  over `M` items scans `O(N * M)` -> index once in a `Set` or `Map` for `O(1)`
  lookup; `Array.prototype.shift()` moves every remaining element (`O(N)`).
  Deep-cloning an `N`-node editor, canvas, or reducer tree via
  `structuredClone` or `JSON.parse(JSON.stringify(state))` per keystroke or
  drag step copies all `N` nodes -> copy only the `O(depth)` spine via
  structural sharing (**finding** when untouched subtrees stay immutable).
- **Off-React frame state, input coalescing, and idle `rAF` loops**: driving
  continuous `pointermove`, `wheel`, `scroll`, `timeupdate`, or
  `requestAnimationFrame` values through React `setState` (including piping
  Framer Motion `MotionValue` updates via `useMotionValueEvent` back into
  `setState`) reconciles the component and `M` children 60 to 120 times per
  second -> write to a `ref`, scoped CSS custom property, or direct
  `MotionValue` (`M -> 0` React renders per frame; **finding** when JSX
  branching does not depend on the value). Running hit-testing, DOM queries, or
  redraws directly inside `pointermove`/`mousemove`/`scroll` (240 to 1000 Hz)
  executes multiple passes before one paint -> coalesce the latest event into
  one `requestAnimationFrame` gate (`K -> 1` pass per frame; **finding** when
  intermediate unpainted events carry no side effects, **tradeoff** when stroke
  integration needs `getCoalescedEvents()`). Keeping a `requestAnimationFrame`
  loop running after motion settles or while `document.hidden` / offscreen runs
  60 to 120 idle callbacks per second -> stop the loop until the next trigger
  (**finding**).
- **Compositor animations, layout thrashing, and style invalidation**:
  animating layout or paint geometry (`top`, `left`, `width`, `height`,
  `margin`) per frame forces main-thread Layout and Paint every frame -> use
  compositor `transform` (`translate3d`, `scale`) and `opacity` (**finding**
  for out-of-flow elements that do not reflow siblings; **tradeoff** when
  siblings reflow or `scale` distorts borders or text without FLIP
  compensation). Interleaving DOM geometry reads (`getBoundingClientRect()`,
  `offsetHeight`, `scrollTop`, `getComputedStyle()`) with style or DOM writes
  in an `N`-element loop, or across `N` sibling `useLayoutEffect` hooks that
  synchronously write then read during one commit, forces `N` synchronous
  browser reflows -> batch reads before writes (`N -> 1` layout pass). Setting
  dynamic CSS custom properties on `document.documentElement` or
  `document.body` per pointer or scroll tick invalidates computed styles across
  all `D` document nodes, and interpolating per-frame coordinates into runtime
  CSS-in-JS injects stylesheet rules per tick -> scope the custom property to
  the consuming container (`D -> k` nodes) or update inline `style.transform`
  (**finding**). `wheel`/`touchstart`/`touchmove` listeners that never call
  `preventDefault()` block compositor scrolling unless `{ passive: true }` is
  set.
- **Canvas/WebGL frame allocations and synchronous encoding**: allocating
  scratch vectors, matrices, gradients, typed arrays, or `.map()`/`.filter()`
  arrays inside `requestAnimationFrame` or Three.js/R3F `useFrame` over `N`
  items allocates `60 * N` heap objects per second, and reassigning unchanged
  `canvas.width` or `canvas.height` clears and reallocates the backing store ->
  reuse preallocated scratch storage and resize only when dimensions change
  (**finding**). `canvas.toDataURL()` encodes synchronously on the main thread
  and allocates a Base64 string -> `canvas.toBlob()` or
  `OffscreenCanvas.convertToBlob()` encodes asynchronously into a `Blob`
  (**finding** in async callers; **tradeoff** when callers require a
  synchronous string return).
- **Streaming UI tails and chunk coalescing**: re-parsing full Markdown ASTs
  (`remark`, `marked`) or syntax highlighting (`shiki`, `prism`) from character
  0 and re-rendering all `M` completed items on every SSE, WebSocket, or
  `ReadableStream` chunk (`T` chunks) spends `O(T^2)` parse work and `O(T * M)`
  renders -> coalesce chunks within one display frame via
  `requestAnimationFrame`, memoize completed messages or closed blocks, and
  re-render only the active streaming tail (`M -> 1` item render per frame;
  **finding** when sub-frame intermediate renders are unobservable).
- **Store selector fan-out, render-tick multipliers, and derived Effects**:
  check whether React Compiler is active first. Even with React Compiler,
  subscribing `N` row components to a whole collection or `Context` value
  (`useStore(s => s.selectedIds)` or `s => s.entities`) re-renders all `N` rows
  when 1 item changes, and Zustand/Redux selectors returning fresh
  `.filter()`/`.map()` arrays without shallow equality re-run subscribers every
  tick -> select item-scoped primitives or stable slices
  (`s => s.selectedIds.has(id)` or `s.entities[id]`, `N -> 1` row render;
  **finding**). Without React Compiler, inline `O(N)` sort/filter on
  per-keystroke or hover renders, fresh `<Context.Provider value={{ ... }}>`
  literals across `M` subscribers, or `JSON.stringify` inside render/dependency
  lists repeat `O(N)`/`O(M)` work per state tick. Holding fast-changing input
  state in a page root above unrelated subtrees re-renders them per keystroke ->
  co-locate state in the input leaf (**finding**), whereas lagging a dependent
  view via `useDeferredValue`, `startTransition`, or `debounce` changes
  intermediate visual timing (**tradeoff**). Synchronizing synchronous derived
  state inside `useEffect` (`setDerived(fn(props))`) commits a stale pass
  before re-rendering (`2 -> 1` render/commit pass when computed during render;
  **finding**).
- **List scaling, per-row observers/portals, and virtualization**: creating
  `new IntersectionObserver`, `new ResizeObserver`, `window.matchMedia`, closed
  `<Dialog>`/`<Popover>`/`<DropdownMenu>` subtrees, or invariant
  `twMerge`/`cn(...)` class merges inside each of `N` rendered rows or `N * M`
  grid cells multiplies setup and parsing by `N` -> share one observer or hoist
  closed portals and static merged classes outside the row loop (`N -> 1`;
  **finding** when closed portals mount no visible DOM). Bypassing an existing
  virtualizer (iterating full `items` instead of `getVirtualItems()` or forcing
  synchronous measurement of all `N` rows) is a **finding**, whereas
  introducing list virtualization or `content-visibility: auto` from scratch
  removes offscreen nodes from native find-in-page or approximates scroll
  geometry (**tradeoff**).
- **Repeated setup and RSC request reads**: constructing `new RegExp(...)`,
  `new Intl.DateTimeFormat(...)`, `new Intl.NumberFormat(...)`,
  `new TextEncoder()`, or compiling schemas per element or per request repeats
  invariant setup -> hoist or cache the instance. Identical data reads across a
  React Server Component tree within one request re-run unless wrapped in
  `React.cache()` or passed down.
- **Waterfalls, RSC/client boundaries, and media priority**: `*Sync` I/O,
  crypto, or compression calls and large synchronous
  `JSON.parse`/`JSON.stringify` stall server event loops or browser input
  frames. `for (const x of items) await fetchOne(x)`, sequential independent
  `await` statements in route loaders, Server Components, or Effects, `await`
  placed before a branch or `<Suspense>` boundary that does not read the
  result, and client mount-then-fetch chains (parent `useEffect` fetch gating
  child mount and child `useEffect` fetch) pay serial round trips -> overlap
  with `Promise.all`, bounded concurrency, deferred `await`, or route-level
  loaders (**finding**). Unaborted superseded `fetch` calls on rapid input
  parse and render obsolete payloads -> wire `AbortController` (**finding** for
  idempotent reads). ORM/resolver queries inside loops issue `N+1` round trips;
  fetching whole rows/relations for one column or count transfers unneeded
  payloads (`select`/`count`). Marking a layout or container `"use client"`
  solely for an interactive leaf pulls `K` static subtrees and server
  transforms into client bundle init and hydration, and passing whole server
  records per row across `"use client"` serializes `N * unused fields` -> push
  `"use client"` to the leaf (passing server JSX as `children`) and project
  used row fields (**finding**). Importing a barrel (`index.ts`) or full
  icon/locale/grammar namespace (`import * as Icons`) that evaluates `M` unused
  modules runs unneeded module init per route load: direct subpath imports keep
  behavior (**finding**), whereas deferring an interactive modal or editor
  behind `React.lazy` or `next/dynamic` trades route-load work against
  first-open latency (**tradeoff**). Putting `priority` /
  `fetchPriority="high"` / `loading="eager"` on all `N` list images contends
  with the LCP fetch, while omitting `loading="lazy"` on `N` offscreen feed
  images eagerly fetches unseen media.
- **Synchronous web storage, IndexedDB batching, and Worker transfers**:
  calling `localStorage.setItem` / `sessionStorage.setItem` with
  `JSON.stringify` on high-frequency state ticks (including Zustand `persist`
  without `partialize` serializing ephemeral cursor, stream, or hover slices on
  every `set()`) blocks the main thread on synchronous storage I/O -> exclude
  non-persisted slices via `partialize` (**finding**), whereas debouncing
  writes of persisted drafts trades crash-window durability for frame budget
  (**tradeoff**). Opening a separate IndexedDB `readwrite` transaction per
  record in an `N`-item loop pays `N` transaction commits -> batch writes in
  one transaction (**finding** when per-item partial commit is not relied on,
  otherwise **tradeoff**). Posting unretained `ArrayBuffer` / `TypedArray` /
  `ImageData` buffers via `worker.postMessage(buf)` structured-clones `B` bytes
  -> pass transferables `postMessage(buf, [buf.buffer])` for zero-copy transfer
  (**finding** when the sender never reads `buf` afterward); moving synchronous
  main-thread compute into a `Worker` changes call asynchronicity (**tradeoff**
  unless the caller is already `async`).
- **Runtime baseline**: check `target`/`lib` in `tsconfig.json` and
  `engines`/peer ranges in `package.json` before relying on newer runtime APIs
  (`Map.groupBy`, iterator helpers, `Set` methods, `OffscreenCanvas`,
  `Scheduler.yield`).

## Dependencies

The version in use is resolved by `package-lock.json`, `pnpm-lock.yaml`,
`yarn.lock` or `bun.lock`/`bun.lockb`. Read dependency source on disk under
`node_modules/` without installing or fetching packages; when absent, record the
assumption.

## Not a finding in TypeScript

Style preferences. Claims about V8/JavaScriptCore hidden classes, JIT
deoptimizations, minor CSS selector matching differences, or `for` versus
`for..of` micro-differences without a supplied profile or benchmark: these are
claims about runtime code generation or engine internals. Adding `will-change`
without a profile (promotes persistent GPU layers and raises memory), replacing
React's root-delegated `onClick` with manual DOM event delegation on small
bounded lists, or memoizing cheap React props (`useMemo`/`useCallback`) without
a demonstrated expensive subtree render or per-item multiplier. Uncleaned
listeners, timers, or observers that leak across unmounts and unstable React
`key` expressions that reset component state are correctness bugs, outside this
review unless live per-item instances multiply active hot-path work.
