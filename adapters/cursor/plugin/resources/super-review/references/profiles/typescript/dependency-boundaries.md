# Dependency boundaries

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**Explicit module seams.** Inspect construction, imports, and consumers so each
module states the capabilities it actually uses.

- **Ambient or transport leakage**: domain logic reaching into global config or
  framework/transport objects -> pass a small structural capability or adapt at
  the seam rather than inventing one-implementation DI factories.
- **Barrel and client-graph coupling**: runtime barrels (`index.ts`) or shared
  `"use client"` helpers coupling lightweight callers or client subtrees to
  server-only modules, stateful Hooks, or heavy UI widgets (editors, charts,
  icon packs) -> import direct module entry points so those graphs stay
  separate.
- **Opaque re-export forwarding**: pass-through value/type wrappers with no
  compatibility or init role -> re-export directly after verifying runtime
  versus type usage (`import type`, classes/enums used as values, `.d.ts`/`.d.mts`/`.d.cts`
  `exports` conditions, and `paths` emit behavior).

**Keep when:** a direct import already states the real dependency, a barrel or
facade owns a public package contract or initialization order, side-effect
imports or decorator/module-augmentation metadata are load-bearing, or missing
package/consumer context leaves ESM/CJS conditions unverified.
