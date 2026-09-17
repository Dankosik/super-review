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

Resolve aliases and the actual primitive backend per component. Radix composition
commonly uses `asChild`; Base UI uses `render`; React Aria has its own slots,
render props and interaction state. Mixed bases are possible. Do not translate
between them from the shadcn name alone. Keep the local component's supported
composition, ref and prop forwarding, event merge/default-prevention behavior,
controlled/default values, and `className`/variant override semantics. Inspect
relevant `cn`/variant helpers. A missing local implementation is a concrete context
gap, not permission to fetch an unrelated latest component or regenerate it.

**Roles, not opaque plumbing.** When wrappers require callers to know hidden child
positions or re-encode primitive slot roles, an explicit feature composition can
make that contract visible. Preserve useful primitive customization and established
consumer APIs. Component-part names and relationships should reveal which element
triggers, labels, displays or coordinates the operation; an upstream composition
example is background, not authority to overwrite the local implementation.

For React Aria Components, `className`, `style` and children can be state-dependent
functions. Keep their state arguments and default-value composition; do not
stringify a function through `cn` or narrow a supported render prop to a string
just to simplify types. `slot` can carry a functional role, and `data-hovered` /
`data-pressed` are not plain CSS hover/active across mouse, touch and keyboard.
Inspect actual forwarding before changing these contracts. An explicit render
prop consuming primitive state may already be the clearest API.

When simplifying trigger/content, form field or overlay composition, retain DOM
semantics, labels/descriptions, ref/focus ownership, portal/provider relationships,
and meaningful `data-state`/`data-slot` styling hooks. Do not replace these with
hand-rolled click handlers or strip attributes because they look verbose. A
form adapter should preserve the existing form library's field/value/ref contract;
choosing another form library is not API clarification. Source-supported reading
burden is required, not a hypothetical accessibility defect or a visual redesign.
Whether `cn` is local or packaged does not by itself justify migration.

Background: [open code and composition](https://ui.shadcn.com/docs),
[local configuration](https://ui.shadcn.com/docs/components-json),
[semantic theming](https://ui.shadcn.com/docs/theming),
[Radix composition](https://www.radix-ui.com/primitives/docs/guides/composition),
[Base UI composition](https://base-ui.com/react/handbook/composition),
[React Aria base](https://ui.shadcn.com/docs/changelog/2026-07-react-aria),
[React Aria contracts](https://react-aria.adobe.com/styling).
