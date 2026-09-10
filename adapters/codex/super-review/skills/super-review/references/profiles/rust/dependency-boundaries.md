# Rust dependency boundaries

Owner: abstractions
Rule: rust.abstractions.earn-the-boundary

**Information hiding.** Do callers of a changed boundary need implementation
knowledge that belongs on the other side? Inspect imports, exposed types and
construction. A private adapter or explicit parameter may localize knowledge;
a new trait or crate is not the default solution.

Keep supported `core`, `alloc` and `std` environments and feature boundaries.
A no_std crate does not become std-capable because an API is convenient. Read
relevant manifest context, not the whole dependency graph. A third-party type
may intentionally form part of a public contract; wrapping it adds obligations.

Compare the smallest useful boundary with retaining the existing one. Preserve
public re-exports, trait contracts and target assumptions. Dependency migrations,
security audits and speculative architecture layers are outside this profile.
