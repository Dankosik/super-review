# Spring value shapes

Owner: representation
Rule: java.representation.express-concepts

**Representation by responsibility.** Does the changed shape name an existing
configuration, request, result or persistence concept, or require readers to decode
positions, parallel fields and flags? Apply [Spring context](../../spring/context.md)
and inspect construction and consumers, not only the declaration's boilerplate.

A small class or supported record can name a configuration value or DTO projection.
A named query result can remove repeated Object[] indexing/casting; inspect the
actual query, constructor/aliases, supported projection mechanism and consumers.
Do not invent a generic projection framework or assume interface and constructor
projections have identical semantics. Keep a plain local tuple when its scope and
meaning are already evident.

An entity is not merely a DTO with extra annotations. Preserve its managed identity,
mutable state and construction contract; Jakarta Persistence does not permit a
record entity. Do not infer that all persistent value types must also be ordinary
classes: embeddables and composite IDs have distinct specification/provider rules.
Persistence 3.2 support is not proof for a project on API 3.1; an explicitly
supported provider extension is a narrower claim, not portable JPA behavior.
Hibernate is not assumed when another provider or store is used.

Before removing a constructor or accessor, determine persistence field/property
access, binding, generated members and external serialization/reflection use.
The JPA entity no-arg constructor may serve the provider despite no Java call;
not every getter is required under field access, and not every uncalled getter
is unused. Do not remove annotations or Lombok members by visual redundancy.
Inspect the actual JSON mapper/version/modules and annotated wire names when
changing record components, creators or property methods.

HTTP DTO and entity fields can coincide while their mutation, identity, lifetime
and versioned wire contracts differ. Keep separate forms when those responsibilities
are independent; do not combine them merely to remove a mapper. Conversely, do
not manufacture identical request/command/DTO twins without a concrete contract
or representation benefit. Similar mapping syntax alone is not shared knowledge.
Do not alter database mappings, query semantics or API payloads to make a type fit.

Show which decoding convention disappears and what construction, conversion and
compatibility obligations remain. No ORM migration, performance assertion or
framework-error search is part of the question.

Background: [Persistence specification](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2),
[Spring Data JPA projections](https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html),
[Hibernate value types](https://docs.hibernate.org/orm/6.6/introduction/html_single/),
[Boot JSON integration](https://docs.spring.io/spring-boot/reference/features/json.html).
