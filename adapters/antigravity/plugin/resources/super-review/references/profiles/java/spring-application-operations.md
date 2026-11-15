# Spring application operations

Owner: function-cohesion
Rule: java.functions.coherent-purpose

**Operation story.** Can a reader follow the changed HTTP/application/persistence
operation at one useful level, or must they reconstruct computation and effects
across unrelated helpers? Use [Spring context](../../spring/context.md). Name an
already meaningful calculation or adaptation when its explicit values make it
independently understandable. Keep a simple linear read-transform-write together
when extra command, handler, service and mapper classes only scatter its sequence.

A short service may own an application operation or transaction spanning several
repository calls. Its line count does not establish that it is redundant. Inlining
or splitting needs the actual consumers and declarative contract, not a mandatory
controller-service-repository pattern. Do not create an interface for each service,
a dependency container for local computation or an architecture for testing ease.

Mapping deserves a name when it expresses a boundary decision, such as converting
an instant to the operation's existing business-date convention. Straightforward
field construction may stay inline. Do not replace a local transformation with a
reflective convert(Object, Class) pipeline, or remove an established generated
mapper without a burden in its handwritten use. Transport, application and
persistence shapes need not share a mapping merely because fields look alike.

Before moving code, identify the real advised entry point and implicated manager,
propagation, rollback/exception and materialization boundaries. An unannotated
private calculation can remain inside an existing outer transaction. Giving a
self-invoked helper @Transactional does not establish separate proxy interception;
moving it into another bean may create a different boundary. Do not convert
checked failures to unchecked ones or move lazy mapping beyond its known lifetime
as a cosmetic simplification. Inspect effects needed by the proposal only.

Show the independently understandable operation and any navigation removed or
added. A transparent repository wrapper without its own contract is evaluated by
the abstractions owner; signal that question with an anchor instead of conducting
another layer-wide pass. Existing programmatic transaction scope can itself tell
the operation's story clearly; annotations are not a universal replacement.

Background: [service transaction boundaries](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html),
[proxy semantics](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html),
[programmatic transactions](https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html).
