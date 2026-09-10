# Java review support and design rationale

Java uses the same eight base questions, two source-selected lenses and four
owner profiles as Go, but separate domain resources and `java.*` identifiers.
See the [language router](../skills/super-review/references/languages.md).
A mixed PR receives language-specific task packets; Go instructions and existing
`go.*` rule identities are not renamed or imposed on Java. No extra all-purpose
Java-idioms agent or new review stage is introduced.

The goal is useful readability and maintainability advice, not a bug, security,
performance, test, or framework-migration review. A record, stream, builder,
interface, or immutable object is useful only when it clarifies the actual code
and preserves the relevant contracts. Keeping a clear loop or class is a valid
outcome. Rule refinements and disables use the existing team-policy mechanism;
see [the Java example](../examples/team-rules/java.md).

## Research translated into decisions

| Evidence | Consequence for review |
| --- | --- |
| [Google Java Style](https://google.github.io/styleguide/javaguide.html) | Familiar names and useful API documentation; no implicit adoption of a formatter or blanket style edits. |
| [javac --release](https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html), [Maven compiler release](https://maven.apache.org/plugins/maven-compiler-plugin/examples/set-compiler-release.html), [Gradle toolchains](https://docs.gradle.org/current/userguide/toolchains.html) | Determine module/source-set compatibility from committed configuration, not the reviewer's JDK or a neighboring module. Do not execute builds to infer it. |
| [Records](https://dev.java/learn/records/) | Consider transparent value carriers when they remove positional decoding, not as universal entity or bean replacements. Preserve component, equality and accessor contracts. |
| [Optional](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html) | Make meaningful absence visible at return boundaries without wrapping every field or parameter. Eager and lazy fallback are different operations. |
| [Streams](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html), [Stream API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html), [Lists](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html) | Compare pipelines with loops by visible transformations. Preserve laziness, order, mutation, null acceptance and returned collection capabilities. |
| [Try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) | Clarify owned lifetimes without closing borrowed resources or assuming equivalent exception suppression. |
| [Spring dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html), [Spring proxies](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html) | Make required dependencies visible where useful; preserve actual lifecycle and interception boundaries rather than moving annotations mechanically. |

The linked documentation is primary background, not a requirement to upgrade to
its current version. The instructions synthesize decisions rather than copying
a style-guide checklist. The reviewer need not reopen these pages on every PR.

## Acquisition boundaries

The shared reader accepts handwritten `.java` alongside `.go`. It reads Maven
POMs, Gradle build/settings/convention scripts, Gradle properties/version catalogs,
Go module files and Markdown as context, never as commands. Java tests in standard
`src/test`, `src/testFixtures`, `src/integrationTest` and `src/androidTest` roots
and standard generated-output roots are excluded. A generated/do-not-edit marker
in leading Java file comments is excluded by both source reads and search.

These are conservative acquisition heuristics, not a Maven/Gradle interpreter or
Java parser. Custom test/generated source sets require committed context and
explicit exclusions. Names containing `Test`, a method annotation, or a string
containing a generated marker do not exclude a handwritten production file.
Unavailable external conventions, dynamic build configuration, reflection users,
and framework contracts remain evidence gaps; no inference from an empty search.

## Verification

The Java evaluation suite (`evals/java/README.md` in the source repository) keeps neutral source packets
apart from expected decisions. Mechanical tests exercise inventory/source/search,
Go regression boundaries, language resource allowlists, profile ownership, stable
IDs, and byte-identical native resources. They do not prove model judgment.

The native Claude and Codex resources and bundled readers are generated with
`bun run build`; OpenCode packages the same canonical skill and shared reader.
Use `bun test`, `bun run typecheck`, `bun run validate`, and `bun run package` for
repository development. These commands are not authorized during a user's code
review. This addition does not publish a release or change any existing Go rule ID.
