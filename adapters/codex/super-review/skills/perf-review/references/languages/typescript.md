# TypeScript context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where TypeScript code states its cost

JSDoc complexity or batching notes, benchmark scripts (`*.bench.ts`), committed
CPU/heap profiles, DevTools/Web Vitals traces or bundle reports,
pagination/batch/virtualization limits, React Compiler settings
(`babel-plugin-react-compiler` or `reactCompiler` in framework/bundler configs),
and target runtime/compiler settings in `package.json` and `tsconfig.json`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation, or the resolved dependency version rather than memory.

- **Quadratic spreads and deep state clones**: `[...acc, item]` and
  `{ ...acc, [k]: v }` inside `.reduce()` or loops copy every prior entry per
  step, and full-tree `structuredClone` or `JSON.parse(JSON.stringify(state))`
  on an `N`-node UI/editor tree per keystroke or drag copies all `N` nodes where
  structural sharing copies only the changed ancestor spine (**finding** when
  untouched subtrees stay immutable).
- **Off-React frame state, sub-frame input, and idle `rAF` loops**: piping
  60 to 120 Hz pointer, touch, wheel, scroll, video-frame, or animation values
  (including motion-library value subscriptions) into React state reconciles the
  component and unmemoized children every frame where a `ref`, scoped CSS custom
  property, or direct motion value avoids React renders (**finding** when JSX
  structure does not branch on the value). Browser `scroll`, `pointermove`,
  `wheel`, and `touchmove` already align to one dispatch per frame, whereas
  running hit-testing, layout reads, or redraws per `pointerrawupdate`, per
  coalesced input point, or across uncoordinated frame sources executes multiple
  passes before one paint (**finding** to coalesce into `requestAnimationFrame`
  when unpainted intermediate states carry no side effects; **tradeoff** when
  sub-frame stroke fidelity drops). Browsers pause `requestAnimationFrame` when
  `document.hidden` is true, whereas loops left running after motion settles or
  while the target is offscreen or CSS-hidden in an active tab still run every
  frame (**finding**).
- **Compositor animations, layout thrashing, and style invalidation**: animating
  layout geometry (`top`, `left`, `width`, `height`, `margin`) runs main-thread
  layout and paint every frame where compositor `transform` and `opacity` avoid
  layout (**finding** on out-of-flow elements when sibling layout, fixed
  descendants, and stroke/text rendering stay unchanged; otherwise
  **tradeoff**). Interleaving layout-dependent DOM reads with DOM/style writes
  across loop items or sibling `useLayoutEffect` hooks forces repeated
  synchronous reflows. Updating dynamic CSS custom properties on
  `document.documentElement`/`body` or injecting runtime CSS-in-JS rules per
  tick invalidates styles broadly instead of scoping updates to the consuming
  element (**finding**). `wheel`/`touchstart`/`touchmove` listeners that never
  call `preventDefault()` block compositor scrolling unless `{ passive: true }`.
- **Canvas/WebGL frame allocations and encoding**: allocating scratch objects or
  typed arrays inside `requestAnimationFrame` / `useFrame`, or reassigning
  unchanged `canvas.width`/`height` (resetting context state and backing
  storage), pays per-frame allocation (**finding** when explicit frame clearing
  and context state are preserved). `canvas.toDataURL()` encodes synchronously
  into a Base64 string on the main thread, whereas `toBlob()` /
  `convertToBlob()` encodes asynchronously (**finding** when callers already
  consume async binary data or object URLs; **tradeoff** when synchronous or
  Base64 contracts change).
- **Streaming UI tails**: re-parsing full Markdown or syntax-highlighted ASTs
  from offset 0 and re-rendering completed items on every streamed chunk spends
  quadratic parse work on the tail and repeated passes over finished items:
  coalescing sub-frame chunks and memoizing completed items keeps behavior
  (**finding**), whereas splitting an in-flight Markdown message into cached
  blocks can alter cross-block CommonMark resolution (**tradeoff**).
- **React Compiler, store selector fan-out, and derived Effects**: check whether
  React Compiler is active first (it memoizes intra-component derivations and
  JSX, not external store subscriptions). Subscribing `N` rows to a whole
  collection/Context or returning fresh selector references without shallow
  equality re-renders all `N` rows on single-item updates (**finding** for
  item-scoped selectors). Co-locating fast input state in its leaf avoids
  unrelated parent subtree renders (**finding**), whereas lagging dependent
  views via `useDeferredValue`, `startTransition`, or `debounce` changes
  intermediate visual timing (**tradeoff**). Computing synchronous derived state
  inside `useEffect` commits an extra stale pass (**finding** unless intentional).
- **Per-row setup, portals, and virtualization**: instantiating duplicate
  `IntersectionObserver`, `ResizeObserver`, or `matchMedia` instances, invariant
  `RegExp` or `Intl.*` formatters, closed modal subtrees, or uncached invariant
  work inside each of `N` rows multiplies setup by `N` (verify whether utility
  libraries already cache internally in `node_modules/` before counting per-cell
  calls; hoisting closed portals is a **finding** when they render nothing while
  closed). Bypassing an existing virtualizer is a **finding**, whereas
  introducing virtualization or `content-visibility: auto` from scratch alters
  native find-in-page and scroll geometry (**tradeoff**).
- **Server/client boundaries, module init, and media priority**: synchronous
  `*Sync` I/O or large `JSON` passes stall event loops; sequential independent
  `await`s, mount-then-fetch chains, unaborted superseded `fetch` reads on rapid
  input, and duplicate RSC reads without `React.cache()` repeat round trips
  (**finding** for idempotent reads). Placing `"use client"` high in a static
  subtree or serializing unused server fields per row across the client boundary
  inflates hydration and RSC payloads (**finding**). Barrel or namespace imports
  that evaluate unused modules on route load are **findings**, whereas
  code-splitting interactive UI behind `React.lazy` or `next/dynamic` trades
  route load against first-open latency (**tradeoff**). High-priority or eager
  loading on all `N` list images contends with LCP (**finding**), whereas adding
  `loading="lazy"` defers offscreen fetches until scroll (**tradeoff**, never on
  LCP media).
- **Web storage, IndexedDB batching, and Worker transfers**: synchronous
  `localStorage`/`sessionStorage` serialization on high-frequency state ticks
  blocks the main thread (check persistence middleware in `node_modules/`:
  keeping ephemeral frame/stream state outside persisted stores and persisting
  only needed slices is a **finding**, whereas debouncing persisted drafts is a
  **tradeoff**). Opening separate IndexedDB `readwrite` transactions per loop
  item pays `N` commits (**finding** when per-item commit boundaries are unused,
  otherwise **tradeoff**). Structured-cloning unretained buffers across
  `postMessage` copies payload bytes where `Transferable` ownership transfer on
  unshared buffers is zero-copy (**finding** when the sender never reads the
  detached buffer and the message shape stays unchanged; **tradeoff** when
  changing message contracts or making synchronous calls `async`).
- **Runtime baseline**: check `target`/`lib` in `tsconfig.json` and
  `engines`/peer ranges in `package.json` before relying on newer runtime APIs.

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
React's root-delegated `onClick` with manual DOM event delegation on bounded
lists, or memoizing cheap React props (`useMemo`/`useCallback`) without a
demonstrated expensive subtree render or per-item multiplier. Uncleaned
listeners, timers, or observers that leak across unmounts and unstable React
`key` expressions that reset component state are correctness bugs, outside this
review unless live per-item instances multiply active hot-path work.
