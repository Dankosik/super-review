## Task result: CT07

- **Snapshot:** static packet `packet-CT07.json`; no revisions supplied.
- **Instructions:** content identity unverified.
- **Assignment:** `java.duplication`; no profiles; anchored in `orders/.../Retry.java`; no team override.
- **Status:** `completed`
- **Inspected evidence:** all of `Retry` and `billing/.../Client.java`. `Kind`'s declaration, callers and build files are not in the packet.
- **Coverage:** base lens complete.
- **New applicability signals:** none.

## C-CT07-1: The gateway attempt limit is declared twice

- **Change anchor:** `Retry.java:3`, `static final int GATEWAY_ATTEMPTS = 3;`. Partner: `Client.java:3`.
- **Basis:** `java.duplication.share-knowledge`.
- **Observation:** the packet context says both counts bound calls to the same gateway, so this is one policy. Nothing links the copies, so changing one lets them diverge silently.
- **Remedy:** declare one constant in the module that already shares `Kind`, and have both classes reference it. A limit change becomes one edit. Keeping the copies is only sound if the modules' limits are independent, which the context contradicts.
- **Preserve:** value 3. The constant must become public across modules. The exact home is unverified.
- **Affected files:** `Retry.java`, `Client.java`, and a shared-module file not supplied.

## C-CT07-2: Identical `name(Kind)` switches (low cost)

- **Change anchor:** `Retry.name`, lines 4-9. Partner: `Client.name`, same lines.
- **Basis:** `java.duplication.share-knowledge`.
- **Observation:** the sealed switch makes a new variant a compile error in both copies, so the cost is one extra guided edit. Only a label change could diverge silently, and no source shows the labels must match.
- **Remedy:** `unresolved`. It needs evidence that the labels are one rule, plus `Kind`'s declaration. Keeping the copies is defensible.
- **Preserve:** the exact label strings.
- **Affected files:** `Retry.java`, `Client.java`; `Kind` and callers still needed.
