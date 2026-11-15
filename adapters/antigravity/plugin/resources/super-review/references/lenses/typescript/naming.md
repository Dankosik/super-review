# Naming

## ts.naming.intent

**Vocabulary.** Can a reader distinguish domain concepts, units, value roles, and
transformations from their names and nearby types? Read declarations with actual
uses. Recommend a rename when a Mysterious Name, vague or misleading, forces readers
to inspect an implementation or repeatedly translate between concepts. When no
honest name comes, the concept itself is murky; say so.

A named type can explain a recurring domain shape; an alias for `string` does not
enforce a new invariant. A branded type earns its place by enforcing one. Short
callback names and `T` can be clear in a small scope; descriptive type parameters
help when several roles must be distinguished. Keep familiar project vocabulary
instead of mechanically expanding every abbreviation.

Follow effective team style for prefixes, casing, and acronym spelling. A public
property name may be a serialization key; an exported name, JSX prop, or declaration
can have consumers outside literal search results. Separate a local rename from
an API change, and assess compatibility under the shared contract.
Show the particular ambiguity removed and the smallest useful rename.
