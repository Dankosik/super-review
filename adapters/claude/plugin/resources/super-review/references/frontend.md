# Frontend routing

Use this extension of [language routing](languages.md) for established React,
Next.js, Tailwind CSS or shadcn/ui in included TypeScript/TSX source. It adds
owner profiles, not a language, an agent type, or a replacement review workflow.
A package dependency or `.tsx` suffix alone is not an applicability decision:
inspect declarations, imports/re-exports, owning configuration and actual uses.
A React-only package does not inherit Next.js constraints from another workspace.

Record the per-area baseline using [frontend context](frontend/context.md).
Select from the following signals under [aspect selection](aspects.md), including
its scope, policy, missing-evidence and completion rules. Ordinary frontend source
can complete every selected question with no candidates.

| Profile | Owner | Signal in included source, not a finding |
| --- | --- | --- |
| [react-state](profiles/typescript/react-state.md) | data-flow | React state, derived render values, context/store subscriptions, draft or pending/optimistic state. |
| [react-state-transitions](profiles/typescript/react-state-transitions.md) | representation | Existing interaction modes, correlated state/payloads or coordinated updates across handlers. |
| [react-effects](profiles/typescript/react-effects.md) | function-cohesion | React Effects, custom Hooks, latest-value adapters, browser-only gates or event/Action handlers combining computation and interactions. |
| [react-composition](profiles/typescript/react-composition.md) | api-clarity | Component/Hook contracts, children/slots, child inspection/cloning, transparent provider wrappers, controlled props or refs. |
| [next-boundaries](profiles/typescript/next-boundaries.md) | abstractions | Next route entry points/types, server/client composition, Server Functions, providers or request adapters. |
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
