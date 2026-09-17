# Spring instruction extension: rationale and sources

Maintainer-only audit, 2026-09-17. Repository baseline:
`f5a67021bbc54995648fe032d07bccdb88a32fa6` (Super Review 3.2.0).
This is an extension of Java review, not a new runtime, model profile or language.
The three research areas were examined sequentially; no independent subagent
results or behavioral improvement measurements are represented here.

## Existing coverage versus the delta

The baseline Java context already requires library/framework compatibility,
explicit dependencies, supported language features and preservation of binding,
proxies, ORM and serialization. Java abstractions already reject unearned layers
and interface twins; duplication/change-locality distinguish independent mappings;
representation protects entities from indiscriminate record conversion. Cohesion
and effects-separation already preserve proxy/transaction and lazy-loading context.
J02/J10/J11/J14 cover some of these boundaries. They are not newly discovered bugs.

The missing material is mechanism-specific choice and routing: startup bean
selection versus per-operation policy; typed Boot configuration versus repeated
parsing; full/lite configuration and conditional registration; MVC versus WebFlux
binding/error contracts; provider-managed values versus projections; and scoped
lifecycle. Six profiles attach these decisions to existing Java owners. Base
lenses, java.* IDs, team policy and review scope remain unchanged. No universal
service/repository/mapper architecture, reactive migration, ORM replacement or
Spring Modulith adoption is introduced.

## Reference map

Links were inspected during this maintenance work. Moving documentation is
background evidence, not a target-version assertion. A real recommendation still
needs the owning module's effective baseline and matching mechanism. No excerpts
are copied as instruction policy, and no new external dependency is introduced.

| Decision | Primary reference | Implication for the extension |
| --- | --- | --- |
| Configuration binding | [Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) | Compare a related typed group with repeated parsing; preserve registration, units, defaults and existing constraints. |
| Constructor selection | [Boot 3 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide) | A properties constructor can need @Autowired to select injection rather than binding. |
| Bean selection | [Qualifiers](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-qualifiers.html), [primary/fallback](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-primary.html) | Context wiring is not per-request business routing; inspect names and parameter metadata. |
| Configuration mode | [Bean/configuration concepts](https://docs.spring.io/spring-framework/reference/core/beans/java/basic-concepts.html) | Removing interception is not equivalent when factory methods call one another. |
| Conditions | [Boot auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html) | Preserve property absence and processed-definition/ordering contracts, not just an if statement. |
| Scope and phases | [Bean scopes](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html), [lifecycle](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html) | Providers, scoped proxies, initialization and start/stop express different ownership facts. |
| Application unit of work | [Spring Data JPA transactionality](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html) | A short service or save call can carry an established contract; length alone is not redundancy. |
| Advice and extraction | [Transactional annotations](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html), [proxying](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html) | Distinguish an active outer transaction from separately intercepted self-invocation and class/interface proxies. |
| Reactive ownership | [Transactional API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), [programmatic transactions](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html) | Preserve execution/context boundaries; explicit operators/templates may already be clear. |
| HTTP dispatch | [MVC mappings](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html), [WebFlux functional endpoints](https://docs.spring.io/spring-framework/reference/web/webflux-functional.html) | Prefer an equivalent existing routing mechanism, not a different endpoint architecture. |
| Validation mechanisms | [MVC validation](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html), [WebFlux validation](https://docs.spring.io/spring-framework/reference/web/webflux/controller/ann-validation.html) | Preserve argument/method/AOP validation distinctions and their error contracts. |
| Error ownership | [MVC errors](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html), [WebFlux errors](https://docs.spring.io/spring-framework/reference/web/webflux/ann-rest-exceptions.html) | Native error types do not authorize replacing an established wire envelope. |
| Persistent shapes | [Jakarta Persistence 3.2 specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2), [Hibernate 6.6](https://docs.hibernate.org/orm/6.6/introduction/html_single/) | Entity requirements differ from value/ID types; provider support is not portable API proof. |
| Named query results | [Spring Data JPA projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html) | Name existing data without confusing a projection with a managed entity or inventing unsupported query syntax. |
| Serialization | [Boot JSON integration](https://docs.spring.io/spring-boot/reference/features/json.html) | Inspect actual mapper/version/modules and wire names instead of assuming a Jackson generation. |
| Newer APIs | [Framework 7 release notes](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-7.0-Release-Notes) | API versioning is conditional on that baseline, not an upgrade instruction. |
| Mixed web dependencies | [Boot 3.5 reactive web](https://docs.spring.io/spring-boot/3.5/reference/web/reactive.html) | WebClient presence does not prove a reactive server. |

## Fixture compatibility

The [Boot 3.5 managed coordinates](https://docs.spring.io/spring-boot/3.5/appendix/dependency-versions/coordinates.html)
page inspected on the audit date identifies Boot 3.5.16, Framework 6.2.19,
Spring Data JPA 3.5.13, Hibernate ORM 6.6.53.Final, Persistence API 3.1.0,
Jackson databind 2.21.4, Hibernate Validator 8.0.3.Final, Validation API 3.0.2
and Reactor 3.7.19. Packet sections explicitly name only their applicable modules.
Those numbers describe the controlled examples, not a new minimum supported stack.
S26 deliberately identifies Hibernate's adopted record-embeddable support rather
than pretending that this baseline implements portable Persistence 3.2 rules.
S27 and S30 explicitly withhold parts of the baseline and external consumers.

Framework 6.1 controller-validation/parameter-metadata distinctions, 6.2 @Fallback
and configurable rollback policy, and Framework 7 API versioning remain conditional
knowledge in the context. Older or externally overridden applications must retain
their own contracts. Runtime documentation does not replace build evidence.

## Evidence limits

This change is supported by missing instruction detail and primary mechanisms,
not a reproduced failure by the baseline model. Behavioral baseline/candidate
comparisons are NOT RUN; no raw model traces, quality scores or efficiency gains
are fabricated. Grading expectations are separate from neutral packet sections.
The new structural tests cannot establish recommendation quality or live delegation.
