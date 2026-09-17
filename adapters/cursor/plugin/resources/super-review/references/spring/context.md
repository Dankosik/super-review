# Spring context

Apply inside the assigned Java quality question. The shared contract and Java
context own judgment, supported source, authority and read-only scope. Spring
knowledge explains a demonstrated reading burden or constrains its remedy; it
does not add a framework-correctness, transaction, query-performance or security
audit. Preserve clear code and the project's technical choices.

## Establish the relevant baseline

Use the owning module/source set at the pinned revision, not a sibling service
or the build JDK. Read available Maven parent/BOM/dependencyManagement, Gradle
platform/catalog/convention files, committed locks and explicit overrides as
text. Distinguish a managed version, a declared dependency and an actually used
mechanism. A Boot plugin version alone is not proof of the effective library set.
Do not run Maven/Gradle, resolve dependencies, inspect runtime beans or invent
missing external configuration. Unknown facts limit the affected advice only.

Record only what the proposed change needs: Framework and Boot versions (Boot
may be absent); actual MVC/WebFlux server or client API; Spring Data module;
Persistence API and provider/version; validation provider; JSON mapper/version,
modules and handwritten configuration; processors/generated-member contracts;
proxy mode, transaction manager and applicable scope/registration settings.
The same annotation spelling can participate in different execution models.
A broad dependency inventory is not another review task.

Useful version boundaries, not upgrade recommendations:

- Boot 3 changed constructor-binding conventions. Properties registration and
  dependency injection are different construction paths; single-constructor
  @Autowired can deliberately opt out of inferred constructor binding.
- Framework 6.1 added built-in controller method validation; distinguish it from
  AOP method validation. Name-based autowiring also depends on parameter metadata
  such as -parameters. Framework 6.2 introduced @Fallback; it is not a universal
  replacement for explicit qualifiers or runtime choice.
- Framework 6 supports non-public transactional methods with class-based proxies
  under its documented rules; interface-based proxies differ. Proxy versus
  AspectJ mode, manager selection and configured rollback rules remain material.
- Framework 7 API versioning is an option only on a supported baseline with the
  same existing HTTP contract. It does not justify upgrading or redesigning URLs.
- Persistence 3.2 permits certain record embeddables/ID classes, not record
  entities. Provider-specific support on an earlier API is a different claim.
  Check both the API and actual provider before proposing a persistent shape.

## Preserve only contracts implicated by the recommendation

For wiring changes, inspect component/import discovery, bean names/aliases,
qualifiers, constructor selection, conditions, provider lookup and scope. Boot
properties binding is not interchangeable with arbitrary JavaBean injection.
Full @Configuration interception and lite/proxyBeanMethods=false configuration
also differ when @Bean methods call one another. A method name or annotation may
be an externally consumed registration contract despite no literal Java callers.

For method extraction/inlining, identify the real entry point, proxy/advice and
transaction owner. Self-invocation does not create a separately advised boundary,
but can execute within an already active outer transaction. Preserve propagation,
manager, rollback/exception translation and effect timing implicated by the move.
A pure helper need not become a bean. Imperative transactions and Reactor-context
transactions have different lifetime models; retain an established programmatic
TransactionTemplate/TransactionalOperator when its explicit scope is useful.

For persistent/serialized values, distinguish identity-bearing managed entities,
detached objects, value types and query projections. Inspect actual access mode,
constructors, mutability, generated identifiers, serialization names and relevant
lazy access before changing representation or moving mapping. Do not scan for
leaks, N+1 queries, races or missing validation to manufacture a quality finding.
Bean scopes and container lifecycle are ownership evidence, not a demand to close
every AutoCloseable or replace providers with eagerly cached values.

Use [Spring routing](../spring.md) for owner profiles. Compare an exact supported
mechanism with handwritten mechanics only for the same responsibility. State the
knowledge removed, obligations retained and strongest reason to keep the current
form. Interface twins, DTO/entity merging, universal mappers, annotation deletion,
records and declarative replacements are not automatic improvements.

## Primary references

These explain mechanisms; consult the matching version when evidence is needed,
not every page in every review. Current web documentation never establishes the
target's dependencies, and unavailable evidence does not authorize an upgrade.

[Boot dependency coordinates](https://docs.spring.io/spring-boot/3.5/appendix/dependency-versions/coordinates.html),
[Boot 3 migration](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide),
[autowiring qualifiers](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html),
[transaction annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html),
[Framework 7 release notes](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-7.0-Release-Notes),
[Persistence 3.2 specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2),
[Hibernate 6.6](https://docs.hibernate.org/orm/6.6/introduction/html_single/).
Hibernate is an example of provider documentation, not an assumed project choice.
