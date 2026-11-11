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
prove a test. Once evidence identifies an excluded file, do not review it, though
you may search it for uses of production code, and record the exclusion; unavailable callers are not proof that an API has no users.

**Craft.** Read the source against how an experienced Java author would write
the same operation today, under the module's language and API baseline, by the
defaults of Effective Java and the JDK's own API design. Their core: minimal
accessibility and mutability; an object ready to use once constructed, with its
required dependencies passed to the constructor; values modeled as records or
small final classes, and closed sets as enums or sealed types; empty collections
rather than `null`, and `Optional` only as Effective Java advises; exceptions
that carry their cause; owned resources closed by try-with-resources; and the
JDK's vocabulary, within the baseline, before the project's own. A `switch`
expression over a closed set names every case without `default`, so the
compiler reports a new constant or subtype; a `switch` statement over an enum,
even in arrow form, gets no such check. Where the source
falls short of this and the gap costs a reader or the next change something you
can name, report it, however small.

**Idiom owners.** Idiom is evidence inside the assigned lens, not a separate
pass. Guard clauses, `switch` forms and exception handling belong to
control-flow, and a check for a case the code already rules out to its
defensive-checks profile; final locals, mutation, streams versus loops,
collection ownership and try-with-resources to data-flow; a JDK or project
operation replacing handwritten mechanics to duplication; signatures, overloads,
`Optional` results and checked exceptions to api-clarity; records, enums, sealed
types and value classes to representation; name forms to naming; helpers,
classes, inheritance and interfaces to function-cohesion and abstractions; the
project's established way of handling a concern to conventions; where a
declaration lives to placement. Report an idiom under the lens that owns it
and leave the others to their owners.

**Judgment.** An idiom earns a recommendation by what it removes: a null check,
a branch, a mutable field, a second check, another place to edit. Favor
understandable objects, methods, transformations, and actual
calls, not maximum use of patterns or recent language features. Ordinary classes,
local mutation, loops, and direct constructors can already be clear. Records,
sealed hierarchies, streams, `Optional`, `var`, builders, dependency injection,
and an interface per class are not mandatory upgrades. Follow effective team
style; external guides are background, not silently adopted policy. Committed
Checkstyle, PMD, Error Prone or SpotBugs configuration is the project's adopted
choice: do not recommend what it denies, and leave listing its violations to the
project's own checks. No formatting, import-order, or modifier churn without a
concrete burden or an effective convention. Do not run formatters or linters.

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
references and an unmodifiable collection do not imply deep immutability.
Replacing `Arrays.asList`, `new ArrayList` or `Collectors.toList()` with
`List.of`, `Set.of`, `Map.of` or `Stream.toList()` can change mutability, null
handling, duplicates and order under their Javadoc contracts, and
`Map.computeIfAbsent` is not a drop-in for get-then-put when the function returns
`null` or touches the map. Public
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

Use [language routing](../languages.md) to select the Java implementation of the
assigned lens and owner profiles. The shared workflow owns coverage; these are
not extra workers or a mandatory all-module packet.

For established Spring mechanisms, use [Spring routing](../spring.md) and its
additional context. Keep the assigned Java question and use framework contracts
only where they explain the observation or constrain its proposed remedy.
