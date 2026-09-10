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
Do not demand a barrel ban, dependency-injection container, or ESM migration.
Keep a direct import when it states the real dependency most clearly. Missing
package or consumer context limits the change, not the need to disclose it.
