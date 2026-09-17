# Technology-depth follow-up

Authoring sources checked 2026-09-17. Baseline is 3.2.0 at
`aa61e8699d27795dad965a14ef153eef26195171`. This audit implements the accepted
follow-up questions without changing the review contract, eight base lenses,
44 stable rule IDs, model profiles or adapter mechanics. Research and grader
material stay outside installed instructions. No behavioral gain is claimed.

## Decision, owner and counterexample

| Question | Instruction owner | Contrasts |
| --- | --- | --- |
| Can an Effect-local event replace a manual latest-value adapter? | react-effects / function-cohesion | D01-D02; older consumer guard D25 |
| Do correlated setters express one existing interaction? | react-state-transitions / representation | D03-D04 |
| Must callers decode a hidden child-position/type protocol? | react-composition / api-clarity | D05-D06 |
| Does a transparent provider add a meaningful API? | react-composition / api-clarity | D07-D08 |
| Is a mount gate only excluding browser-dependent UI from SSR? | react-effects / function-cohesion | D09-D10 |
| Can loading/result/recovery be understood as local branches? | next-ui-boundaries / control-flow | D11-D12 |
| Can a framework mechanism replace custom recovery coordination? | next-ui-boundaries / control-flow | D13-D14; older Next guard D26 |
| Are route types a second manually maintained route contract? | next-boundaries / abstractions | D15-D16 |
| Does state placement reflect actual navigation/durability needs? | next-data-ownership / data-flow | D17-D18 |
| Is JS state only mirroring DOM/primitive state for classes? | tailwind-state / data-flow | D19-D20 |
| Does layout plumbing only describe available container space? | tailwind-layout / abstractions | D21-D22 |
| Are local primitive-part roles and backend contracts visible? | shadcn-composition / api-clarity | D23-D24; missing-source guard D27 |

D28 preserves unsupported Vue-SFC scope. D29 checks that a new profile inherits
its disabled owner rule. D30 checks explicit duplication-only narrowing. These
are inputs and grading criteria, not recorded agent outputs.

The four additional profiles fill distinct recipient gaps. Representation stays
conditional, not a ninth universal base pass. UI control flow cannot be delivered
only to a data-flow worker; styling-state ownership cannot be hidden in a
class-duplication profile. A broad Tailwind request can involve several owners,
while a variants-only request remains narrow. Each child still has one lens,
neutral source and effective team policy; the parent reconciles overlap.

## React: remove obligations, not merely older syntax

[React 19.2](https://react.dev/blog/2025/10/01/react-19-2) introduces Effect Events.
[The API contract](https://react.dev/reference/react/useEffectEvent) separates an
Effect's event work from its reactive lifetime. Our addition asks about actual
latest-value plumbing, with a real-dependency counterexample. Ref update timing
and non-Effect callers can prevent the proposed replacement. This is not a stable
callback utility or a dependency-suppression recipe.

[Reducer guidance](https://react.dev/learn/extracting-state-logic-into-a-reducer)
supports considering a named transition owner when updates are scattered.
Representation advice names relationships already present; independent settings
remain independent. No action-per-setter protocol, new domain restrictions or
mandatory state library follows. [cloneElement alternatives](https://react.dev/reference/react/cloneElement)
provide another question: would explicit child roles expose an otherwise hidden
contract? Purposeful primitive adaptation remains valid.

[React 19.3](https://react.dev/blog/2026/09/09/react-19-3) enables an RSC renderer to
render Context imported from a client module without a forwarding-only provider.
The client still creates Context. The profile requires real integration and
consumer support, and retains stateful or meaningful providers. The new spelling
alone supplies no maintenance benefit.

[use(browser())](https://react.dev/reference/react-dom/browser) can replace some
browser-only mount gates, but its server Suspense fallback and initial-client
behavior are material. D09 deliberately does not license a claim of identical
timing. Meaningful server output and post-commit requirements are counterexamples.
A version gate identifies a possible remedy, not permission to change behavior.

## Next: readable branches, lifetimes and framework contracts

[Loading conventions](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
and [error handling](https://nextjs.org/docs/app/getting-started/error-handling)
make branch scope part of composition. Our criterion is local comprehension of
existing waiting/result/recovery decisions, not more boundaries or faster streams.
Moving awaits or fallback boundaries can change the visible sequence.

[catchError](https://nextjs.org/docs/app/api-reference/functions/catchError) is
stable in 16.3 and offers component-level recovery. The new profile compares
custom coordination with that mechanism without equating different reset/fetch
contracts. Missing legacy implementation in D13 must remain a remedy evidence
gap; `error.tsx` does not need another boundary wrapper.

[Route-aware helpers](https://nextjs.org/docs/app/api-reference/config/typescript)
can remove manually maintained route shape duplication. Existing generation and
type inclusion are evidence, not work the reviewer may execute. Domain/public
component APIs should not be coupled to generated Next types merely to standardize
spelling. Their accepted calls and awaited parameter relationships still matter.

[Activity-backed navigation](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
retains some recent hidden-route state under the established configuration but
cleans/recreates Effects and can evict older routes. Our question is who owns the
needed lifetime. This is not a promise of durable persistence or permission to
replace session/URL ownership, relocate continuous operations or remove a store.

## Tailwind: use the state and space contract already present

[State variants](https://tailwindcss.com/docs/hover-focus-and-other-states) can
sometimes replace JS that only mirrors a native/primitive state for styling.
Actual DOM scope, attribute meaning and every consumer must be inspected. State
with behavior beyond classes remains state; a render-prop class function may
already consume the single correct owner. No invented ARIA flags or visual audit.

[Container queries](https://tailwindcss.com/docs/responsive-design) can localize
layout governed only by component space. This is an alternative to unnecessary
placement/measurement plumbing, not an automatic replacement for viewport rules
or user density. Existing box/axis, thresholds, containment and initial rendering
constrain the remedy. Older Tailwind setups need their own support evidence.

Existing decisions about semantic tokens, incidental repetition and complete
utility names remain unchanged. No compulsory CVA, global CSS extraction, design
system migration or local-to-packaged `cn` replacement is added.

## shadcn: inspect all actual bases and their local composition

[React Aria became a shadcn base](https://ui.shadcn.com/docs/changelog/2026-07-react-aria)
in July 2026. [Its styling contract](https://react-aria.adobe.com/styling) includes
stateful render props, functional slots and interaction-aware data attributes.
These extend concrete preservation guidance beyond Radix and Base UI. A package
list alone cannot establish the local implementation or its forwarding behavior.
The actual files remain authoritative evidence; installed copies are not
regenerated as a review action.

[Component composition documentation](https://ui.shadcn.com/docs/changelog/2026-04-component-composition)
is useful background for part relationships, not authority to overwrite a local
API. The positive question is whether names and contracts expose the primitive
roles or force callers to decode feature-specific plumbing. Useful customization,
explicit library render props and distinct backend semantics are retained.

## Vue research, deliberately not activation

The accepted audit also considered Vue, without proposing to claim support for
`.vue` from the existing TS/TSX routing. [Computed properties](https://vuejs.org/guide/essentials/computed.html)
can name a derived template value; [script setup macros](https://vuejs.org/api/sfc-script-setup.html)
can express props, emits, slots and an existing model contract. They do not justify
replacing an independent draft with immediate two-way binding.
[Composables](https://vuejs.org/guide/reusability/composables.html) have their own
reactivity-preserving return conventions, such as an object of refs for consumers
that destructure. React's callback/Effect model must not be transferred by analogy.
Actual Vue support needs SFC acquisition, framework context and contrasting
reactivity/template cases. D28 records the current scope boundary instead of
pretending this research adds a Vue runtime profile.

## Evidence limits

This is a source-backed, sequential authoring audit. The baseline/candidate and
native-host comparisons in [the protocol](README.md) remain NOT RUN. Contrasts
include both useful-change opportunities and retention/uncertainty outcomes;
mechanical tests can only establish their identity, routing and package isolation.
The current PR's CI is the source of whole-repository check results. No release,
merge or marketplace publication is part of this change.
