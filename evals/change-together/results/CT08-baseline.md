## Task result: CT08

- **Snapshot:** static packet `packet-CT08.json`; whole-snapshot view, no commits.
- **Instructions:** content identity unverified.
- **Assignment:** lens `duplication`; no profiles; scope `orders/rules.go`; Go 1.25; no team override.
- **Status:** completed.
- **Inspected evidence:** `go.mod`, `orders/rules.go`, `billing/client.go`, packet context. Neither package imports the other, and the snapshot has no callers.
- **Coverage:** `go.duplication.share-knowledge` is complete. No required evidence is missing.
- **New applicability signals:** none.

## C-CT08-1: One gateway-call timeout is declared twice

- **Change anchor:** `orders/rules.go:5` `const GatewayTimeout = 2 * time.Second`; participant `billing/client.go:5` `gatewayTimeout`.
- **Basis:** `go.duplication.share-knowledge`.
- **Observation:** The context says both bound the same gateway call, so this is one decision. Changing it means finding and editing both packages, and nothing links them.
- **Remedy:** Declare it once as exported `billing.GatewayTimeout` in the client file, and have `orders` reference it or drop its copy. Tradeoff: `orders` gains a dependency on `billing`, and the client's ownership is inferred from the file name. If that is unwanted, use a small `gateway` package.
- **Preserve:** The 2-second value. The exported `orders.GatewayTimeout` has no snapshot consumers, but none outside the snapshot are confirmed absent.
- **Affected files:** `orders/rules.go`, `billing/client.go`.

**Not a candidate:** the identical `Eligible` functions (`total > 100`, line 7 in each file). Different teams own them and they have changed independently, so they should stay separate.
