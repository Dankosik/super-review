# Frontend routing

Extend [language routing](languages.md) when included TypeScript/TSX source
establishes React (including SPA query, store, form, and router modules),
Next.js, Tailwind CSS, or shadcn/ui through declarations, imports, owning
configuration, and callers. Resolve per package and area: a Vite or plain React
package stays independent of Next.js rules in sibling workspaces.

Record the per-area baseline with [frontend context](frontend/context.md), and
select profiles from these source triggers under [aspect selection](aspects.md).
Clean frontend source completes every selected question with zero candidates.

| Profile | Owner | Signal in included source, not a finding |
| --- | --- | --- |
| [react-state](profiles/typescript/react-state.md) | data-flow | State ownership: local state, derived render values, query caches, client stores, URL state, form drafts, or optimistic state. |
| [react-state-transitions](profiles/typescript/react-state-transitions.md) | representation | Mode representation: correlated status flags, multi-setter transitions, or raw form strings mixed with parsed domain types. |
| [react-effects](profiles/typescript/react-effects.md) | function-cohesion | Interaction cohesion: Effects, custom Hooks, render-nested components, flag-driven Effect chains, latest-value refs, SSR gates, or multi-workflow closures. |
| [react-composition](profiles/typescript/react-composition.md) | api-clarity | Component seams: props/Hooks, children/slots, `cloneElement` protocols, provider wrappers, memoization wrappers, type-erased form/table props, or refs. |
| [next-boundaries](profiles/typescript/next-boundaries.md) | abstractions | Route and client seams: Next entry points/types, `"use client"`/`"use server"` cuts, client-imported server/barrel modules, Server Functions, or providers. |
| [next-data-ownership](profiles/typescript/next-data-ownership.md) | data-flow | Next loaders, request inputs, server/client data handoffs, mutation, navigation-state lifetime and cache/revalidation ownership. |
| [next-ui-boundaries](profiles/typescript/next-ui-boundaries.md) | control-flow | Loading/result/failure branches, Suspense/fallback composition or route/component recovery infrastructure. |
| [tailwind-variants](profiles/typescript/tailwind-variants.md) | duplication | Tailwind utility sets, semantic tokens or variant mappings in included components. |
| [tailwind-state](profiles/typescript/tailwind-state.md) | data-flow | JS state used in classes, state callbacks or styling through DOM/primitive attributes and render props. |
| [tailwind-layout](profiles/typescript/tailwind-layout.md) | abstractions | Placement/density props, measured dimensions or responsive/container-dependent component layout. |
| [shadcn-composition](profiles/typescript/shadcn-composition.md) | api-clarity | Locally owned shadcn/ui primitives or compositions, including wrappers, forms and trigger/content APIs, across actual backends. |

## Independent recipients, existing owners

Keep the eight base questions unless the user narrows scope. Give each fresh
specialist its TypeScript context, frontend context, one existing lens and only
that owner's selected profiles. The standard contract, neutral source packet and
candidate/result formats still apply. Profiles inherit the rule printed in their
header; they introduce no new rule namespace and cannot bypass owner disables,
scoped overrides or conflicts. Team-rule language remains TypeScript, not React.
The state-transitions profile deepens conditional representation when its signal
is present; it does not replace the base data-flow pass or make representation
mandatory for every React file.

For example, a React/Next form may give data-flow both `react-state` and
`next-data-ownership`, and api-clarity both composition profiles. These are two
owner tasks, not four overlapping technology-wide reviewers. `react-effects`
and generic `effects-separation` can deepen the same function-cohesion task when
both apply. Loading/recovery guidance belongs to control-flow, styling-state
ownership to data-flow, and container/placement coupling to abstractions. Do not
send those questions to the duplication worker just because they use Tailwind.
Profiles with the same owner share its area task; do not assign multiple lenses
to one child or load all framework profiles into every base-lens specialist.
Batches, model selection and result collection remain owned by the workflow and
adapter. No extra worker quota or nested delegation is introduced.

Report selected profiles and actual inspected files/symbols in existing task and
coverage fields. A request for Tailwind variants/duplication selects that owner's
profile only; a broad Tailwind-only request considers all applicable Tailwind
owners within that technology scope. Neither means a full frontend review.
An API-clarity-only request must not silently add representation or data-flow.
A newly discovered cross-technology signal goes to the parent as an anchor and
missing question, not a peer verdict. The parent reconciles overlapping observations
into one recommendation when they propose the same change; keep distinct useful
evidence. No repeated full pass or finding quota is introduced.

JavaScript/JSX, CSS, SCSS, MDX and Vue single-file components are not new standalone
review targets. Theme CSS, configuration, manifests and local primitive
implementations may supply necessary context for supported source. A CSS-only or
`.vue`-only request must disclose this coverage limit, not claim a completed
framework review. TypeScript in an independently included `.ts` file does not
establish coverage of an unavailable or unsupported Vue template. Unknown
stack/configuration is a scoped gap; do not silently infer it or fetch current
web docs during review.
