# Spring context

Apply inside the assigned Java quality question under [Spring routing](../spring.md).
The shared contract and Java context own judgment, supported source, authority,
and read-only scope: Spring contracts explain a demonstrated reading burden or
constrain its remedy rather than adding a framework-correctness, transaction,
query-performance, or security audit.

## Baseline and capability traps

Read the owning module's Maven parent/BOM/`dependencyManagement`, Gradle
platform/catalog/convention files, committed lockfiles, and overrides at the
pinned revision as text (never run Maven/Gradle, resolve dependencies, or infer
the effective library set from a Boot plugin or the build JDK alone). Record
only implicated facts: Framework and Boot versions (Boot may be absent), actual
MVC vs WebFlux server/client stack, Spring Data module, Jakarta Persistence API
and ORM provider, validation and JSON configuration, annotation processors, and
proxy/transaction settings. Missing baseline evidence limits only version-sensitive
advice.

Guard against framework folklore when judging remedies:
- **Constructor binding vs injection**: `@ConfigurationProperties` binding and
  bean dependency injection are distinct construction paths; a single-constructor
  `@Autowired` can deliberately opt out of inferred properties binding.
- **Selection, validation, and routing**: `@Fallback` or parameter-name
  autowiring (`-parameters`) requires verifying baseline/compiler support and
  never replaces runtime per-message routing; MVC `MethodArgumentNotValidException`,
  WebFlux `WebExchangeBindException`, and AOP method validation have distinct
  contracts; declarative API versioning applies only on a verified Framework
  baseline with unchanged HTTP contracts.
- **Persistent records**: JPA `@Entity` classes cannot be Java `record`s; record
  `@Embeddable` or ID types require verifying both the declared Persistence API
  version and actual provider support rather than assuming portable spec behavior
  from a provider extension.

## Implicated preservation contracts

- **Wiring and configuration**: inspect component/import discovery, bean
  names/aliases, qualifiers, `@Conditional*` back-off/ordering, provider lookup,
  and scope. Full `@Configuration` proxies and lite/`proxyBeanMethods = false`
  differ whenever `@Bean` methods call one another directly, and a bean factory
  method or annotation can satisfy an external registration contract with zero
  literal Java callers.
- **Operations and transactions**: trace the real entry point, proxy mode
  (class vs interface, proxy vs AspectJ), and transaction owner. Self-invocation
  inside a bean creates no separate proxy boundary, though it still runs inside
  an already active outer transaction; imperative (`TransactionTemplate`) and
  reactive (`TransactionalOperator`) transactions have distinct lifetime and
  subscription models, and pure helpers need not become beans.
- **Entities and value shapes**: separate identity-bearing managed entities,
  detached objects, value types, and query projections, preserving access mode,
  provider constructors, mutability, generated IDs, serializer names, and lazy
  boundaries. Interface twins, DTO/entity merging, universal mappers, annotation
  deletion, `record` conversion, and declarative rewrites earn acceptance only by
  removing a concrete burden under identical contracts.

Primary references (consult only when verifying an implicated contract):
[Boot dependency coordinates](https://docs.spring.io/spring-boot/3.5/appendix/dependency-versions/coordinates.html),
[Boot 3 migration](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide),
[autowiring qualifiers](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html),
[transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html),
[Persistence 3.2 specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2),
and [Hibernate 6.6](https://docs.hibernate.org/orm/6.6/introduction/html_single/).
