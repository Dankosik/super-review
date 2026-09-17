# Frontend context

Apply with [TypeScript context](../languages/typescript.md), not instead of it.
Resolve the owning package and supported consumers at the pinned source revision.
Read configuration as text, never by executing imports or commands. This context
supports quality advice, not a hooks, rendering, security, accessibility, visual,
performance or dependency-upgrade audit.

**Baseline.** Record only what affects the assignment: React and React DOM/runtime
and type baselines, consumer peer ranges and actual Compiler configuration;
Next.js version and App/Pages Router per area, relevant `next.config.*` settings
(including whether `cacheComponents` is enabled), runtime and boundary directives;
Tailwind major, entry CSS, tokens, custom variants and relevant source registration;
shadcn `components.json` when present, aliases, actual local primitives and their
Radix, Base UI or React Aria imports, `cn` and variant helpers. Resolve the backend
per component, not once for the repository. Missing `components.json` alone
does not disprove shadcn provenance; source and imports may establish it.

A lockfile's React 19 does not remove a library's React 18 consumer commitment.
React 19 does not imply Compiler activation or every later 19.x API. Next.js 16
does not imply Cache Components activation. Tailwind v4 guidance must not be
applied as a required v3 migration. Do not assume shadcn has one npm version,
a fixed directory, or a single primitive backend. Read only relevant local
components/helpers, not the entire generated registry or upstream library.

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
