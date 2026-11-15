# Java context

Go, TypeScript, Rust and Java have language contexts in this review. Source in
another language is listed as excluded, not reviewed by analogy.

## Where Java code says what it does

Javadoc (`@throws`, `@return`, nullability notes), nullness and validation
annotations (`@Nullable`, `@NonNull`, `@NotNull`, `@Valid`), sealed hierarchies
and enums, checked and documented unchecked exceptions, Spring/Jakarta mapping
and transaction annotations, SQL/Flyway/Liquibase migrations, and units in
method, field or configuration-property names (`Duration`, `*Millis`, `*Seconds`).

## Semantics to settle before claiming

A candidate that rests on one of these must show it from the source, build
files (`pom.xml`, `build.gradle*`) or the resolved dependency version, not from
memory.

- **Proxy boundaries (`@Transactional`, `@Async`, `@Cacheable`, security).**
  Spring AOP proxies intercept calls entering a bean from outside. Calling a
  annotated method on `this` (including a `private` helper) bypasses the proxy.
  By default `@Transactional` rolls back on unchecked `RuntimeException` and
  `Error`, **not** on checked exceptions unless `rollbackFor` names them;
  catching and swallowing an exception inside the method leaves the transaction
  marked or committed depending on propagation.
- **Nulls, collections and streams.** `List.of`, `Set.of`, `Map.of` and
  `List.copyOf` reject `null` elements with `NullPointerException` and reject
  mutation with `UnsupportedOperationException`. `Arrays.asList` permits `null`
  and `set`, rejects `add`/`remove`, and aliases the backing array.
  `Collectors.toMap` throws `IllegalStateException` on duplicate keys without a
  merge function and throws `NullPointerException` when a mapped value is
  `null`. `Files.lines` and `Files.walk` hold OS descriptors until the returned
  `Stream` is closed.
- **Equality, numbers and dates.** `==` on boxed primitives (`Integer`, `Long`)
  compares object identity outside `[-128, 127]`. `BigDecimal.equals` compares
  both value and scale (`new BigDecimal("1.0").equals(new BigDecimal("1.00"))`
  is `false`; `compareTo` compares numeric value). Mutating fields used by
  `equals`/`hashCode` while an object sits in a `HashSet` or `HashMap` loses the
  entry; JPA entity equality on mutable or unassigned IDs breaks set membership
  across flush. Integer division and `int` multiplication (`timeoutSeconds *
  1000`) overflow in `int` before widening to `long`.
- **Eager fallbacks and async errors.** `Optional.orElse(expr)` evaluates `expr`
  even when a value is present (`orElseGet` is lazy). `ExecutorService.submit`
  stores uncaught exceptions inside the `Future`; dropping that `Future`, or
  throwing from a `void` `@Async` method with no handler, loses the failure
  from callers. `Thread.interrupt()` is cleared when `InterruptedException` is
  caught unless restored.
- **Validation traps.** `@Valid` on a Spring controller parameter rejects an
  invalid payload unless an `Errors`/`BindingResult` parameter immediately
  follows it; bean validation on fields of a `List<T>` requires `@Valid` on the
  container or type use, and respects only active validation groups.

## Dependencies

The version in use is the one Maven (`pom.xml` / lockfile) or Gradle
(`gradle.lockfile`, version catalog, `build.gradle*`) resolves. Read dependency
sources where already present on disk (`~/.m2/repository`, `~/.gradle/caches`)
without running Maven/Gradle or downloading artifacts. When absent on disk,
name the artifact, version and unresolved step as an assumption.

## Not a bug in Java

Style or pattern preferences. Missing null checks on `private` methods whose
in-scope callers already establish non-null inputs. Using checked versus
unchecked exceptions where callers handle them as documented.
