# Spring wiring source packets

Each section is a separate synthetic snapshot. Supply only its section to a
reviewer. Baseline and consumer notes are controlled build/source evidence, not
instructions about an outcome. Shown production declarations changed at H;
policy comes from B. Assume the implemented behavior is intended. Imports and
supporting declarations outside the assigned mechanism may be summarized by the
stated facts; unavailable evidence is explicitly marked. Do not execute fixtures.

## S01

Snapshot: spring-fixture-S01
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review bean dependency boundaries for readability and maintainability.

`src/main/java/Delivery.java`. The billingSender is a singleton with no aliases,
scoped proxy or runtime selection. It is the only Sender used by Delivery. The
bean definition and shown caller are internal to this module.

```java
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
interface Sender { void send(String message); }
@Service
class Delivery {
    private final ApplicationContext context;
    Delivery(ApplicationContext context) { this.context = context; }
    void deliver(String text) {
        context.getBean("billingSender", Sender.class).send(text);
    }
}
```

## S02

Snapshot: spring-fixture-S02
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review bean dependency boundaries for readability and maintainability.

`src/main/java/Delivery.java`. This application's two supported channels are
request data. The map is built from explicitly named business keys in configuration;
keys are not bean names. The constructor receives both singleton strategies.

```java
import java.util.Map;
interface Sender { void send(String message); }
record Message(String channel, String text) {}
class Delivery {
    private final Map<String, Sender> senders;
    Delivery(Sender email, Sender sms) {
        senders = Map.of("email", email, "sms", sms);
    }
    void deliver(Message message) {
        senders.get(message.channel()).send(message.text());
    }
}
```

## S03

Snapshot: spring-fixture-S03
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only; -parameters enabled.
Request: Review related configuration construction for readability and maintainability.

`src/main/java/PartnerConfiguration.java`. Both clients use one partner contract.
External settings are partner.endpoint (required absolute URI) and partner.timeout
(absent or an integer number of seconds, default 5). They are fixed for this
context's lifetime. Validation of these supported forms is already established.
There is no runtime refresh or expression-based configuration. Ordinary bound
properties can be registered through @EnableConfigurationProperties here.

```java
import java.net.URI;
import java.time.Duration;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
record PartnerClient(URI endpoint, Duration timeout) {}
record PartnerReporter(URI endpoint, Duration timeout) {}
@Configuration(proxyBeanMethods = false)
class PartnerConfiguration {
    @Bean PartnerClient partnerClient(Environment environment) {
        URI endpoint = URI.create(environment.getRequiredProperty("partner.endpoint"));
        Duration timeout = Duration.ofSeconds(Long.parseLong(
            environment.getProperty("partner.timeout", "5")));
        return new PartnerClient(endpoint, timeout);
    }
    @Bean PartnerReporter partnerReporter(Environment environment) {
        URI endpoint = URI.create(environment.getRequiredProperty("partner.endpoint"));
        Duration timeout = Duration.ofSeconds(Long.parseLong(
            environment.getProperty("partner.timeout", "5")));
        return new PartnerReporter(endpoint, timeout);
    }
}
```

## S04

Snapshot: spring-fixture-S04
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review configuration dependencies for readability and maintainability.

`src/main/java/Banner.java`. There are no related settings or other consumers.
The property is fixed at context creation; its default is part of the contract.

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Component
class Banner {
    private final String title;
    Banner(@Value("${banner.title:Welcome}") String title) { this.title = title; }
    String text() { return title; }
}
```

## S05

Snapshot: spring-fixture-S05
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only; -parameters enabled.
Request: Review construction and binding clarity.

`src/main/java/PartnerProperties.java`. Configuration registers this class through
@EnableConfigurationProperties(PartnerProperties.class) and provides a singleton
Credentials bean. The credentials are injected; the endpoint is bound as a mutable
JavaBean property. No other constructor or binding path is used.

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
interface Credentials { String token(); }
@ConfigurationProperties("partner")
class PartnerProperties {
    private final Credentials credentials;
    private String endpoint;
    @Autowired
    PartnerProperties(Credentials credentials) { this.credentials = credentials; }
    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }
    String token() { return credentials.token(); }
}
```

## S06

Snapshot: spring-fixture-S06
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; full Java configuration.
Request: Review configuration construction clarity.

`src/main/java/ClientConfiguration.java`. Both consumers require the same registered
Client object. Full configuration interception is enabled. Bean names are used
by existing external configuration. Client has mutable session state.

```java
import org.springframework.context.annotation.*;
class Client {}
record Sender(Client client) {}
record Receiver(Client client) {}
@Configuration
class ClientConfiguration {
    @Bean Client partnerClient() { return new Client(); }
    @Bean Sender sender() { return new Sender(partnerClient()); }
    @Bean Receiver receiver() { return new Receiver(partnerClient()); }
}
```

## S07

Snapshot: spring-fixture-S07
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Spring Data JPA 3.5.13; Hibernate 6.6.53.Final; Persistence API 3.1.0.
Request: Review repository abstraction boundaries.

`src/main/java/CustomerCount.java`. Customer is an unchanged field-access entity.
The wrapper has no external consumers, application port, annotations, adaptation,
exception translation or transaction policy. The shown endpoint is its only use.
Spring Data supplies Customers' implementation and the existing count contract.

```java
import org.springframework.data.jpa.repository.JpaRepository;
interface Customers extends JpaRepository<Customer, Long> {}
class CustomerStore {
    private final Customers customers;
    CustomerStore(Customers customers) { this.customers = customers; }
    long count() { return customers.count(); }
}
class CustomerCount {
    private final CustomerStore store;
    CustomerCount(CustomerStore store) { this.store = store; }
    long current() { return store.count(); }
}
```

## S08

Snapshot: spring-fixture-S08
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Spring Data JPA 3.5.13; Hibernate 6.6.53.Final; Persistence API 3.1.0.
Request: Review repository abstraction boundaries.

`src/main/java/CustomerDirectory.java`. A batch importer and HTTP adapter both
consume the existing directory contract. The underlying Customers.findById returns
Optional<Customer>; Customer.label() is an established domain value. Callers use
MissingCustomer as application vocabulary, not a persistence exception.

```java
interface CustomerDirectory { String label(long id); }
class MissingCustomer extends RuntimeException {
    MissingCustomer(long id) { super("Missing customer " + id); }
}
class JpaCustomerDirectory implements CustomerDirectory {
    private final Customers customers;
    JpaCustomerDirectory(Customers customers) { this.customers = customers; }
    public String label(long id) {
        return customers.findById(id).orElseThrow(() -> new MissingCustomer(id)).label();
    }
}
```

## S09

Snapshot: spring-fixture-S09
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container configuration.
Request: Review conditional registration clarity.

`src/main/java/AuditSelection.java`. The configuration imports AuditSelection.
Supported audit.enabled inputs are exactly absent, true or false; absence means
no AuditConfiguration. AuditConfiguration only registers AuditSink; no other
initializer, ordering rule or consumer relies on this selector class.

```java
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.env.Environment;
import org.springframework.core.type.AnnotationMetadata;
class AuditSelection implements ImportSelector, EnvironmentAware {
    private Environment environment;
    public void setEnvironment(Environment environment) { this.environment = environment; }
    public String[] selectImports(AnnotationMetadata metadata) {
        return environment.getProperty("audit.enabled", Boolean.class, false)
            ? new String[] {AuditConfiguration.class.getName()} : new String[0];
    }
}
```

## S10

Snapshot: spring-fixture-S10
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Boot auto-configuration.
Request: Review conditional registration clarity.

`src/main/java/FallbackSenderConfiguration.java`. This class is listed in the
AutoConfiguration.imports resource. PartnerSenderConfiguration may register a
Sender first; application user beans also override the default. The bean name is
part of existing explicit configuration. There is no runtime sender selection.

```java
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
@AutoConfiguration(after = PartnerSenderConfiguration.class)
class FallbackSenderConfiguration {
    @Bean("defaultSender")
    @ConditionalOnMissingBean(Sender.class)
    Sender sender() { return new LocalSender(); }
}
```
