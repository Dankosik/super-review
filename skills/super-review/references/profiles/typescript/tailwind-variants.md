# Tailwind design knowledge

Owner: duplication
Rule: ts.duplication.share-knowledge

**One design decision.** Do repeated utilities or variant branches encode the
same maintained UI concept, or only look alike? Trace the component variants,
token definitions and actual consumers. Share a named variant map or a coherent
component when it removes coordinated edits to one existing decision. Keep
incidental repetition, a readable long class string, and genuinely independent
styles. Class count/order and dislike of utility-first CSS are not findings.

Use an existing semantic token when source establishes the same role, not merely
the same current color. An intentional one-off arbitrary value or runtime CSS
variable can be clearer than a new global token. Prefer the project's existing
composition helper or plain mappings; CVA, `cn` and `tailwind-merge` are not required
dependencies. Inspect the actual helper and custom configuration before assuming
how overrides merge. Broad `@apply` extraction or global CSS is not the default
cure for duplicated JSX.

Preserve complete, statically detectable utility names when extracting mappings;
do not manufacture class fragments such as `bg-${tone}-500`. Preserve variant
conditions/order, custom tokens, dark/responsive/container/state selectors,
`group`/`peer` scope, arbitrary selectors, specificity, consumer `className`
precedence and motion/focus styles. Read relevant theme/source registration as
context, without claiming a standalone CSS review. Tailwind v4 CSS-first `@theme`
and source rules do not justify migrating a v3 configuration. Do not audit missing
classes, visual alignment, CSS performance or formatter output.

Background: [utility composition](https://tailwindcss.com/docs/styling-with-utility-classes),
[theme variables](https://tailwindcss.com/docs/theme),
[source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files),
[custom styles](https://tailwindcss.com/docs/adding-custom-styles),
[v3/v4 differences](https://tailwindcss.com/docs/upgrade-guide).
