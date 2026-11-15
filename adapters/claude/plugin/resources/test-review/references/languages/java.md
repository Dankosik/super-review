# Java context

Go, TypeScript, Rust and Java have language contexts in this review. Tests in
another language are listed as excluded.

## Where tests live

- Maven/Gradle `src/test/java`: JUnit 5 (`@Test`, `@ParameterizedTest`,
  `@Nested`), JUnit 4, TestNG, Spring slice/integration tests (`@WebMvcTest`,
  `@DataJpaTest`, `@SpringBootTest`), and Testcontainers suites.
- Skipped or unexecuted tests: `@Disabled` / `@Ignore`, `Assumptions.assumeTrue`
  that always skips in CI, `@Tag` groups excluded by Surefire/Failsafe/Gradle,
  `*IT.java` classes when only Surefire (`*Test`) runs, and Surefire
  `rerunFailingTestsCount` / Gradle test-retry plugins hiding flakes.

## Choosing a mutant

Java's compiler enforces checked exceptions, method signatures, sealed switch
exhaustiveness and final-variable assignment: a mutant that fails `javac`
proves nothing about the tests.

Forms a plausible Java mistake takes:

- `<` for `<=`, `BigDecimal.equals` in place of `compareTo` == 0, `==` on boxed
  `Integer`/`Long`, or `int` overflow before widening to `long`.
- Changing an exception type so Spring's `@Transactional` no longer rolls back
  (or omitting `rollbackFor`), or self-invoking a `@Transactional`/`@Async`
  method on `this`.
- Swapping `Optional.orElseGet` for eager `orElse` with a side effect, or
  replacing `.orElseThrow(...)` with `.orElse(defaultValue)`.
- Dropping a field from a DTO mapper, JPA specification predicate, `@Cacheable`
  key, or `equals`/`hashCode`.
- Catching and logging an exception while returning `200 OK` or an empty list,
  or dropping `@Valid` on a nested collection/request parameter.

## Writing a witness

Write the witness in the module's existing JUnit/AssertJ/MockMvc/Testcontainers
idiom. Inject `java.time.Clock` rather than calling `Thread.sleep`; synchronize
concurrent work with `CountDownLatch`, `CompletableFuture` or bounded Awaitility
predicates over observable state; and in `@DataJpaTest` / `@Transactional`
tests flush and clear the `EntityManager` (`flush()` + `clear()`) when pinning
persistence mappings so assertions read the database rather than the first-level
cache! Assert observable responses, persisted state or thrown causes rather than
`Mockito.verify` choreography on internal collaborators.

## Reading a test for stability

`@Transactional` tests that never `flush()` (hiding SQL constraint violations),
shared mutable state across `@SpringBootTest` cached contexts or uncleaned DB
tables/Testcontainers, `HashMap`/`HashSet` iteration order asserted as a list,
`LocalDateTime.now()` / default JVM timezone, `Thread.sleep` races, and fixed
server ports (`DEFINED_PORT` instead of `RANDOM_PORT`) produce flaky or
false-green tests.

## Dependencies

The version in use is resolved by Maven (`pom.xml`) or Gradle
(`gradle.lockfile`, version catalog, `build.gradle*`). Read dependency sources
already on disk (`~/.m2/repository`, `~/.gradle/caches`) without running builds
or downloads; when absent, record the assumption.

## Not a finding in Java

Generated boilerplate (`record` accessors, Lombok getters) nobody promised
custom behavior on. AssertJ versus JUnit assertion-library style preferences.
