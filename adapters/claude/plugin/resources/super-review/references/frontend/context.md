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
Radix/Base UI imports, `cn` and variant helpers. Missing `components.json` alone
does not disprove shadcn provenance; source and imports may establish it.

A lockfile's React 19 does not remove a library's React 18 consumer commitment.
React 19 does not imply Compiler activation or every later 19.x API. Next.js 16
does not imply Cache Components activation. Tailwind v4 guidance must not be
applied as a required v3 migration. Do not assume shadcn has one npm version,
a fixed directory, or a single primitive backend. Read only relevant local
components/helpers, not the entire generated registry or upstream library.

**Preservation.** For the proposed change, identify the implicated contracts:
component identity and keys, controlled/default state and form ownership, closure
and Effect timing, ref behavior, DOM structure and semantic props, event composition,
portal/provider relationships, server/client placement, async ordering, and style
variants/override behavior. These constrain a remedy; their mere presence is not
a defect. Preserve focus/keyboard/ARIA contracts when changing composition without
claiming an accessibility audit or tested visual/behavioral equivalence.

Locally maintained shadcn source is production code, not excluded merely because
it was initially copied by a CLI. Still exclude genuinely generator-owned output,
vendor code and tests under the shared contract. Do not edit reviewed code, run
its checks, install packages, regenerate primitives or browse to fill missing
project evidence. Unknown local contracts limit the affected remedy/coverage,
not independent TypeScript advice. External links in profiles are authoring
references, not mandatory runtime reads or automatically adopted team policy.
