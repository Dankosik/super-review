# Java context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Java code states its cost

Javadoc complexity or allocation notes, JMH benchmarks (`@Benchmark`), committed
JFR/async-profiler flamegraphs or SQL `EXPLAIN` plans, batch-size and pool
settings (`application.yml`/`properties`), and `--release` / `sourceCompatibility`
in `pom.xml` or `build.gradle*`.

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, the
documentation or the resolved dependency version, not from memory.

- **ORM / JDBC round trips (N+1 and row-by-row writes).** Accessing lazy JPA
  associations (`@OneToMany`, `@ManyToOne(fetch = LAZY)`) inside a loop fires one
  SQL query per parent unless fetched together (`JOIN FETCH`, `@EntityGraph`, or
  batch fetching). Calling `save` / `executeUpdate` per item without JDBC
  batching (note: Hibernate disables insert batching on `GenerationType.IDENTITY`),
  or loading full entities into persistence context just to count, check
  existence (`existsBy...`) or project two scalar columns, multiplies round
  trips and managed-entity state.
- **Boxing, strings and collections.** `Stream<Integer>` / `List<Long>` and
  boxed map counters allocate wrapper objects outside small caches where
  `IntStream`/`LongStream` or primitive buffers avoid boxing. String `+` across
  loop iterations (when `javac` cannot fold a single expression) copies prefixes
  each turn (`StringBuilder` reuses one buffer). Pre-sizing `new ArrayList<>(n)`
  and `HashMap.newHashMap(n)` (Java 19+) avoids resize rehashes.
- **Repeated heavy initialization.** `Pattern.compile`, `String.matches`,
  `String.replaceAll` and `String.split` (for non-trivial regexes) compile a
  `Pattern` on every call. Constructing Jackson `ObjectMapper`, `ValidatorFactory`,
  `JAXBContext` or `HttpClient` per request repeats expensive reflection and
  metadata setup on thread-safe types meant to be shared.
- **Threads, locks and reactive/virtual executors.** Blocking I/O or
  `CompletableFuture.join()` on a Netty/Reactor/WebFlux event-loop thread stalls
  all multiplexed connections on that core. On Java 21–23 virtual threads (prior
  to JEP 491 in Java 24), blocking inside `synchronized` pins the carrier OS
  thread (`ReentrantLock` avoids pinning). Holding `@Transactional` or
  `synchronized` across an outbound HTTP/RPC call ties up a DB connection from
  HikariCP or blocks peers for the full network RTT.
- **What a cheaper form may use.** Respect the module's Java language level and
  declared dependencies in `pom.xml` or `build.gradle*`.

## Dependencies

The version in use is resolved by Maven (`pom.xml`) or Gradle
(`gradle.lockfile`, version catalog, `build.gradle*`). Read dependency sources
already on disk (`~/.m2/repository`, `~/.gradle/caches`) without running builds
or downloads; when absent, record the assumption.

## Not a finding in Java

Style preferences, or replacing readable streams with loops over tiny bounded
collections without a hot multiplier. Claims about HotSpot C2 escape analysis,
scalar replacement or JIT inlining without a committed or user-supplied JFR/JMH
profile: these are claims about code generation.
