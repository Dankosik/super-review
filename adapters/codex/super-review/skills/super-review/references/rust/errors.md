# thiserror and anyhow inside existing Rust questions

Use only for an implicated error type, conversion, or context chain under
[Rust context](../languages/rust.md), verifying declared crate versions and
features without prescribing a new dependency or crate migration.

## control-flow with error-expression

- **`thiserror` derives vs manual impls**: when `thiserror` is declared, replace
  boilerplate `Display`/`Error`/`From` triples with variant attributes, keeping
  manual impls that redact, localize, or compute messages. Avoid `#[from]` on
  broad shared types such as `io::Error` where `?` erases which file or request
  failed (carry operation context in fields or `map_err` instead), and use
  `#[error(transparent)]` for pure pass-through wrappers.
- **`anyhow` context preservation**: attach operation context via `.context` or
  lazy `.with_context` rather than `map_err(|e| anyhow!("...: {e}"))`, which
  flattens the cause into text and destroys `source()`/`downcast_ref` chains.

## api-clarity

- **Typed vs opaque boundaries**: expose typed errors on library APIs and
  internal boundaries where callers branch on failure modes; reserve
  `anyhow::Error` for reporting boundaries where no caller matches variants, and
  convert once at the boundary rather than mixing both along one call chain.
  Preserve existing public error types, `source()` chains, and downcasting
  contracts.

## rationale with diagnostics

- **Cause-preserving error output**: avoid interpolating a `#[source]`/`#[from]`
  field inside `#[error("...")]`, because chained error reporters then render the
  cause twice. Format `anyhow::Error` with `{:#}` or `{:?}` where diagnostics
  need the full cause chain rather than `{}` (which prints only the outermost
  context). Preserve `Display` text when inspected callers or log queries depend
  on exact wording.

Sources: [thiserror](https://docs.rs/thiserror/latest/thiserror/),
[anyhow](https://docs.rs/anyhow/latest/anyhow/),
[Context](https://docs.rs/anyhow/latest/anyhow/trait.Context.html),
and [Error](https://doc.rust-lang.org/std/error/trait.Error.html).
