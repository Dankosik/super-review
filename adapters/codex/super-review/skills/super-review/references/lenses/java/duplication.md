# Java duplication

## java.duplication.share-knowledge

**Shared knowledge.** Do the changed copies encode one rule that must evolve
together, or merely look similar? Identify the common decision and its actual
variation. A small domain helper or existing JDK/project operation can remove
repeated mechanics; a generic base class with hooks and flags may couple unrelated
operations more than the repeated code did.

Treat DTO mapping, construction, and boundary translation in context. Similar
field assignments between distinct external contracts are not necessarily one
abstraction. Do not introduce reflection, Lombok, a mapping library, or a builder
solely to reduce line count. Do not remove an established generator/framework
convention without a demonstrated burden in handwritten code. Generated output
itself remains excluded.

When proposing reuse, name the exact supported helper/API and preserve evaluation
order, mutability, null/absence policy, exceptions, and boundary-specific adaptation.
Equal constants may represent different units or policies. Extract the common
knowledge, not accidental syntax; retain duplication when that knowledge is
independent. Show what change to the already implemented rule becomes local,
without inventing future features as a reason to generalize.
