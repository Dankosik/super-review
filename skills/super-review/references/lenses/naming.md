# Naming

## go.naming.intent

**Vocabulary.** Read the declaration and representative uses as one expression
of intent. Which concepts must the reader distinguish, and where does the naming
force them to reconstruct that distinction? Look for different roles sharing a
name, one concept changing names, or names hiding units, state, or effect.

Recommend the smallest rename that resolves a demonstrated ambiguity. Evaluate
it with the package qualifier, receiver, scope, and established domain vocabulary;
`invoice.Total` needs no repeated package name. In a conversion, distinguishing
an incoming request from a stored record can matter more than longer names.

Keep ordinary `ctx`, `err`, receivers, and loop indices when their scope makes
them clear. Do not homogenize deliberately different concepts. Follow explicit
team vocabulary; otherwise another equally understandable spelling is not a
finding. Preserve comments explaining why; renaming does not replace that context.

Inspect callers and compatibility before an exported rename. A naming benefit
must justify its migration scope. Own the ambiguous vocabulary, not an unrelated
flow or responsibility rewrite.
