# Tailwind presentation state

Owner: data-flow
Rule: ts.data.make-transformations-visible

**One owner, including in the DOM.** Is JavaScript mirroring browser or primitive
state solely to choose classes? Trace every reader and writer of that mirror and
inspect the actual element or local primitive exposing the state. Existing
`data-*`, `aria-*`, native state variants, `group` or `peer` can sometimes remove
a setter/callback synchronization protocol while leaving the visual decision
near its element. Show the redundant ownership removed, not just fewer lines.

Keep state that also drives content, loading, analytics, persistence, controlled
inputs or other behavior. A stateful primitive is not automatically an uncontrolled
one; do not change its ownership merely to style it. A readable render-prop class
function may already consume the single source of truth and needs no replacement.
Do not create ARIA attributes as styling-only flags or add arbitrary data attributes
when the element already provides the needed contract.

Preserve the exact state meaning, attribute presence versus value, ancestor/sibling
selector scope, DOM/portal boundaries, specificity, override rules and initial
presentation. Inspect the actual primitive backend: React Aria's `data-hovered`
and `data-pressed` are not interchangeable with `:hover` and `:active` across
input modalities. Missing state/forwarding evidence limits that remedy; do not
invent attributes from a component name. Use utility syntax available in the
owning Tailwind version and configuration. No accessibility or visual audit.

The duplication owner handles shared design decisions; this task handles redundant
state ownership. Keep those questions separate even when they touch the same JSX.

Background: [state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
and [React Aria styling](https://react-aria.adobe.com/styling).
