## C-naming-1: Rename `data` parameter to `lookupKey` in Resolve

- Lens and task: naming
- Snapshot: Synthetic PR https://github.com/example/model-fixture/pull/1 (H: bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb, D: cccccccccccccccccccccccccccccccccccccccc)
- Location: internal/customer/lookup.go, Resolve (line 5 declaration, line 6 use)
- Rules: go.naming.intent; team vocabulary (customer is the business entity)
- Observation and cost: The newly added Resolve declares its third parameter as `data string` and immediately passes it to `store.Find(ctx, data)`. The caller (LookupEmail in the same file) supplies a `lookupKey` that represents the customer lookup key, and the PR description states that the caller flow uses a customer lookup key together with the returned customer record. The name `data` supplies no distinguishing signal for this role, so a reader must reconstruct the concept from the call site, the interface, or surrounding context.
- Transformation and benefit: Change only the parameter name (and its one use) from `data` to `lookupKey`. The declaration and the argument to Find become `lookupKey`; the call inside LookupEmail remains `Resolve(ctx, store, lookupKey)`. The name now matches the lookupKey already used by the sibling function and the described customer lookup key, letting a reader track the key versus the returned record directly from the signatures.
- Counterargument: The function body is four lines and the argument's role can be inferred from the Store interface and the single call site; a generic name avoids committing to a particular key concept if the lookup evolves.
- Preserve: Parameter position and type, the call to Find, the error-return path, the zero Customer on error, and the returned value are identical. No change to the Store contract or any caller (none external exist).
- Affected files: internal/customer/lookup.go (local rename inside one declaration; LookupEmail call site is unaffected because argument expressions are independent of parameter names)
- Missing context: none

No other naming candidates were identified in the supplied declarations. The `record` variables carry a storage connotation but do not collide with any other identifier in scope and are not required to change to satisfy the lens. The names in internal/report/names.go introduce no tracked ambiguity under the supplied team vocabulary or the customer lookup flow.
