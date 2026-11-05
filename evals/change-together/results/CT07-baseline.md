## Task result: CT07

- **Snapshot:** static packet `packet-CT07.json`; no commit identity.
- **Instructions:** `content identity unverified`.
- **Assignment:** duplication; profiles none; `orders/.../Retry.java`; no team override.
- **Status:** `completed`.
- **Inspected evidence:** all of `Retry.java` and `billing/.../Client.java`.
- **Coverage:** base lens complete. Absent from the packet: `Kind` declaration, callers, build baseline.
- **New applicability signals:**
  - `Client.GATEWAY_ATTEMPTS` is private and unread in its class, despite the packet's context.
  - Neither file imports `Kind`, though the packages differ.

## C-CT07-1: Gateway attempt limit is declared twice

- **Change anchor:** `Retry.java:3`, `static final int GATEWAY_ATTEMPTS = 3`; copy at `Client.java:3`.
- **Basis:** `java.duplication.share-knowledge`.
- **Observation:** Context says both counts bound calls to the same gateway, so this is one policy. Changing it requires a coordinated edit across modules, and nothing ties the copies together.
- **Remedy:** `unresolved`: no shared gateway owner is shown, and `Kind`'s module is unverified. Keep one named constant there, not on `Kind`.
- **Preserve:** the value 3. Compile-time constants inline, so consumers need recompiling.
- **Affected files:** both; shared owner still needed.

## C-CT07-2: `Kind`-to-label switch is copied

- **Change anchor:** `Retry.name(Kind)`, lines 4-9; identical `Client.name(Kind)`.
- **Basis:** `java.duplication.share-knowledge`.
- **Observation:** Both copies map the same sealed type to the same labels. A new subtype or label means editing both. Exhaustiveness flags a new subtype, but not label drift.
- **Remedy:** Declare one `name()` on `Kind`, and call `kind.name()`. Tradeoff: `Kind` then owns labels. Keep the copies if callers show independent label contracts.
- **Preserve:** exact strings; null argument still throws `NullPointerException`.
- **Affected files:** both, plus `Kind` and callers (not supplied).
