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
| [react-effects](profiles/typescript/react-effects.md) | function-cohesion | React Effects, custom Hooks, or event/Action handlers combining computation and interactions. |
| [react-composition](profiles/typescript/react-composition.md) | api-clarity | Component/Hook public inputs and outputs, children/slots, callback contracts, controlled props or refs. |
| [next-boundaries](profiles/typescript/next-boundaries.md) | abstractions | Next route entry points, server/client composition, Server Functions, providers or request adapters. |
| [next-data-ownership](profiles/typescript/next-data-ownership.md) | data-flow | Next loaders, request inputs, server/client data handoffs, mutation and cache/revalidation ownership. |
| [tailwind-variants](profiles/typescript/tailwind-variants.md) | duplication | Tailwind utility sets, semantic tokens or variant mappings in included components. |
| [shadcn-composition](profiles/typescript/shadcn-composition.md) | api-clarity | Locally owned shadcn/ui primitives or compositions, including wrappers, forms and trigger/content APIs. |

## Independent recipients, existing owners

Keep the eight base questions unless the user narrows scope. Give each fresh
specialist its TypeScript context, frontend context, one existing lens and only
that owner's selected profiles. The standard contract, neutral source packet and
candidate/result formats still apply. Profiles inherit the rule printed in their
header; they introduce no new rule namespace and cannot bypass owner disables,
scoped overrides or conflicts. Team-rule language remains TypeScript, not React.

For example, a React/Next form may give data-flow both `react-state` and
`next-data-ownership`, and api-clarity both composition profiles. These are two
owner tasks, not four overlapping technology-wide reviewers. `react-effects`
and generic `effects-separation` can deepen the same function-cohesion task when
both apply. Do not send all framework profiles to every base-lens specialist.
Profiles do not automatically create extra workers or nested delegation; batches,
model selection and result collection remain owned by the workflow and adapter.

Report selected profiles and actual inspected files/symbols in existing task and
coverage fields. A scoped Tailwind-only request selects the duplication owner
for that profile, not a full frontend review. A newly discovered cross-technology
signal goes to the parent as an anchor and missing question, not a peer verdict.
The parent reconciles overlapping observations into one recommendation when they
propose the same change; keep distinct useful evidence. No repeated full pass or
finding quota is introduced.

JavaScript/JSX, CSS, SCSS and MDX are not new standalone review targets. Theme CSS,
configuration, manifests and local primitive implementations may supply necessary
context for supported source. A CSS-only request must disclose this coverage
limit, not claim a completed Tailwind code review. Unknown stack/configuration
is a scoped gap; do not silently infer it or fetch current web docs during review.
