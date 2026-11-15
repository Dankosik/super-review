# Abstractions

## go.abstractions.earn-the-boundary

**Information hiding.** Inspect a boundary and its actual consumers and apply the
deletion test. What policy, variation, representation, or dependency knowledge
does it remove from callers? Compare that benefit with the concepts and
navigation it adds. A shallow wrapper that passes the same knowledge through
another layer is a Middle Man; a deep one earns its place.

At the consumer, consider an existing standard capability such as `io.Reader`,
a narrow consumer interface, or a function parameter for one operation. Do not
mirror a producer's entire method set. A single implementation can justify an
interface; returning a concrete type can expose useful behavior without an
interface twin. Neither is a universal signature rewrite: preserve deliberate
factory contracts and inspect real consumers before changing exported types.

Retain wrappers that own units, adaptation, error translation, retries, or
lifetime. Explicit forwarding can intentionally restrict a method set; embedding
promotes methods and is not merely shorter delegation. Inspect relevant methods,
interface uses, and exposed fields before removing a wrapper or changing embedding.

Compare custom mechanics with an existing project or supported library operation.
Keep a helper that adds domain meaning. Generics should preserve a real algorithm
or type relationship used by callers; when only an interface's methods are needed,
a type parameter may add nothing. Do not erase useful typed results or replace
genuinely dynamic reflection with an artificial generic framework. Judge actual
use, not a quota of implementations or instantiations.

Show what consumers no longer need to understand and preserve the observable
contract. The goal is boundaries that each pass the deletion test: remove the
ones that only add a hop, deepen the ones that leak, and keep the ones whose
benefit outweighs their indirection.
