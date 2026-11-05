## Task result: CT08

- **Snapshot:** static packet `packet-CT08.json`; no commit or diff, so whole-snapshot view.
- **Instructions:** `content identity unverified`.
- **Assignment:** `duplication` lens, no profiles, scope `orders/rules.go`, no team override, Go 1.25.
- **Status:** `completed`.
- **Inspected evidence:** all of `go.mod`, `orders/rules.go`, `billing/client.go`, plus packet context.
- **Coverage:** base lens complete; `go.duplication.share-knowledge` applied across the snapshot. No missing evidence.
- **New applicability signals:** none.

## C-CT08-1: Same gateway timeout is declared in two packages

- **Change anchor:** `orders/rules.go`, `const GatewayTimeout = 2 * time.Second`; partner `billing/client.go`, `const gatewayTimeout`.
- **Basis:** `go.duplication.share-knowledge`.
- **Observation:** Context states both bound the same gateway call, so they encode one decision. Changing it requires a coordinated edit, and nothing links the two declarations.
- **Remedy:** Keep one declaration. The snapshot has no gateway owner, and neither constant has a use in it. The smallest option is for `billing` to import the already exported `orders.GatewayTimeout`. The tradeoff is that `billing` then depends on `orders` for a value unrelated to orders. A small `gateway` package avoids that but adds a package holding only a constant. The strongest keep alternative is no coupling, but it fails because the reason to change is shared.
- **Preserve:** Value and `time.Duration` type. Removing the exported name is a low concern because the snapshot is private and unreleased.
- **Affected files:** `orders/rules.go`, `billing/client.go`.

**Not a candidate:** the identical `Eligible` predicates. Different teams own them and they have changed independently, so the match is coincidental and they should stay separate.
