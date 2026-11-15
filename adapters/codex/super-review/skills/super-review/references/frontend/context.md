# Frontend context

Pair with [TypeScript context](../languages/typescript.md) to support quality
judgment on the owning package and its consumers at the pinned revision. Read
configuration as text; never execute imports, builds, or commands.

**Baseline.** Record only facts that govern the assigned area:
- **React**: runtime and `@types/react` versions, consumer peer ranges, and
  verified Compiler config. A lockfile's React 19 leaves a library's React 18
  peer contract intact, and React 19 implies neither Compiler activation nor
  every 19.x minor API.
- **SPA / client stack**: established query caches (TanStack Query, SWR), client
  stores (Zustand, Jotai, Redux Toolkit), form/schema bindings (React Hook Form,
  TanStack Form, Zod, Valibot), and routers (React Router, TanStack Router) with
  their majors when implicated.
- **Next.js**: major version, App vs Pages Router per area, `next.config.*`
  flags (`cacheComponents` requires explicit config even on Next 16), runtime,
  and `"use client"`/`"use server"` directives.
- **Tailwind & shadcn/ui**: Tailwind major (keep v3 configs on v3 rather than
  forcing v4 `@theme` migration), entry CSS, semantic tokens, custom variants,
  `components.json` or import-established local primitives, and each component's
  actual Radix, Base UI, or React Aria backend. Read only implicated local
  primitives. Locally maintained shadcn files are production source; generated
  output, vendor code, and tests stay excluded.

**Capability gates.** A version is necessary evidence, not proof that a particular
renderer, integration, consumer or generated declaration supports the remedy.
Use these gates only for implicated proposals; they are not a package-upgrade list:

| Mechanism | Evidence needed before recommending it |
| --- | --- |
| React `useEffectEvent` | React 19.2+ and matching supported runtime/types; an event belonging to an Effect, not a general callback. |
| React `use(browser())` | React/React DOM 19.3+ and renderer/framework support; the existing server fallback and client timing must be understood. |
| Context rendered by a Server Component | React 19.3+ RSC integration support; Context still created/exported by a client module, plus compatible consumers. |
| Next `catchError` | Next 16.3+ and a client module; the earlier `unstable_catchError` is not the stable API. |
| Next route-aware types | Owning App Router route and available project generation/type inclusion; no typegen or build execution during review. |
| Container/state utilities | Owning Tailwind major, plugins/configuration and actual DOM/primitive state contracts. |

If capability evidence is unavailable, keep independent quality observations but
defer the version-sensitive remedy. Background documentation cannot establish the
reviewed project's configuration. Native DOM/provider and wrapper contracts also
remain relevant in plain React projects; do not assume they require Next.js.

**Preservation.** For the proposed change, identify the implicated contracts:
component identity and keys, controlled/default state and form ownership, closure
and Effect timing, ref behavior, DOM structure and semantic props, event composition,
portal/provider relationships, server/client placement, async ordering, and style
variants/override behavior. These constrain a remedy; their mere presence is not
a defect. Preserve focus/keyboard/ARIA contracts when changing composition without
claiming an accessibility audit or tested visual/behavioral equivalence. Hiding,
suspending, navigating away and unmounting are distinct lifecycle events; do not
infer one from another when moving state or Effects.

Locally maintained shadcn source is production code, not excluded merely because
it was initially copied by a CLI. Still exclude genuinely generator-owned output,
vendor code and tests under the shared contract. Do not edit reviewed code, run
its checks, install packages, regenerate primitives or browse to fill missing
project evidence. Unknown local contracts limit the affected remedy/coverage,
not independent TypeScript advice. External links in profiles are authoring
references, not mandatory runtime reads or automatically adopted team policy.
