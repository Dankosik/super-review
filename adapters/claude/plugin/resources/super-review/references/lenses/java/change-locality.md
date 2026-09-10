# Java change locality

## java.change.localize-existing-variation

**Locality of change.** Does one already implemented responsibility require
coordinated edits across unrelated classes, dispatch branches, mappings, or
configuration? Trace a concrete existing variation through the changed area.
Prefer a nearby method, cohesive type, or established registration mechanism when
it makes that responsibility easier to locate and change together.

A small enum switch can keep a closed decision visible. A sealed hierarchy can
express an actual closed family with distinct data/behavior, and an existing
interface can support genuine open extension. Choose from present variation
and the supported baseline, not an open/closed slogan or a demand to remove switches.
Do not build registries, plugins, or a class per branch for imagined future cases.

Keep boundaries that change independently: transport, persistence, and domain
shapes may intentionally differ. Before moving packages/types, inspect access
levels, module exports/opens, component scanning, reflective names, serialization,
and available consumers. Relocating code can change framework behavior even
without changing a method body.

Identify the coordinated edits that disappear and the new places a maintainer
must understand. Retain the layout when consolidation only saves files or crosses
independent contracts.
