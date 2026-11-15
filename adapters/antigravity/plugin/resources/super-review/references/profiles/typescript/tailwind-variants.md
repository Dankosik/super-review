# Tailwind design knowledge

Owner: duplication
Rule: ts.duplication.share-knowledge

**Shared design decisions.** Trace component variants, entry CSS tokens, and
consumers to separate one shared UI concept from incidental class overlap.

- **Dynamic utility fragments**: interpolated strings such as `` `bg-${tone}-500` ``
  or `` `grid-cols-${n}` `` that static source scanning cannot see -> replace
  with complete literal class maps, and keep full literal utility names in every
  proposed refactor.
- **Semantic token bypass**: hardcoded palette or hex utilities (`bg-white`,
  `text-gray-900`, `bg-[#...]`) used where entry CSS and sibling components
  establish a semantic light/dark token (`bg-background`,
  `text-muted-foreground`) -> use the established semantic token.
- **Duplicated variant maps**: the same multi-state utility set copied across
  sites encoding one maintained decision -> extract a plain map, local helper,
  or component using the project's existing composition tool (`cn`, CVA, or
  plain objects) rather than broad `@apply` rules.

**Keep when:** long literal class strings are independent, equal colors serve
distinct roles (brand, chart, one-off arbitrary values, runtime CSS variables),
or the project uses Tailwind v3 configuration rather than v4 `@theme`. Preserve
variant order, dark/responsive/container/state selectors, `group`/`peer` scope,
specificity, consumer `className` override precedence, and focus/motion styles.

Background: [utility composition](https://tailwindcss.com/docs/styling-with-utility-classes),
[theme variables](https://tailwindcss.com/docs/theme),
[source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files),
[custom styles](https://tailwindcss.com/docs/adding-custom-styles),
[v3/v4 differences](https://tailwindcss.com/docs/upgrade-guide).
