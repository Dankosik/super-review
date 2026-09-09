## C-api-clarity-1: Pass `DeliveryOptions` to `sendInvoice`

- Lens and task: API clarity — `api-clarity`.
- Snapshot: PR `example/model-fixture#1`, H `bbbb…bbbb`, comparison D `cccc…cccc`.
- Location: `internal/invoice/send.go`, `sendInvoice`, lines 6–7; callers at lines 10 and 13.
- Rules: Go 1.22; no team overrides.
- Observation and cost: Two positional booleans obscure which delivery behavior each call enables. Callers require inspecting the implementation to distinguish `notify` from `force`.
- Transformation and benefit: Change `sendInvoice` to accept `DeliveryOptions` and pass it directly to `Sender.Send`; call it with named fields at each site. This makes the independent choices explicit and aligns the internal API with the existing HTTP-boundary contract.
- Counterargument: The function is internal and has only two callers, so positional arguments are locally manageable.
- Preserve: Keep both option values, their zero-value behavior, error propagation, and call/effect ordering unchanged.
- Affected files: Local change in `internal/invoice/send.go`.
- Missing context: none.

Completed. Inspected all supplied Go source and callers for the API-clarity lens. Excluded no files beyond the contract’s test/generated/vendor/binary/unsupported-language categories, none of which were supplied.
