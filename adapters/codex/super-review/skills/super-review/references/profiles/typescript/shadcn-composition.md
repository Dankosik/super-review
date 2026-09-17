# shadcn/ui composition

Owner: api-clarity
Rule: ts.api.express-the-call

**A predictable local primitive.** Read the checked-in component and its actual
consumers, not an assumed upstream API. Does the primitive expose a coherent
visual/interaction contract, or must callers understand a feature-specific
workflow and many forwarded flags? A feature composition can own that workflow
while the primitive keeps meaningful reusable props. Directly customizing the
owned primitive is also valid; do not require a wrapper around every copied file
or erase deliberate product styling in the name of upstream consistency.

Resolve aliases and the actual primitive backend. Radix composition commonly uses
`asChild`; Base UI uses `render`. Do not translate between them from the shadcn
name alone. Keep the local component's supported composition, ref and prop
forwarding, event merge/default-prevention behavior, controlled/default values,
and `className`/variant override semantics. Inspect relevant `cn`/variant helpers.
A missing local implementation is a concrete context gap, not permission to fetch
an unrelated latest component or regenerate it with the CLI.

When simplifying trigger/content, form field or overlay composition, retain DOM
semantics, labels/descriptions, ref/focus ownership, portal/provider relationships,
and meaningful `data-state`/`data-slot` styling hooks. Do not replace these with
hand-rolled click handlers or strip attributes because they look verbose. A
form adapter should preserve the existing form library's field/value/ref contract;
choosing another form library is not API clarification. Source-supported reading
burden is required, not a hypothetical accessibility defect or a visual redesign.

Background: [open code and composition](https://ui.shadcn.com/docs),
[local configuration](https://ui.shadcn.com/docs/components-json),
[semantic theming](https://ui.shadcn.com/docs/theming),
[Radix composition](https://www.radix-ui.com/primitives/docs/guides/composition),
[Base UI composition](https://base-ui.com/react/handbook/composition).
