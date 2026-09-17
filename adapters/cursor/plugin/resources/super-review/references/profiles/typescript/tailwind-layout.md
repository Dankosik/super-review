# Tailwind layout boundaries

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**A component's space or a caller's decision?** Do callers pass placement flags
or measure an element only to select that component's layout? Inspect consumers,
measurement targets and CSS context. Where the contract is truly the available
container size, an established container query can remove parent-to-child width
plumbing and keep the layout decision with the component. Identify the obligation
that disappears; do not treat every responsive prop as a smell.

Retain an explicit user density/mode, a viewport-wide breakpoint or dimensions
used for canvas/data/interaction logic. Container size and viewport size are not
the same contract. Replacing one with the other is a design change unless existing
source establishes that it preserves the intended behavior. A plain responsive
class string may be clearer than another named layout component.

Check actual Tailwind version, configured query support, named container ancestry,
threshold units/values and the measured box/axis. Preserve initial presentation,
DOM/containment effects, portal boundaries, state and override behavior; do not
remove a JavaScript measurement whose non-style consumers still need it. Tailwind
v4 supports container utilities natively; do not assume that support or prescribe
installing a plugin in an older setup. Unknown layout context leaves the affected
remedy unresolved. No browser execution, visual redesign or performance claim.

Background: [container queries](https://tailwindcss.com/docs/responsive-design)
and [version differences](https://tailwindcss.com/docs/upgrade-guide).
