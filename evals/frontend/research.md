# Frontend quality review: research and integration

Authoring review: 2026-09-17. Baseline: `8b581b8d835adfafa825f3a0e58527d49fc2eeff`
(Super Review 3.1.0). This is maintainer research, not an installed reviewer packet.
The analysis was sequential: no independent-agent execution capability was available.
No model-quality comparison or native-host execution is claimed.

## Architectural decision

The baseline already separates shared judgment, ten question lenses (eight base,
two conditional), language context, owner profiles and native adapters. TypeScript
already includes TSX, but its framework paragraph deliberately stops short of a
specialized React/Next/Tailwind/shadcn review. Extending that gap through seven
owner profiles preserves the existing instruction hierarchy and all 44 stable
rule IDs. A second frontend workflow or four technology-wide reviewers would
repeat source reading and blur responsibility for the same component.

Framework compatibility belongs in a shared, small frontend context. Domain
questions belong in selected profiles. The orchestrator gets the routing table;
each child gets one existing lens, the context and only its selected owner profiles.
Naming, control flow, change locality and the other base questions still apply;
profiles deepen them rather than replace them. The following decisions are our
review-policy synthesis, not rules claimed to be mandated by framework authors.

## React 19: readable ownership, interactions and component contracts

### State and data flow

Make the meaning and owner of each value visible. A displayed projection normally
belongs near the inputs that explain it; keeping equivalent copies can force a
reader to reconstruct synchronization. However, a draft, a committed value, a URL
selection and an optimistic overlay may represent different concepts even when
currently equal. The review should inspect all writers, initialization and consumers
before proposing one owner. Merely spotting `useState(props.value)` is insufficient.
React's [state-structure guidance](https://react.dev/learn/choosing-the-state-structure)
explains avoiding redundant state; its
[Effect guidance](https://react.dev/learn/you-might-not-need-an-effect) distinguishes
render derivation from synchronization and interaction work.

For code authors, name the role (`draftTitle`, `selectedId`, `savedRecord`) and keep
its transitions near the interaction that explains them. An explicit projection
can remove an unnecessary synchronization protocol. Preserve intentional snapshots,
resets, keys and intermediate presentation when proposing that change. A state
library or a custom Hook is not automatically clearer than a local value.
The profile requires an observed maintenance burden, not a claim about render counts.

React 19 adds useful [Action mechanisms](https://react.dev/blog/2024/12/05/react-19).
Read [useActionState](https://react.dev/reference/react/useActionState) and
[useOptimistic](https://react.dev/reference/react/useOptimistic) as different ownership
contracts: action results, pending interaction and temporary presentation are not
one interchangeable state bucket. Advice should clarify the existing submission
path, not replace a working form/query library or introduce new optimistic behavior.

### Effects and cohesive Hooks

An Effect that synchronizes an external widget has a different purpose from a
pure calculation or user submission. Name a Hook after a coherent responsibility,
not a grab bag of mount callbacks. React documents
[separate synchronization lifecycles](https://react.dev/learn/lifecycle-of-reactive-effects)
and [reuse of stateful logic](https://react.dev/learn/reusing-logic-with-custom-hooks);
reusing a Hook does not make its callers share state.

For review, extraction should make an operation understandable independently while
preserving closure captures, dependencies and setup/cleanup order. Keep a small,
self-contained event handler or external synchronization Effect when another layer
only adds navigation. Moving work from an Effect into a handler changes when it
runs: identifying that difference is a preservation constraint, not permission to
perform a hooks correctness audit. Do not recommend hooks merely to shorten files.

### Composition and version-sensitive APIs

Prefer component inputs that reveal actual choices and callbacks that name their
meaning. Slots/children can clarify layout, while a discriminated union can express
real alternatives. They are not universal replacements for a few orthogonal
booleans or ordinary prop passing. Start from actual calls and preserve defaults,
controlled/uncontrolled contracts, event versus value callbacks and type inference.
The [props guide](https://react.dev/learn/passing-props-to-a-component) supports
composition, not a required generic component architecture.

React 19 supports `ref` as a function-component prop, but a library can still promise
React 18 consumers even with React 19 in its lockfile. Retaining compatible
`forwardRef` and `Context.Provider` is not a quality failure. Likewise,
[React Compiler](https://react.dev/learn/react-compiler/introduction) is configured
build tooling, not something the major version proves is active. Do not run a
blanket memoization insertion/removal campaign. Focus on understandable APIs and
preserve DOM identity, refs and event behavior.

## Next.js 16: framework boundaries and explicit data policy

### Route and feature responsibilities

Establish App Router versus Pages Router per reviewed area; a mixed repository
cannot be treated as one uniform execution model. For App Router code, inspect
imports and directives rather than infer client/server placement from the JSX tree.
The official [server/client guide](https://nextjs.org/docs/app/getting-started/server-and-client-components)
allows server-rendered content through a Client Component's children. A server
parent with an interactive wrapper does not make every nested visual node client
code. `'use server'` identifies Server Functions, not Server Components.

A route adapter can earn a boundary when request conversion, a feature operation
and presentation are difficult to distinguish. A direct async page that loads data
and renders it does not need an invented service/repository stack. The
[project structure guide](https://nextjs.org/docs/app/getting-started/project-structure)
permits organizational choices; it does not establish one mandatory folder scheme.
Preserve public Route Handler consumers and avoid inventing an internal HTTP hop
for server-local work. Existing framework exports and execution placement matter
more than a preferred file size.

The [Next.js 16 upgrade reference](https://nextjs.org/docs/app/guides/upgrading/version-16)
provides compatibility evidence for asynchronous request APIs. It is used here to
avoid suggesting obsolete synchronous patterns, not to start a migration audit or
report missing awaits as code-quality findings.

### Loading, mutation and caching

Code should make the path from request inputs to loaded data, transformation,
mutation result and UI readable. Follow the actual loader and consumers before
suggesting a name or boundary. Direct `await` plus render can be the best expression;
frontend consistency is not a reason to mirror server/query data into local state.
See [fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) and
[mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) for the
framework mechanisms, not a mandated application data-layer architecture.

Next.js 16's [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
require the relevant opt-in. Record the actual configuration before cache-sensitive
advice. React `cache`, fetch caching, `'use cache'` and a client query cache have
different responsibilities. Our maintainability question is whether an existing
freshness/key/tag/path policy is understandable and has a coherent owner. Sharing
a repeated policy can reduce coordinated edits; combining intentionally different
policies makes future changes harder.

[Revalidation APIs](https://nextjs.org/docs/app/getting-started/revalidating) also
carry distinct contracts: `updateTag`, `revalidateTag` and `revalidatePath` are not
stylistic synonyms. Preserve timing, cache scope, argument relationships and control
transfer in a proposed refactor. Do not claim every fetch is cached/uncached across
all versions and configurations, or turn this profile into a waterfall, stale-data,
authorization or performance audit.

## Tailwind: name shared design knowledge, not every utility sequence

Utility-first code can be readable without extracting all classes into CSS or
abstractions. The [utility styling guide](https://tailwindcss.com/docs/styling-with-utility-classes)
discusses managing repetition with existing component/template structure. Our
criterion is shared knowledge: two variants of one maintained status appearance
may deserve one mapping; unrelated rows that both use `flex gap-2` need not.
Class-string length and formatter order do not demonstrate maintenance cost.

For authors, colocate a component's meaningful variants and expose the choices
consumers actually need. Use existing helpers when their behavior is known, not
because `cn`, CVA or `tailwind-merge` are compulsory. Read the helper before claiming
which caller class wins. A new abstraction should remove duplicated decisions,
not spread simple styling across more files.

[Theme variables](https://tailwindcss.com/docs/theme) can give recurring semantic
roles one owner. Equal colors are not proof of equal roles: a brand accent and a
warning may intentionally evolve separately. [Custom styles](https://tailwindcss.com/docs/adding-custom-styles)
also support intentional one-off values and runtime CSS variables. Requiring a
global token for every arbitrary value creates concepts without demonstrated reuse.

Preserve literal utility names under [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).
When extracting a variant map, complete strings are different from manufacturing
`bg-${tone}-500`. This is a constraint on the remedy, not a scan for missing classes.
Keep selector scope, breakpoint/state/dark/motion conditions and override behavior.
The [v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) explains material
configuration differences; a v3 package must not receive a mandatory v4 rewrite.

Standalone CSS, SCSS and MDX are outside this change's supported language targets.
Theme CSS is read only as context for included TS/TSX; a CSS-only request must not
be reported as completed frontend review. Expanding those languages deserves its
own lenses and contrasting evidence rather than a filename exception here.

## shadcn/ui: local ownership and reliable composition

shadcn's [open-code model](https://ui.shadcn.com/docs) makes the local component
implementation central. A file originally copied by the CLI can be deliberately
maintained production source. Do not exclude it solely for that origin, overwrite
it with current upstream code, or demand a wrapper around every customized primitive.
Still respect evidence of genuinely generator-owned or vendor output.

The local [components configuration](https://ui.shadcn.com/docs/components-json),
aliases, imports and consumers establish what the project uses. Absence of that
file alone is not evidence of absence. There is no safe assumption that all shadcn
components have one package version or backend. Read the source needed by the
proposed change; missing local code is a gap, not a reason to run the CLI.

The composition APIs differ: [Radix](https://www.radix-ui.com/primitives/docs/guides/composition)
uses `asChild` patterns, while [Base UI](https://base-ui.com/react/handbook/composition)
uses `render`. Rewriting one as the other because both are called shadcn is not
API cleanup. Preserve local forwarding, refs, event merging/default prevention,
controlled/default values and styling hooks.

For authors, keep a primitive's meaningful interaction/visual contract distinct
from a feature workflow when that split helps its callers. Direct primitive
customization remains appropriate when the change belongs to its reusable role.
A feature dialog can coordinate saving without teaching every primitive consumer
about one feature's payload. Semantic [theming](https://ui.shadcn.com/docs/theming)
can centralize an actual product role, not simply replace all color literals.

Refactoring overlays and fields must retain DOM semantics, labels, descriptions,
portal/provider ancestry, focus and the existing form library contract. Those are
preservation obligations; this skill still does not perform accessibility testing,
visual redesign, bug hunting or form-library migrations.

## Evidence and remaining limits

The contrast corpus exercises each new owner profile with a possible improvement
and a retention case, plus framework detection, consumer versions, missing source,
CSS-only scope and policy disables. Inputs are separate from evaluator expectations.
No fixture is an actual subagent output, and no source example is executed.
Mechanical integrity checks establish routing/resource delivery and fixture identity,
not whether a model produces useful findings. Baseline/candidate behavioral and
native-host runs remain **NOT RUN** until executed under the existing evaluation
protocol. This patch preserves native model selection and does not promote the
separate routing-first experiment.
