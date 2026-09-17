# Rust naming

## rust.naming.intent

**Vocabulary.** Can a reader distinguish concepts, units, states and ownership
transitions at declarations and actual uses? Explain the ambiguity that forces
an extra mental mapping. Prefer vocabulary already used by the surrounding API.

Conversion names such as `as_`, `to_` and `into_`, and iterator names such as
`iter`, `iter_mut` and `into_iter`, can communicate different access contracts.
Judge the implementation and receiver; a consuming conversion may still allocate.
Improve a misleading name, not every spelling that differs from a preference.
Short local bindings and conventional lifetime parameters can already be clear.

Use a representative call to show the removed ambiguity. Adding type suffixes,
getter prefixes or verbose lifetime names is not a benefit by itself. Distinguish
ordinary identifiers from public paths, trait method contracts and external names;
assess their compatibility under the shared contract. Keep the demonstrated naming
benefit separate from any unresolved migration decision.
