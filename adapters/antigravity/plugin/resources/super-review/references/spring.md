# Spring routing

Use this extension of [language routing](languages.md) for Spring mechanisms
established in included Java source. It adds owner profiles, not a language,
an agent type, or a replacement review workflow. A Boot parent, starter, bean
annotation or repository name alone does not establish every Spring module.
Inspect the owning module's configuration, declarations, imports and actual uses.

Record the area's baseline using [Spring context](spring/context.md), alongside
[Java context](languages/java.md). Select profiles under [aspect selection](aspects.md),
with its scope, policy, evidence-gap and completion rules. A signal opens a
question; understandable framework code may complete it without a candidate.

| Profile | Owner | Signal in included source, not a finding |
| --- | --- | --- |
| [spring-bean-wiring](profiles/java/spring-bean-wiring.md) | abstractions | Bean construction/selection, configuration binding, registration conditions or a custom factory/registry for container-managed collaborators. |
| [spring-application-operations](profiles/java/spring-application-operations.md) | function-cohesion | HTTP/application/persistence orchestration, meaningful computation interleaved with effects, or extraction across an advised operation. |
| [spring-http-contracts](profiles/java/spring-http-contracts.md) | api-clarity | Established MVC or WebFlux handler inputs/results, binding/validation, mapping, functional routing or manual HTTP dispatch. |
| [spring-http-errors](profiles/java/spring-http-errors.md) | control-flow | Web failure translation, handler/advice selection, repeated response construction or a custom error dispatcher. An ordinary catch alone is insufficient. |
| [spring-managed-lifecycle](profiles/java/spring-managed-lifecycle.md) | data-flow | Scoped/provider dependencies, bean startup/shutdown, managed persistence state, lazy materialization or a reactive operation's lifetime. |
| [spring-value-shapes](profiles/java/spring-value-shapes.md) | representation | Configuration values, request/result shapes, entities, embeddables, IDs or projections whose representation participates in a Spring boundary. |

## Apply only the established mechanism

Container-only code does not select HTTP or JPA profiles. A WebClient consumer
is not evidence of a WebFlux server. Resolve MVC versus WebFlux from actual server
configuration and APIs; shared controller annotations and Mono/Flux alone do not
distinguish them. Functional handlers are framework mechanisms, not automatically
custom infrastructure. A JPA subsection requires JPA evidence; do not transfer it
to Spring Data JDBC, R2DBC, MongoDB or another store. Spring without Boot does not
inherit Boot binding/auto-configuration. Unknown configuration is a scoped gap,
not structural absence or permission to assume a familiar stack.

Keep the eight base questions unless the user narrows them. A fresh specialist
receives Java context, Spring context, one existing lens and only that owner's
selected profiles, plus the normal contract and neutral source packet. These
profiles inherit their printed java.* rule, including disables, scoped overrides
and conflicts. Team-rule language remains Java. No spring.* namespace, additional
worker quota, nested delegation or broad Spring pass is introduced.

Generic dependency-boundaries and spring-bean-wiring can share one abstractions
task; effects-separation and spring-application-operations can share one cohesion
task. Do not repeat completed work. Representation remains conditional, not an
extra question for every bean. Naming, duplication and change-locality keep their
Java questions, using implicated Spring contracts rather than parallel profiles.

A lens-only request selects only its owner's profiles. A profile-only request
covers its narrow question, not all Java or Spring. Explicit exclusions win over
automatic signals. Record selected/not-applicable/not-requested/not-checked
profiles and actual inspected symbols in existing coverage fields. Parent
verification uses the same established stack and preservation evidence. A new
cross-owner signal goes to the parent as an anchor and missing question, not a
peer verdict; reconcile equivalent recommendations without another full pass.

Java production source remains the target. Kotlin, XML, YAML, SQL and build files
may supply necessary context but are not new standalone supported languages.
No application execution, dependency resolution command, upgrade, new ORM,
reactive migration or Spring Modulith/architecture mandate follows from routing.
