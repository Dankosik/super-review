# Spring lifecycle and representation source packets

Each section is a separate synthetic snapshot. Supply only that section and the
selected instruction resources. Baseline and consumer notes are controlled source
evidence, not evaluator conclusions. Shown production code changed at H; policy
is from B. Assume the behavior is intended. Do not execute the fixtures.

## S19

Snapshot: spring-fixture-S19
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Spring Data JPA 3.5.13; Hibernate 6.6.53.Final; Persistence API 3.1.0; JpaTransactionManager and class proxies.
Request: Review managed value history and mutation clarity.

`src/main/java/Renaming.java`. findById returns the managed Customer within this
transaction. Customer has database identity and a mutable name. The repository
save call is part of the module's established repository abstraction. Calls enter
through the proxy; there are no detached-object inputs.

```java
import org.springframework.transaction.annotation.Transactional;
class Renaming {
    private final Customers customers;
    Renaming(Customers customers) { this.customers = customers; }
    @Transactional
    public void rename(long id, String name) {
        Customer customer = customers.findById(id).orElseThrow();
        customer.setName(name);
        customers.save(customer);
    }
}
```

## S20

Snapshot: spring-fixture-S20
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; request-scoped CurrentTenant and singleton Exporter.
Request: Review managed dependency lifetime clarity.

`src/main/java/Exporter.java`. CurrentTenant is resolved for the active request;
its value can differ across calls. Its provider is supplied by the existing
container configuration. No caller owns or closes CurrentTenant.

```java
import org.springframework.beans.factory.ObjectProvider;
interface CurrentTenant { String id(); }
class Exporter {
    private final ObjectProvider<CurrentTenant> tenants;
    Exporter(ObjectProvider<CurrentTenant> tenants) { this.tenants = tenants; }
    String tenantLabel() { return tenants.getObject().id(); }
}
```

## S21

Snapshot: spring-fixture-S21
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review startup/shutdown ownership expression.

`src/main/java/ClientLifecycle.java`. One internal bootstrap registry is called
by the container during normal creation/destruction of this singleton's context.
It has no ordering, application-ready, asynchronous stop or business policy; its
only entries are exactly client.open and client.close. No external consumer uses
Hooks. The same resource object and phases must remain observable.

```java
import java.util.List;
record Hooks(List<Runnable> start, List<Runnable> stop) {}
class Client {
    void open() { /* existing resource initialization */ }
    void close() { /* existing resource shutdown */ }
}
class ClientLifecycle {
    Hooks hooks(Client client) {
        return new Hooks(List.of(client::open), List.of(client::close));
    }
}
```

## S22

Snapshot: spring-fixture-S22
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review startup/shutdown ownership expression.

`src/main/java/ExportClient.java`. This Client instance is created by the caller,
which performs several exports before closing it. It is not a Spring bean. The
container supplies ExportClient only; Client.close ends the caller's session.

```java
interface Client extends AutoCloseable {
    String read();
    void close();
}
class ExportClient {
    String export(Client client) { return client.read(); }
}
```

## S23

Snapshot: spring-fixture-S23
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Reactor 3.7.19; an existing ReactiveTransactionManager; no JPA.
Request: Review reactive operation lifetime expression.

`src/main/java/Transfer.java`. Both steps already return cold Mono<Void> values.
The provided operator defines this operation's existing transaction. The external
consumer subscribes once; error and cancellation are propagated through the chain.

```java
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Mono;
interface Accounts { Mono<Void> debit(); Mono<Void> credit(); }
class Transfer {
    private final Accounts accounts;
    private final TransactionalOperator transactions;
    Transfer(Accounts accounts, TransactionalOperator transactions) {
        this.accounts = accounts; this.transactions = transactions;
    }
    Mono<Void> transfer() {
        return accounts.debit().then(accounts.credit()).as(transactions::transactional);
    }
}
```

## S24

Snapshot: spring-fixture-S24
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Spring Data JPA 3.5.13; Hibernate 6.6.53.Final; Persistence API 3.1.0.
Request: Review query-result representation.

`src/main/java/Names.java`. The unchanged Customer entity maps id as Long and
name as String. All consumers of rows() are below and private to this module;
there are no serialization, identity, mutation or external tuple contracts.
The exact selected values and query ordering must remain the same.

```java
import java.util.List;
import jakarta.persistence.EntityManager;
class Names {
    private final EntityManager entityManager;
    Names(EntityManager entityManager) { this.entityManager = entityManager; }
    private List<Object[]> rows() {
        return entityManager.createQuery(
            "select c.id, c.name from Customer c order by c.id", Object[].class)
            .getResultList();
    }
    List<String> labels() {
        return rows().stream().map(row -> (Long) row[0] + ":" + (String) row[1]).toList();
    }
    List<Long> ids() { return rows().stream().map(row -> (Long) row[0]).toList(); }
}
```

## S25

Snapshot: spring-fixture-S25
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Spring Data JPA 3.5.13; Hibernate 6.6.53.Final; Persistence API 3.1.0; Jackson 2.21.4.
Request: Review data shapes crossing the HTTP/persistence boundary.

`src/main/java/Customer.java` and `CustomerResponse.java`. The response is an
externally versioned value. The entity is mutable and database-identity-bearing;
provider construction uses its no-arg constructor. Mapping is performed inside
the established transaction. The shown public response names are wire contracts.
The field access mapping does not itself require every accessor, but application
consumers call the shown ones.

```java
import jakarta.persistence.*;
@Entity
class Customer {
    @Id private Long id;
    private String name;
    protected Customer() {}
    Customer(String name) { this.name = name; }
    Long getId() { return id; }
    String getName() { return name; }
    void setName(String name) { this.name = name; }
}
record CustomerResponse(Long id, String name) {
    static CustomerResponse from(Customer customer) {
        return new CustomerResponse(customer.getId(), customer.getName());
    }
}
```

## S26

Snapshot: spring-fixture-S26
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Hibernate 6.6.53.Final; Persistence API 3.1.0; Hibernate-specific record embeddable support is explicitly adopted.
Request: Review persistent value representation.

`src/main/java/DisplayName.java`. This is an embedded value, not an entity or
identity class. Its values are immutable strings. Portability to another provider
is not part of the established contract. No custom equality or bean accessor
contract is used by consumers.

```java
import jakarta.persistence.*;
@Embeddable
record DisplayName(String given, String family) {}
@Entity
class Customer {
    @Id private Long id;
    @Embedded private DisplayName displayName;
    protected Customer() {}
}
```

## S27

Snapshot: spring-fixture-S27
Baseline: Java release 17; Boot version is unavailable; the committed module explicitly uses Jackson 2.15.4 with a published custom serializer; no ORM.
Request: Review the representation of this published response.

`src/main/java/CustomerResponse.java`. External consumers require customer_id.
The custom serializer reads getCustomerId by the established bean contract; its
external implementation is unavailable. No literal Java calls appear locally.

```java
public final class CustomerResponse {
    private final String customerId;
    public CustomerResponse(String customerId) { this.customerId = customerId; }
    public String getCustomerId() { return customerId; }
}
```

## S28

Snapshot: spring-fixture-S28
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Jackson 2.21.4; no persistence.
Request: Review boundary value representation.

`src/main/java/Greeting.java`. This tiny internal application has one input
contract shared by its only handler and formatter. No independently versioned
transport model, additional consumer or mapping rule is implemented.

```java
record GreetingInput(String name) {}
class GreetingFormatter {
    String format(GreetingInput input) { return "Hello " + input.name(); }
}
```
