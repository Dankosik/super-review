## Task result: T

- Snapshot: whole-project local target, HEAD `e0b9bce1a9605715398ac56cc90592e8a28ac91a`; [`format.ts`](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/format.ts:1) SHA-256 verified before and after reading: `3ec710375d801eeb4d319b29a82e02781dc168acdca92f109ff05705fb61271a`.
- Instructions: Super Review `3.0.0`; trusted installed resources root supplied, content identity unverified.
- Assignment: TypeScript naming only; all production declarations in `format.ts` and their uses. Effective policy: `ts.naming.intent`; no `SUPER_REVIEW.md`.
- Status: completed.
- Inspected evidence: complete `format` and `retryMessage` declarations and their only production use; `package.json` (`private`, TypeScript 5.4.5) and `tsconfig.json` (`strict`, ES2022).
- Coverage: TypeScript naming completed. Excluded test, generated, vendor, and binary files; none were included in the literal-use search. No checks run.
- New applicability signals: none.

## C-T-1: Local formatter hides the roles of its inputs

- Change anchor: [`format.ts`](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/format.ts:1), local `format` at H lines 1–2; its sole call at line 5 supplies `delayMs` and `retryCount`.
- Basis: `ts.naming.intent`.
- Observation: `a` and `b` force a reader of the formatter to decode the template before knowing which number is the delay and which is the retry count. The caller reveals the roles, but that knowledge is not carried into the helper. The generic helper name also does not state that its transformation is retry-message formatting.
- Remedy: rename the helper and its parameters to `formatRetryMessage(delayMs, retryCount)`. This makes the declaration readable without translating positional placeholders and preserves the existing call’s named concepts. Keeping the current form is supported by its one local caller, but that only helps when reading both declarations together.
- Preserve: retain the emitted string, argument order, return type, and exported `retryMessage` API. The helper is not exported; literal search found no other production use.
- Affected files: [`format.ts`](/var/folders/9r/ft1t72w13r765bpf61v9mly00000gn/T/super-review-native-fixture-8ofll9bk/format.ts:1); no remaining consumer-context gap.
