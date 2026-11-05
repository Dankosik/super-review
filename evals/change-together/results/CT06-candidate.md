## Task result: CT06

- **Snapshot:** static packet `packet-CT06.json`; no commit identity supplied.
- **Instructions:** content identity unverified.
- **Assignment:** `duplication`; no profiles; scope `orders/src/label.ts`; no team override.
- **Status:** completed.
- **Inspected evidence:** all four packet files and the gateway context.
- **Coverage:** base lens complete. The packet has no `package.json` or `tsconfig`, which limits only the remedy.
- **New applicability signals:** cohesion, `orders/src/label.ts`: a fetch timeout is exported from the label module. Is this the right home?

Considered and kept: the `State` union and `label` switch. Their labels differ ("Open"/"Unpaid"), so they are separate presentation decisions, and each `never` check guards its own switch.

## C-CT06-1: The gateway timeout has two independent owners

- **Change anchor:** `orders/src/label.ts`, line 9, `export const FETCH_TIMEOUT_MS = 2000;`. Partner: `invoices/src/client.ts`, line 1.
- **Basis:** `ts.duplication.share-knowledge`.
- **Observation:** Both values come from the same fact, the shared gateway's documented request limit. If that limit changes, both must be edited, and no compile error links them, so they can silently diverge. Nothing in `orders` signals that `invoices` holds a copy.
- **Remedy:** Give the constant one gateway-named owner imported by both clients. Its location is unresolved because the packet shows no shared package or module-resolution setup. Sharing the identical `load` wrapper is optional. Keep alternative: none supported, given the common cause.
- **Preserve:** The 2000 ms value and `AbortSignal.timeout` behaviour. Removing the `label.ts` export is safe for the inspected `orders/src/client.ts`; consumers outside the snapshot are unverified.
- **Affected files:** `orders/src/label.ts`, `orders/src/client.ts`, `invoices/src/client.ts`, plus the new owner.
