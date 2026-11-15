# Spring bean wiring

Owner: abstractions
Rule: java.abstractions.earn-the-boundary

**Construction and selection.** Can readers see what a changed object requires,
when a collaborator is selected and who owns that choice? Apply
[Spring context](../../spring/context.md) and the Java dependency-boundary question.
A fixed ApplicationContext lookup can become a constructor dependency; retain
optional/setter/provider injection when its real lifecycle needs it. A direct
constructor is not obliged to acquire an interface twin or another Spring layer.

Distinguish selection while building the context from routing on operation data.
Qualifiers, @Primary and supported @Fallback affect dependency resolution; they
do not replace a business policy selecting a sender per request. An injected
collection can remove manual object registration without removing that policy.
Do not turn bean names into domain keys implicitly. Preserve qualifier semantics,
aliases, collection ordering, laziness, scope and any actual extension contract.

**Related settings.** Compare repeated Environment lookup, parsing and assembly
of one configuration contract with supported @ConfigurationProperties binding.
A typed group may localize prefix, units, defaults and conversion knowledge.
Retain an isolated clear @Value, expression use, third-party JavaBean binding or
runtime/tenant configuration when a new properties type would not help. Records
are one supported value shape, not a binding requirement. Preserve keys, property
precedence, absent/empty behavior, duration units and existing validation semantics;
do not add new constraints or a dependency to justify the refactoring.

Inspect how the properties object is registered: scanning/enablement with
constructor binding differs from ordinary @Component/@Bean construction. An
@Autowired constructor can deliberately select dependency injection. Do not
remove it using the ordinary single-constructor shorthand without this context.

**Configuration mechanics.** @Bean method parameters can expose collaboration
more directly than inter-method factory calls. Do not mechanically remove
@Configuration interception or add proxyBeanMethods=false: full and lite calls
have different object-creation semantics. Preserve bean names, conditions and
registration order. @ConditionalOnProperty is not runtime business dispatch;
@ConditionalOnMissingBean is sensitive to processed definitions and the intended
auto-configuration ordering. A manual fallback is replaceable only if the same
condition, absent-property rule and override contract remain explicit.

A Spring Data repository interface can be a framework implementation contract,
not an unnecessary interface twin. Contrast it with a handwritten wrapper that
only repeats repository calls. Retain wrappers owning an established application
port, adaptation, absence policy or advised boundary; remove indirection only
when actual callers no longer need to navigate a contract-free forwarding layer.

Show the construction/configuration knowledge that consumers stop reconstructing.
Keep a small domain factory, registry or wrapper when it owns a real decision;
a shorter annotation list is not sufficient benefit.

Background: [externalized configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html),
[configuration modes](https://docs.spring.io/spring-framework/reference/core/beans/java/basic-concepts.html),
[auto-configuration conditions](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html),
[primary/fallback selection](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired-primary.html).
