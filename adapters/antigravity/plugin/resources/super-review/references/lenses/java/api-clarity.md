# Java API clarity

## java.api.express-the-call

**Caller contracts.** Read declarations with representative calls. Can callers
understand units, options, absence, ownership, results, and required sequencing
without reconstructing implementation? Prefer a precise name, existing domain
type, or narrower operation before inventing an options object or builder. A
plain boolean or primitive is fine when its role is clear at actual uses.

Use `Optional` for a meaningful possibly-absent result when it improves the
contract and fits callers; it is not a blanket replacement for fields, parameters,
all nulls, or an empty collection. Keep an established nullable/framework boundary
when changing it only pushes conversion to every caller. A valid empty result
is not automatically an error. Preserve supported null and exception contracts.

Choose types that expose the capabilities the call needs without erasing useful
information. A collection interface may clarify a contract; changing a public
return type, generic bound, or overload still needs compatibility evidence.
Wildcards and type parameters should simplify actual typed uses, not move casts
or inference puzzles to callers. Prefer an existing value type to an unlabelled
`Object[]` or string-keyed map when the result has a stable domain meaning.

Inspect overload resolution, overriding, method references, external consumers,
and reflection/serialization contracts before signature changes. An empty literal
search does not prove there are no users. Narrow advice to a compatible change
when evidence is missing. Show a before/after call and which hidden obligation
it removes; do not add product capabilities or validation requirements.
