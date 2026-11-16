# Frontend context

Pair with [TypeScript context](../languages/typescript.md) to support quality
judgment on the owning package and its consumers at the pinned revision. Read
configuration as text; never execute imports, typegen, builds, or commands.

**Baseline.** Record only facts that govern the assigned area:
- **React**: runtime and `@types/react` versions, consumer peer ranges, and
  verified Compiler config. A lockfile major leaves a library's narrower peer
  contract intact, and a React major implies neither Compiler activation nor
  every minor-release API.
- **SPA / client stack**: established query caches, client stores, form/schema
  bindings, and routers with their resolved versions when implicated.
- **Next.js**: major/minor version, App vs Pages Router per area, `next.config.*`
  flags (`cacheComponents` requires explicit config), runtime, and
  `"use client"`/`"use server"` boundaries. Plain React projects need no Next.js
  assumptions.
- **Tailwind & shadcn/ui**: Tailwind major (keep v3 configs on v3 rather than
  forcing v4 `@theme` migration), entry CSS, semantic tokens, custom variants,
  `components.json` or import-established local primitives, and each component's
  actual Radix, Base UI, or React Aria backend. Read only implicated local
  primitives; locally maintained shadcn files are production source, while
  generator-owned output, vendor code, and tests stay excluded.

**Capability gates.** Before recommending a version-sensitive, renderer-specific,
or generated mechanism (`useEffectEvent`, `use(browser())`, Server Component
rendering of a client-exported `Context`, Next `catchError`, route-generated
`PageProps`/`LayoutProps`, or Tailwind container/state utilities), verify from
on-disk manifests, `.d.ts` declarations, renderer/RSC integration, and committed
config or generated types that the owning package and its peer ranges expose the
stable contract (`unstable_*` is not the stable API). When capability evidence
is unavailable, retain independent observations and leave the version-sensitive
remedy `unresolved`.

**Preservation.** Check only contracts implicated by the proposed change:
component identity and keys, controlled/default state and form ownership,
closure and Effect timing, ref behavior, DOM structure and semantic props, event
composition, portal/provider relationships, server/client placement, async
ordering, focus/keyboard/ARIA composition, and style variant/override behavior
(without claiming an accessibility audit or tested visual equivalence). Treat
hiding (`Activity`), suspending, navigating away, and unmounting as distinct
lifecycle events rather than interchangeable unmounts. External profile links
are authoring references, not mandatory runtime reads or implied team policy.
