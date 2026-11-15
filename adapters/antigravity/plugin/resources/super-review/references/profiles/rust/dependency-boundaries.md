# Rust dependency boundaries

Owner: abstractions
Rule: rust.abstractions.earn-the-boundary

**Information hiding.** Do callers of a changed boundary need implementation
knowledge that belongs on the other side? Inspect imports, exposed types and
construction. A private adapter or explicit parameter may localize knowledge;
a new trait or crate is not the default solution.

Visibility is the cheapest boundary. An item that is `pub` beyond its users, a
glob re-export of a module that also holds helpers, or public fields on a type
whose operations maintain an invariant each publish knowledge that callers may
come to depend on. `pub(crate)`, an explicit export list or a private field
keeps the freedom to change it. A glob import from a crate the project does not
control hides where a name comes from and lets a dependency update introduce a
clash; `use super::*` in a nested module and a curated prelude are the accepted
exceptions. A function that receives the whole application state or
configuration and passes it down so that one layer can read one field couples
every layer between to that type. Apply the shared compatibility judgment
before narrowing a published path.

Keep supported `core`, `alloc` and `std` environments and feature boundaries.
A no_std crate does not become std-capable because an API is convenient. Read
relevant manifest context, not the whole dependency graph. A third-party type
may intentionally form part of a public contract; wrapping it adds obligations.

Compare the smallest useful boundary with retaining the existing one. Preserve
public re-exports, trait contracts and target assumptions. Dependency migrations,
security audits and speculative architecture layers are outside this profile.
