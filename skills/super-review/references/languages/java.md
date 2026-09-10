# Java context

**Compatibility.** Establish the changed module/source set's supported language
and API baseline at H from its Maven or Gradle configuration and relevant parent,
root, property, or convention files. `--release` constrains language and platform
APIs; `source`/`target` and the JDK running the build are not equivalent evidence.
A newer toolchain or sibling module does not authorize newer syntax here. Account
for explicit preview flags, framework/library versions, annotation processors,
and `module-info.java` where a proposed change depends on them. Read configuration
as text only: do not execute Maven, Gradle, wrappers, processors, or builds to
resolve inheritance. Missing/dynamic/external configuration limits that advice;
it does not license a guessed version or an upgrade.

**Scope.** Review handwritten production `.java`, not tests or generated output.
Use source-set/build evidence for custom layouts. Standard test roots and explicit
generated-file headers help the reader exclude files mechanically, but are not
an exhaustive classifier. A name such as `TestFactory.java` does not by itself
prove a test. Once evidence identifies an excluded file, stop inspecting it and
record the exclusion; unavailable callers are not proof that an API has no users.

**Judgment.** Apply Java knowledge inside the assigned lens, not an extra broad
idiom pass. Favor understandable objects, methods, transformations, and actual
calls, not maximum use of patterns or recent language features. Ordinary classes,
local mutation, loops, and direct constructors can already be clear. Records,
sealed hierarchies, streams, `Optional`, `var`, builders, dependency injection,
and an interface per class are not mandatory upgrades. Follow effective team
style; external guides are background, not silently adopted policy. No formatting,
import-order, or modifier churn without a concrete burden or an effective
convention. Do not run formatters or linters.

**Reuse.** Compare changed handwritten mechanics with existing project helpers
and supported JDK operations. Name the exact replacement and the contract that
makes it clearer; retain domain adaptation. A loop can communicate ordering,
early exit, mutation, or checked failure better than a pipeline. Do not add a
library, reflection, or generic framework merely to remove a few repeated lines.
Use reliable API knowledge and permitted evidence; narrow uncertain advice
rather than inventing APIs or requiring web/tutorial reads on every review.

**Preservation.** Inspect only properties implicated by the proposed change:
null versus absence/empty, identity versus value equality, overload/override and
generic signatures, mutability and aliasing, encounter order, evaluation timing,
exception types/causes, and resource/transaction ownership. A record's component
references and an unmodifiable collection do not imply deep immutability. Public
or protected changes also need available consumer, reflection, serialization,
and framework contracts: literal call search alone cannot establish safety.
Do not assume Lombok-generated members, bean names, ORM accessors, proxies, or
binding annotations are redundant boilerplate. Keep compatible advice when that
context is missing; do not claim tested equivalence or performance gains.

Background: [Google Java style](https://google.github.io/styleguide/javaguide.html),
[javac options](https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html),
[Maven release](https://maven.apache.org/plugins/maven-compiler-plugin/examples/set-compiler-release.html),
and [Gradle toolchains](https://docs.gradle.org/current/userguide/toolchains.html).
These explain contracts, not a requirement to adopt their current version.
