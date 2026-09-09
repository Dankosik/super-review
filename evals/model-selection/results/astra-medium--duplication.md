## C-duplication-1: Share the free-shipping threshold

- Lens and task: duplication; `duplication` — completed across both supplied files.
- Snapshot: PR https://github.com/example/model-fixture/pull/1; H `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`; comparison D `cccccccccccccccccccccccccccccccccccccccc`.
- Location: `internal/shipping/fees.go`, `Fee` line 3 and `CartMessage` line 7.
- Rules: `go.duplication.share-knowledge`.
- Observation and cost: Both functions encode Pricing’s shared threshold as `15000`. Updating only one would make the cart message disagree with the checkout fee.
- Transformation and benefit: Introduce one package-private `freeShippingThreshold` constant and reference it in both comparisons, giving the shared value one change point.
- Counterargument: Two literal comparisons are easy to read; sharing is justified here by the explicit requirement that the threshold change together.
- Preserve: Inclusive `>=` boundary, fee values, returned messages, and Pricing’s ownership.
- Affected files: Local change to `internal/shipping/fees.go`.
- Missing context: none.

`internal/eligibility/policies.go` warrants no candidate: purchasing and supplier onboarding own independent policies despite identical expressions.

Exclusions: tests (`*_test.go`), generated files, vendor trees, binaries, and unsupported languages; none supplied. Review limited to the supplied offline snapshot and stated Go 1.22 context.
