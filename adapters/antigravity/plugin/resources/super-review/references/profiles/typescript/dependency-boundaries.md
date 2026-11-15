# Dependency boundaries

Owner: abstractions
Rule: ts.abstractions.earn-the-boundary

**Explicit dependencies.** Does a module expose the capabilities its work needs,
or make readers discover ambient configuration and transport/framework objects?
Inspect construction and actual consumers. A small structural capability or a
boundary adapter can remove knowledge from the core; a parallel interface and
factory for every module often add it instead.

Distinguish type dependencies from runtime imports before proposing `import type`
or reorganizing exports. Preserve intentional side-effect imports, decorator
metadata, module augmentation, and the project's emitter/module-resolution behavior.
For a public-boundary remedy, connect the source declaration, runtime entry point
and declaration selected by the consumer's import/require conditions. `.d.ts`,
`.d.mts` and `.d.cts` describe module formats, not interchangeable packaging styles;
a class or enum may be consumed as a value as well as a type. `paths` resolution
does not itself rewrite emitted specifiers. A direct type/value re-export can remove
opaque forwarding when these contracts match; retain a facade that owns a real
compatibility or initialization responsibility. Missing artifact evidence limits
that remedy rather than triggering a package audit or a guessed ESM/CJS rewrite.

Do not demand a barrel ban, dependency-injection container, or ESM migration.
Keep a direct import when it states the real dependency most clearly. Missing
package or consumer context limits the change, not the need to disclose it.
