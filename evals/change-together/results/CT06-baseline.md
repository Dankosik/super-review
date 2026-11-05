## Task result: CT06

- Snapshot: static packet `packet-CT06.json`, no commit identities; whole-snapshot anchors.
- Instructions: `content identity unverified`.
- Assignment: `ts.duplication.share-knowledge`; no profiles; scope `orders/src/label.ts`; no team override.
- Status: `completed`.
- Inspected evidence: all four packet files; `label`, `State`, `FETCH_TIMEOUT_MS`, both `load`s.
- Coverage: duplication base complete. No package or tsconfig files in the packet; this limits only the remedy.
- New applicability signals: `orders/src/label.ts` hosts a transport timeout in a label module (cohesion question).

## C-CT06-1: The gateway timeout has two owners

- Change anchor: `orders/src/label.ts:9` `export const FETCH_TIMEOUT_MS = 2000;`; `invoices/src/client.ts:1` repeats it.
- Basis: `ts.duplication.share-knowledge`; not convention-only.
- Observation: Packet context says both values derive from the same gateway's documented limit. A limit change therefore requires coordinated edits, and nothing links the copies. Finding the orders value also means looking in a label module.
- Remedy: Declare the constant once in a gateway-owned module, imported by both clients and removed from `label.ts`. The module's location is `unresolved`, because cross-directory imports depend on absent package configuration. Keep alternative: two copies, which leaves the coordination in place.
- Preserve: 2000 ms and per-call `AbortSignal.timeout`. The only visible consumer of the `label.ts` export is `orders/src/client.ts`; the snapshot is unreleased.
- Affected files: all inspected: `orders/src/label.ts`, `orders/src/client.ts`, `invoices/src/client.ts`.

Not candidates: the `label` switches map to different text ("Open" vs "Unpaid"), so they change independently. Nothing shows the two local `State` unions share one domain decision.
