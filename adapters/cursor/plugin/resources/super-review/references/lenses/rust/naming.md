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

Rust readers predict a contract from established name forms. `new` is the
primary constructor and `from_*` a conversion constructor; `with_*` builds with
one more setting, as a constructor (`with_capacity`) or a consuming setter.
`is_*` and `has_*` return a `bool`. A `try_*` twin returns as a value the
failure its sibling panics on, waits out or cannot have. A `*_mut` twin lends
exclusive access. A getter takes the field's name without `get_`, unless there
is one obvious thing to get. Error types keep one word order across a crate, as
std's `ParseIntError` does, and an extension trait carries an `Ext` suffix. A
name that borrows one of these forms for a different contract misleads more
than an unconventional one, so read the body before trusting or changing it.

Look for vocabulary the source leaves unsettled: one concept under two names,
such as tenant and account, or two concepts under one; a name that states a
representation the type has since left, such as `users_vec` holding a map; a
negated boolean whose uses read as a double negation; a bare literal whose unit
or meaning lives only with its author, where a named constant says it; a
single-letter type parameter or closure argument where several share the scope
and play different roles; one word abbreviated three ways in one module.

Use a representative call to show the removed ambiguity. Adding type suffixes,
getter prefixes or verbose lifetime names is not a benefit by itself. Distinguish
ordinary identifiers from public paths, trait method contracts and external names;
assess their compatibility under the shared contract. Keep the demonstrated naming
benefit separate from any unresolved migration decision.
