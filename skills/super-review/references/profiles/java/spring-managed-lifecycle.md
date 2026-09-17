# Spring managed lifecycle

Owner: data-flow
Rule: java.data.make-transformations-visible

**Managed value history.** Can readers locate who creates, selects, retains,
changes and finishes using the changed value? Apply only the established
container, persistence or reactive mechanism under
[Spring context](../../spring/context.md), not every subsection to every bean.

For container-managed objects, compare a custom startup/shutdown registry with
supported lifecycle callbacks only for the same phase and owner. Bean initialization,
completion of singleton creation, application startup and ordered start/stop are
not interchangeable moments. A domain startup sequence may express independent
policy. Retain explicit ownership when the object is created/closed by its caller.
Do not close a shared injected AutoCloseable just because try-with-resources is
available. Container singleton means per container and bean definition, not an
application-wide ownership proof; prototype destruction has a different contract.

A provider lookup or scoped proxy can expose an intended per-use/per-request
lifetime. Replacing ObjectProvider<T> with one cached T can erase that meaning.
Preserve the actual scope, laziness, lookup timing and lifecycle callbacks when
making dependencies or state more local. Do not introduce another registry just
to hide these facts behind generic get/start/stop operations.

For established JPA, distinguish changes to a managed entity from constructing
another value or merging detached state. Keep identity, aliases, mutation ownership,
access mode and materialization point implicated by mapping or extraction. A
shorter immutable-looking replacement is not automatically the same update.
A typed snapshot may clarify a handoff, but moving lazy access past its lifetime
or exposing the persistent graph to serialization is not a neutral shape change.
Do not remove save solely because dirty checking exists: inspect the actual
repository contract and object state. Do not hunt query count or leak issues.

For established reactive work, expose the existing value/effect sequence without
changing subscription, cancellation or Reactor-context transaction ownership.
Imperative thread-bound and reactive-context transactions are not interchangeable.
No new subscribe/block calls, scheduler, concurrency model or reactive migration
follows from this profile. Preserve a clear existing pipeline or explicit
TransactionTemplate/TransactionalOperator scope.

Show the lifetime/transformation fact that becomes visible and the strongest
reason to keep the present boundary. If the mechanism cannot be established,
retain the observation but limit the remedy rather than claiming equivalence.

Background: [bean scopes](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html),
[bean lifecycle](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html),
[transaction execution models](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html).
