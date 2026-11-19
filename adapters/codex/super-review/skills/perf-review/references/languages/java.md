# Java context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Java code states its cost

Javadoc complexity or allocation notes, JMH benchmarks (`@Benchmark`), committed
JFR/async-profiler flamegraphs or SQL `EXPLAIN` plans, batch-size and pool
settings (`application.yml`/`properties`), and `--release` / `sourceCompatibility`
in `pom.xml` or `build.gradle*`.

## Verify in source

The version in use is what Maven (`pom.xml`) or Gradle (`gradle.lockfile`,
version catalog, `build.gradle*`) resolves, never memory. Inspect dependency
sources already on disk (`~/.m2/repository`, `~/.gradle/caches`) and local JDK
sources when present. Verify both the current cost and the cheaper form's
behavior, and check API and runtime semantics (including virtual-thread pinning
behavior on the target JDK) against the project's declared Java version. Do not
run builds or download artifacts. When needed source is absent on disk, mark the
step as an assumption: name the artifact, the version, and the question its
source would answer.

## Questions to settle before claiming

- **ORM and JDBC round trips**: do lazy associations inside loops or
  serializers trigger N+1 queries, do per-item writes bypass JDBC batching
  (check whether the ID generator disables batching), or do queries hydrate full
  managed entities only to count, test existence, or read scalar projections?
- **Boxing, strings, and collections**: do boxed streams/collections, loop
  string concatenation, or unsized collections allocate per element where
  primitive streams, reused builders, or pre-sizing keeps behavior? Check
  whether pre-sizing trusts an uncapped external length.
- **Repeated heavy initialization**: does per-call regex compilation
  (`Pattern.compile`, `String.matches`/`replaceAll`/`split`) or per-request
  construction of reusable thread-safe clients/mappers repeat reflection or
  automaton setup?
- **Threads, locks, and executors**: does blocking I/O or waiting run on a
  non-blocking event loop, does blocking inside `synchronized` pin virtual-thread
  carriers on the project's target JDK, or does a transaction/lock stay held
  across an outbound network call?

## Java boundaries

- **Finding**: compiles and runs on the declared Java level and dependencies in
  `pom.xml` or `build.gradle*` while keeping transaction, error, and API
  contracts.
- **Tradeoff**: adds a dependency, changes transaction/batch failure boundaries,
  holds cached state longer, or uses unsafe/reflection internals.

## Not a finding in Java

Style preferences, or replacing readable streams with loops over tiny bounded
collections without a hot multiplier. Claims about HotSpot C2 escape analysis,
scalar replacement or JIT inlining without a committed or user-supplied JFR/JMH
profile: these are claims about code generation.
