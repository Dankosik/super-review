# Error expression

Owner: control-flow
Rule: go.flow.show-main-path

**Failure paths.** Read the changed error-handling structure and participating
callers. Can a reader follow the already chosen policy without tracing redundant
transformations or learning a custom protocol? Ordinary `if err != nil` with
useful context may already be clearest. Repeated syntax is not a reason for
callbacks, panic/recover, or a generic result framework.

Prefer direct propagation or supported standard error operations when they
express the existing contract more clearly than custom plumbing. Keep wrappers
that add operation context or intentional domain translation. Compare their
actual methods and consumers before calling them redundant.

Wrapping with `%w` exposes a cause to callers; `%v` can intentionally keep that
cause private. Do not switch between them merely for idiomatic spelling. Standard
`errors.Is`/`errors.As` matching can replace custom inspection when matching
through wrapped errors is already intended. Direct equality or an assertion may
intentionally inspect only the outer error; broadening that match is not a free
cleanup. Preserve custom matching behavior, joined errors, messages, and identity.

Keep result values and named results used by deferred cleanup understandable.
Do not remove such names or change defer scope just to simplify returns. Preserve
ordering, logging responsibility, and public return/status contracts; do not
find unchecked errors, prescribe retries, judge statuses, or repair failures.

Show the failure-path knowledge readers no longer have to reconstruct. A benefit
consisting only of preventing a bug is outside this profile. The parent reconciles
this owner's evidence with other lenses under its effective rule.
