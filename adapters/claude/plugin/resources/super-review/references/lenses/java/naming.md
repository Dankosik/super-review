# Java naming

## java.naming.intent

**Vocabulary.** Read names at their declarations and actual uses. Can the reader
distinguish domain concepts, units, lifecycle states, and side effects without
opening the implementation? Prefer a rename that removes demonstrated ambiguity
over longer names that merely repeat a type or package.

Use established Java and project vocabulary. A meaningful method verb or a
unit-bearing parameter can clarify a call; a short loop variable in a small scope
may already be unambiguous. Compare `var` with an explicit local type by the
information visible at the initializer and uses, not a universal rule for or
against inference. Do not rename familiar API vocabulary for personal taste.

Before changing a class, method, property, enum constant, or parameter name,
inspect relevant overrides, method references, serialization/binding annotations,
bean names, and available consumers. JavaBeans accessors and framework-derived
query names may be contracts. Missing reflective or external uses favor a local
alias, documentation, or no rename over an unsupported compatibility claim.

Show the ambiguous use and the distinction the proposed name makes visible.
