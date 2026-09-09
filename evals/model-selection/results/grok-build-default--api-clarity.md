## C-api-clarity-1: Use DeliveryOptions in sendInvoice instead of two positional bools

- Lens and task: api-clarity / go.api.express-the-call
- Snapshot: PR https://github.com/example/model-fixture/pull/1, H bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, comparison D cccccccccccccccccccccccccccccccccccccccc
- Location: internal/invoice/send.go, sendInvoice (and its call sites OnCheckout, RetryManually)
- Rules: effective defaults; no team overrides beyond supplied context; Go 1.22
- Observation and cost: sendInvoice declares `notify bool, force bool`. The two call sites pass bare literals (`true, false` and `false, true`). The reader must either remember the parameter order or look at the body (or the DeliveryOptions definition) to know which choice is being made. The same two choices are already expressed by the named fields of DeliveryOptions at the Sender boundary and (by the supplied context) at the HTTP boundary.
- Transformation and benefit: Change the signature to `sendInvoice(ctx context.Context, sender Sender, invoice Invoice, opts DeliveryOptions) error` and update the body to pass `opts` directly. The two call sites become `sendInvoice(ctx, sender, invoice, DeliveryOptions{NotifyCustomer: true, ForceResend: false})` and `...{NotifyCustomer: false, ForceResend: true}`. Callers now state the same contract that DeliveryOptions already makes visible elsewhere; no new type or builder is introduced.
- Counterargument: sendInvoice is unexported and the two call sites are adjacent in the same file, so a maintainer can see the literals in context. Adding the struct literal is a few more characters per call.
- Preserve: The concrete bool values, the zero-value semantics of DeliveryOptions, the error contract of Sender.Send, and the fact that OnCheckout and RetryManually remain the only two call sites.
- Affected files: internal/invoice/send.go (local change only; no other files contain callers).
- Missing context: none.
