# Spring scope and applicability packets

Each section is an independent synthetic snapshot. Supply only its section.
Build/source facts are evidence; the explicit request and B policy establish
scope. These are routing/guard inputs, not actual worker reports or model runs.

## S29

Snapshot: spring-fixture-S29
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; Reactor 3.7.19; Jackson 2.21.4.
Request: Plan the applicable Spring owner profiles for included production Java.

The only owning module declares spring-boot-starter-web and WebClient support.
Committed configuration sets spring.main.web-application-type=servlet. There are
no persistence dependencies, entity mappings or repository calls. The included
controller returns a String; another included component only consumes WebClient.

```java
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
@RestController
class Hello {
    @GetMapping("/hello") String hello() { return "hello"; }
}
class Partner {
    private final WebClient client;
    Partner(WebClient client) { this.client = client; }
    Mono<String> label() {
        return client.get().uri("/label").retrieve().bodyToMono(String.class);
    }
}
```

## S30

Snapshot: spring-fixture-S30
Baseline: JDK toolchain 21 is visible; compiler release and dependency versions come from an unavailable company convention plugin; supported Spring modules are not resolved.
Request: Review configuration selection clarity in the shown Java source.

`build.gradle.kts` is context, not an included production language. The module
uses company.spring-conventions; its external source and locks are unavailable.
The shown source has two explicitly qualified dependencies, with no demonstrated
ambiguity or repetitive selection mechanism.

```kotlin
plugins { id("company.spring-conventions") }
java { toolchain { languageVersion.set(JavaLanguageVersion.of(21)) } }
```

```java
import org.springframework.beans.factory.annotation.Qualifier;
class Delivery {
    Delivery(@Qualifier("email") Sender email, @Qualifier("sms") Sender sms) {
        this.email = email; this.sms = sms;
    }
    private final Sender email;
    private final Sender sms;
    void email(String text) { email.send(text); }
    void sms(String text) { sms.send(text); }
}
interface Sender { void send(String text); }
```

## S31

Snapshot: spring-fixture-S31
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Jackson 2.21.4.
Request: Review only HTTP API clarity. Exclude representation, DI and lifecycle.

`src/main/java/Hello.java` is the only production Java target. Configuration
and one Kotlin helper are available as context, but no Kotlin review is requested.
This is the complete handler; there are no custom mappers or advices.

```java
import org.springframework.web.bind.annotation.*;
@RestController
class Hello {
    @GetMapping("/hello") String hello() { return "hello"; }
}
```

## S32

Snapshot: spring-fixture-S32
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; container only.
Request: Review bean dependency boundaries in the legacy package.

`SUPER_REVIEW.md` at B:

```markdown
## team.java.legacy-construction
Language: Java
Paths: src/main/java/legacy/
Lens: abstractions
Action: disable java.abstractions.earn-the-boundary

Retain construction boundaries in this compatibility adapter.
```

`src/main/java/legacy/Delivery.java` at H. BillingSender is a fixed singleton.
The source is complete for the assigned construction question.

```java
package legacy;
import org.springframework.context.ApplicationContext;
interface Sender { void send(String text); }
class Delivery {
    private final ApplicationContext context;
    Delivery(ApplicationContext context) { this.context = context; }
    void deliver(String text) { context.getBean("billingSender", Sender.class).send(text); }
}
```
