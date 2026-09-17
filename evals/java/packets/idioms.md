# Java source packets

Each section is a separate synthetic snapshot, not a live PR. Unless stated
otherwise, the committed module configuration specifies Java release 17, preview
disabled. The shown production declarations are changed at H; stated policy is
from B. Scope is the assigned lens only. Imports and surrounding declarations are
included where relevant; missing evidence is explicitly identified.

## J01

`src/main/java/Labels.java`; the private method's complete uses are below.

```java
final class Labels {
    record Order(String warehouse, String sku) {}
    record ShipmentKey(String warehouse, String sku) {}
    private static Object[] key(Order order) {
        return new Object[] {order.warehouse(), order.sku()};
    }
    static String label(Order order) {
        Object[] key = key(order);
        return (String) key[0] + ":" + (String) key[1];
    }
}
```

## J02

`src/main/java/Customer.java`; this module uses Jakarta Persistence with Hibernate.
The persistence mapping and external bean consumers require the shown constructor
and accessors. Customers carry database identity and mutable state.

```java
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class Customer {
    @Id private Long id;
    private String name;
    protected Customer() {}
    public Customer(String name) { this.name = name; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

## J03

`src/main/java/Names.java`; callers require an independently mutable result in
input order, including duplicates. The input users and names are non-null.

```java
import java.util.ArrayList;
import java.util.List;
final class Names {
    record User(String name, boolean active) {}
    static List<String> activeNames(List<User> users) {
        List<User> active = new ArrayList<>();
        for (User user : users) {
            if (user.active()) active.add(user);
        }
        List<String> names = new ArrayList<>();
        for (User user : active) names.add(user.name());
        return names;
    }
    static List<String> display(List<User> users) {
        List<String> names = activeNames(users);
        names.add("other");
        return names;
    }
}
```

## J04

`src/main/java/Delivery.java`.

```java
import java.io.IOException;
import java.util.List;
final class Delivery {
    interface Sink { void write(String value) throws IOException; }
    static void send(List<String> lines, Sink sink) throws IOException {
        for (String line : lines) {
            if (line.equals("STOP")) break;
            if (line.isBlank()) continue;
            sink.write(line);
        }
    }
}
```

## J05

`src/main/java/Defaults.java`; the operation records a lookup even when the value
is already supplied. The counter is observed by the caller after every invocation.

```java
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
final class Defaults {
    private final AtomicInteger lookups;
    Defaults(AtomicInteger lookups) { this.lookups = lookups; }
    private String auditedDefault() {
        lookups.incrementAndGet();
        return "default";
    }
    String value(Optional<String> supplied) {
        return supplied.orElse(auditedDefault());
    }
}
```

## J06

`src/main/java/FirstLine.java`; this public method's exception contract is used by
external callers not included in the fixture.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
public final class FirstLine {
    public static String read(Path path) throws IOException {
        BufferedReader reader = Files.newBufferedReader(path);
        try {
            return reader.readLine();
        } finally {
            reader.close();
        }
    }
}
```

## J07

`src/main/java/Prefix.java`; the caller continues reading the same reader after
this method returns.

```java
import java.io.BufferedReader;
import java.io.IOException;
final class Prefix {
    /** Reads one line; the caller owns and closes the reader. */
    static String read(BufferedReader reader) throws IOException {
        return reader.readLine();
    }
}
```

## J08

`pom.xml` at H; CI launches Maven with JDK 21.

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>example</groupId><artifactId>legacy</artifactId><version>1</version>
  <properties><maven.compiler.release>8</maven.compiler.release></properties>
  <build><plugins><plugin>
    <groupId>org.apache.maven.plugins</groupId><artifactId>maven-compiler-plugin</artifactId>
    <version>3.14.1</version>
  </plugin></plugins></build>
</project>
```

`src/main/java/Last.java`; callers pass non-empty lists.

```java
import java.util.List;
final class Last {
    static String value(List<String> values) {
        return values.get(values.size() - 1);
    }
}
```

## J09

`build.gradle.kts` at H. The convention plugin and root configuration are external
and unavailable; no compiler release, source-set override, or preview policy is
visible in the supplied snapshot.

```kotlin
plugins { id("company.java-conventions") }
java { toolchain { languageVersion.set(JavaLanguageVersion.of(21)) } }
```

`src/main/java/Coordinate.java`:

```java
public final class Coordinate {
    private final int x;
    private final int y;
    public Coordinate(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
}
```

## J10

`src/main/java/Message.java`; this module uses direct construction, no container,
reflection, or external API. All relevant declarations and uses are below.

```java
import java.util.Map;
final class Message {
    interface Sender { void send(String text); }
    static final class Delivery {
        private final Map<String, Object> services;
        Delivery(Map<String, Object> services) { this.services = services; }
        void deliver(String text) {
            Sender sender = (Sender) services.get("sender");
            sender.send(text);
        }
    }
    static void run(Sender sender) {
        new Delivery(Map.of("sender", sender)).deliver("hello");
    }
}
```

## J11

`src/main/java/Checkout.java`; Spring transaction advice uses proxies. The entry
method is called through the bean proxy; `OrderStore` is an existing collaborator.

```java
import org.springframework.transaction.annotation.Transactional;
public class Checkout {
    interface OrderStore {
        int itemTotal(long id);
        int discount(long id);
        void saveTotal(long id, int total);
    }
    private final OrderStore store;
    public Checkout(OrderStore store) { this.store = store; }
    @Transactional
    public void complete(long id) {
        int subtotal = store.itemTotal(id);
        int discount = store.discount(id);
        int total = Math.max(0, subtotal - discount);
        store.saveTotal(id, total);
    }
}
```

## J12

`src/main/java/Loader.java`; callers expect `LoadException` with the original
cause. The object stream is owned by the caller.

```java
import java.io.IOException;
import java.io.ObjectInputStream;
final class Loader {
    static final class LoadException extends Exception {
        LoadException(String message, Throwable cause) { super(message, cause); }
    }
    static Object load(ObjectInputStream input) throws LoadException {
        try {
            return input.readObject();
        } catch (IOException cause) {
            throw new LoadException("Cannot load object", cause);
        } catch (ClassNotFoundException cause) {
            throw new LoadException("Cannot load object", cause);
        }
    }
}
```

## J13

`SUPER_REVIEW.md` at B:

```markdown
## team.java.linear
Language: Java
Paths: src/main/java/importer/
Lens: function-cohesion
Action: disable java.functions.extract-for-clarity

Keep the import sequence together in this compatibility module.

## team.go.helpers
Language: Go
Paths: internal/importer/
Lens: function-cohesion
Action: refine go.functions.extract-for-clarity

Name domain calculations when useful.
```

`src/main/java/importer/Importer.java` at H:

```java
package importer;
import java.util.ArrayList;
import java.util.List;
final class Importer {
    static List<String> importNames(List<String> lines) {
        List<String> names = new ArrayList<>();
        for (String line : lines) {
            String name = line.trim();
            if (!name.isEmpty()) names.add(name);
        }
        return names;
    }
}
```

## J14

`src/main/java/Profile.java`; bean property names are part of a public binding
contract. External consumers are unavailable. A literal repository search for
`getProfileId` found only this declaration.

```java
public final class Profile {
    private final String profileId;
    public Profile(String profileId) { this.profileId = profileId; }
    public String getProfileId() { return profileId; }
}
```

## J15

`src/main/java/LegacyNames.java`; the published boundary explicitly accepts null
entries in the list. Callers require an unmodifiable snapshot, not a live view.

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
final class LegacyNames {
    static List<String> snapshot(List<String> names) {
        // The legacy boundary permits null entries; List.copyOf would reject them.
        return Collections.unmodifiableList(new ArrayList<>(names));
    }
}
```

## J16

`src/main/java/CaseMode.java`; there are exactly two supported modes in the current
contract. No external extension mechanism is required.

```java
import java.util.Locale;
enum CaseMode {
    UPPER, LOWER;
    String apply(String value) {
        return switch (this) {
            case UPPER -> value.toUpperCase(Locale.ROOT);
            case LOWER -> value.toLowerCase(Locale.ROOT);
        };
    }
}
```

## J17

`src/main/java/DisplayNames.java`; both entry points implement the same existing
product rule: trim leading/trailing ASCII whitespace and lowercase with ROOT.
They are not separate transport contracts; all uses are internal to this module.

```java
import java.util.Locale;
final class DisplayNames {
    static String fromSignup(String name) {
        return name.trim().toLowerCase(Locale.ROOT);
    }
    static String fromImport(String name) {
        return name.trim().toLowerCase(Locale.ROOT);
    }
}
```

## J18

`src/main/java/Elapsed.java`; the private method and its complete use are shown.
The arguments `start` and `end` are epoch milliseconds from the existing boundary.

```java
final class Elapsed {
    private static long seconds(long value) {
        return value / 1000;
    }
    static long elapsedSeconds(long start, long end) {
        return seconds(end - start);
    }
}
```
