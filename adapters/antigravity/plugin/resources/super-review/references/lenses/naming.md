# Naming

## go.naming.intent

**Vocabulary.** Read the declaration and representative uses as one expression
of intent. Which concepts must the reader distinguish, and where does the naming
force them to reconstruct that distinction? Look for Mysterious Names: different
roles sharing a name, one concept changing names, or names hiding units, state,
or effect. When no honest name comes, the concept itself is murky; say so.

Recommend the smallest rename that resolves a demonstrated ambiguity. Evaluate
it with the package qualifier, receiver, scope, and established domain vocabulary;
`invoice.Total` needs no repeated package name. In a conversion, distinguishing
an incoming request from a stored record can matter more than longer names.

Keep ordinary `ctx`, `err`, receivers, and loop indices when their scope makes
them clear. Keep deliberately different concepts under different names. Follow explicit
team vocabulary; otherwise another equally understandable spelling is not a
finding. Preserve comments explaining why; renaming does not replace that context.

Inspect callers and compatibility before an exported rename under the shared
contract. This lens owns the vocabulary; flow and responsibility belong to their
own lenses.
