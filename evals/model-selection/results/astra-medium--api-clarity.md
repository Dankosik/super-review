## C-api-clarity-1: Pass existing DeliveryOptions through sendInvoice

- Lens and task: api-clarity; `api-clarity`. Completed for all supplied source.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/invoice/send.go`, `sendInvoice`, lines 6–7; callers at lines 10 and 13.
- Rules: `go.api.express-the-call`; no team overrides.
- Observation and cost: `true, false` and `false, true` hide two independent delivery choices. Readers must consult the signature to identify each flag, despite an existing `DeliveryOptions` type expressing the same contract.
- Transformation and benefit: Accept `DeliveryOptions` in `sendInvoice` and pass it directly to `sender.Send`. Use keyed literals at both callers to name the delivery choices.
- Counterargument: Two flags in a short local wrapper are manageable, and keyed literals add verbosity.
- Preserve: Both callers’ exact option values, zero-value semantics, the single synchronous `Send` call, and unchanged error propagation.
- Affected files: Local change to `internal/invoice/send.go`; both callers supplied.
- Missing context: None for this recommendation. Go 1.22 supplied; no `go.mod` text provided.

Also inspected `Invoice`, `Sender`, `Client`, and `NewClient`; no further candidates. Exclusions: tests, generated files, vendor trees, binaries, and unsupported languages; none supplied.
