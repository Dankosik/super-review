# Spring HTTP and operation source packets

Each section is a separate synthetic snapshot; supply only that section. Baseline
and consumer notes are controlled evidence. Shown production code changed at H;
policy is from B. Assume its behavior is intended. Supporting types not implicated
by a remedy have the stated contracts. Do not execute source or add requirements.

## S11

Snapshot: spring-fixture-S11
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Jackson 2.21.4.
Request: Review cohesion of this application operation.

`src/main/java/BusinessDayExport.java`. The existing rule is: after converting the
instant into the configured business zone, times before 04:00 belong to the previous
date. Store.read(date) and Audit.record(date) are effects; both use that same date.
No computation reads additional mutable state. This is the complete operation.

```java
import java.time.*;
interface Store { String read(LocalDate date); }
interface Audit { void record(LocalDate date); }
class BusinessDayExport {
    private final Store store;
    private final Audit audit;
    private final ZoneId zone;
    BusinessDayExport(Store store, Audit audit, ZoneId zone) {
        this.store = store; this.audit = audit; this.zone = zone;
    }
    String export(Instant at) {
        ZonedDateTime local = at.atZone(zone);
        LocalDate date = local.toLocalTime().isBefore(LocalTime.of(4, 0))
            ? local.toLocalDate().minusDays(1) : local.toLocalDate();
        String report = store.read(date);
        audit.record(date);
        return report;
    }
}
```

## S12

Snapshot: spring-fixture-S12
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; class-based transaction proxies; one imperative transaction manager.
Request: Review cohesion of the application operation, not transaction correctness.

`src/main/java/Checkout.java`. Both HTTP and batch callers invoke complete through
the bean proxy. The operation's established unit of work includes both store calls.
No separate business formula or mapping is hidden in these methods.

```java
import org.springframework.transaction.annotation.Transactional;
interface Stock { void reserve(long orderId); }
interface Orders { void markReady(long orderId); }
class Checkout {
    private final Stock stock;
    private final Orders orders;
    Checkout(Stock stock, Orders orders) { this.stock = stock; this.orders = orders; }
    @Transactional
    public void complete(long orderId) {
        stock.reserve(orderId);
        orders.markReady(orderId);
    }
}
```

## S13

Snapshot: spring-fixture-S13
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; root servlet mapping.
Request: Review HTTP API expression and routing clarity.

`src/main/java/ExportController.java`. These two root paths and their response
bodies are the complete established GET contract; no versioning, dynamic command
selection, controller prefix or alternate servlet path is configured.

```java
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
@RestController
class ExportController {
    @GetMapping(value = {"/plain", "/csv"}, produces = "text/plain")
    String export(HttpServletRequest request) {
        if (request.getServletPath().equals("/csv")) return "a,b";
        return "a b";
    }
}
```

## S14

Snapshot: spring-fixture-S14
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; WebFlux server; Reactor 3.7.19.
Request: Review HTTP API expression and routing clarity.

`src/main/java/Routes.java`. The project uses functional handlers consistently.
The plain route returns this body; no dynamic routing or additional layer exists.

```java
import org.springframework.context.annotation.*;
import org.springframework.web.reactive.function.server.*;
@Configuration(proxyBeanMethods = false)
class Routes {
    @Bean RouterFunction<ServerResponse> exports() {
        return RouterFunctions.route()
            .GET("/plain", request -> ServerResponse.ok().bodyValue("a b"))
            .build();
    }
}
```

## S15

Snapshot: spring-fixture-S15
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Jackson 2.21.4.
Request: Review HTTP error expression.

`src/main/java/LookupController.java`. Both methods intentionally expose exactly
the same missing-resource envelope/status. Lookup supplies String results and
throws the same Missing exception. There are no other advices, logging obligations,
transactional catches, recovery behavior or exception-type-specific policies.
Only these two endpoints belong to this API.

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
record ApiError(String code) {}
class Missing extends RuntimeException {}
interface Lookup { String customer(long id); String supplier(long id); }
@RestController
class LookupController {
    private final Lookup lookup;
    LookupController(Lookup lookup) { this.lookup = lookup; }
    @GetMapping("/customers/{id}")
    ResponseEntity<?> customer(@PathVariable long id) {
        try { return ResponseEntity.ok(lookup.customer(id)); }
        catch (Missing cause) { return ResponseEntity.status(404).body(new ApiError("missing")); }
    }
    @GetMapping("/suppliers/{id}")
    ResponseEntity<?> supplier(@PathVariable long id) {
        try { return ResponseEntity.ok(lookup.supplier(id)); }
        catch (Missing cause) { return ResponseEntity.status(404).body(new ApiError("missing")); }
    }
}
```

## S16

Snapshot: spring-fixture-S16
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Jackson 2.21.4.
Request: Review HTTP error expression.

`src/main/java/LegacyErrors.java`. Existing external clients require JSON keys
code and retryable, status 409, and X-Error-Code. This advice is limited to
LegacyController. Other APIs have independently owned error formats.

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
record LegacyError(String code, boolean retryable) {}
class Duplicate extends RuntimeException {}
@RestControllerAdvice(assignableTypes = LegacyController.class)
class LegacyErrors {
    @ExceptionHandler(Duplicate.class)
    ResponseEntity<LegacyError> duplicate() {
        return ResponseEntity.status(409).header("X-Error-Code", "duplicate")
            .body(new LegacyError("duplicate", false));
    }
}
```

## S17

Snapshot: spring-fixture-S17
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; MVC; Validation API 3.0.2; Hibernate Validator 8.0.3.Final; Jackson 2.21.4.
Request: Review HTTP input-contract expression, preserving existing validation semantics.

`src/main/java/NamesController.java`. This argument is validated as a request body.
The existing advice translates MethodArgumentNotValidException field errors to
the public error shape. No class-level @Validated, direct method constraint or
local BindingResult is configured. The constraint shown is the complete input rule.

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;
record NameInput(@NotBlank String name) {}
@RestController
class NamesController {
    @PostMapping("/names")
    String create(@Valid @RequestBody NameInput input) { return input.name(); }
}
```

## S18

Snapshot: spring-fixture-S18
Baseline: Java release 17; Boot 3.5.16; Framework 6.2.19; WebFlux server; Reactor 3.7.19; Validation API 3.0.2; Hibernate Validator 8.0.3.Final; Jackson 2.21.4.
Request: Review HTTP input-contract expression, preserving existing validation semantics.

`src/main/java/NamesController.java`. The existing WebFlux advice translates
WebExchangeBindException field errors to the public error shape. No class-level
@Validated, direct method constraint or blocking consumer is configured.

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
record NameInput(@NotBlank String name) {}
@RestController
class NamesController {
    @PostMapping("/names")
    Mono<String> create(@Valid @RequestBody NameInput input) {
        return Mono.just(input.name());
    }
}
```
