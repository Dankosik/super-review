# Error expression

Owner: control-flow
Rule: go.flow.show-main-path

**Failure paths.** Read the changed error-handling structure and the participating
callers. Can a reader follow the already chosen failure policy without tracing
redundant transformations or learning a custom protocol? A sequence of ordinary
Go error checks with meaningful context may already be the clearest expression.

Clarify repeated mechanics or translation ownership only when a concrete reading
burden is visible. Keep useful context and domain adaptation. A generic helper
that hides exits or couples independent failure policies may be worse than
explicit checks; no error-count threshold justifies extraction.

Preserve error identity, wrapping, messages, ordering, logging responsibility, and
public return/status contracts. Do not find unchecked errors, prescribe retries,
judge HTTP statuses, or repair swallowed failures. Bug prevention alone is not
an in-scope benefit. Missing contract evidence limits the recommendation.

Show the failure-path knowledge the reader no longer has to reconstruct. Return
this owner's evidence even if abstraction or duplication also participates;
the parent reconciles the change under the effective rule, not a new error audit.
