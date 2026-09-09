## C-api-clarity-1: Pass delivery choices as `DeliveryOptions`

- Lens and task: API clarity, api-clarity.
- Snapshot: PR 1, H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`, comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/invoice/send.go`, `sendInvoice` and its callers.
- Rules: Go 1.22; existing `DeliveryOptions` convention at the HTTP boundary.
- Observation and cost: `sendInvoice` accepts two positional booleans. Calls such as `sendInvoice(..., true, false)` require readers to look up parameter order to understand the independent delivery choices.
- Transformation and benefit: accept `DeliveryOptions` directly and have `OnCheckout`/`RetryManually` pass named-field literals. This makes each call self-explanatory and aligns the internal helper with the existing boundary contract.
- Counterargument: the helper is private and has only two nearby callers, so its parameter names are readily discoverable.
- Preserve: `NotifyCustomer` and `ForceResend` values, zero-value semantics, and the single delegated `Sender.Send` call and its error behavior.
- Affected files: local change in `internal/invoice/send.go`.
- Missing context: none.

completed — inspected all supplied non-test Go source for the API-clarity lens. Exclusions: tests, generated files, vendor trees, binaries, and unsupported languages; none were supplied.
