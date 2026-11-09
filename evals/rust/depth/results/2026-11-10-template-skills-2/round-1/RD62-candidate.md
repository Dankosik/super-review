<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: candidate (working tree); input: RD62; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD62

- Snapshot: local packet, whole supplied source with no diff or base revision. Location is `.../scratchpad/packets/RD62`. File identities were not exposed.
- Instructions: `content identity unverified`. I read the installed `references/review-contract.md`, `references/languages.md`, `references/languages/rust.md`, `references/lenses/rust/api-clarity.md` and `assets/finding-template.md`.
- Assignment: lens `api-clarity` (rule `rust.api.express-the-call`), selected profiles none, team policy none. Scope is all of `Cargo.toml` and `src/lib.rs`, a released library whose stated public signatures stay supported. Baseline is edition 2021 and rust-version 1.85, with no features, workspace or `cfg` branches.
- Status: completed
- Inspected evidence:
  - `Cargo.toml` and all of `src/lib.rs`.
  - `Store` and `Store::root`.
  - `open_store<P: AsRef<Path>>`.
  - `HttpConfig`, `Listener` and `listener`.
  - The context facts: callers pass `&str` literals, `String`, `PathBuf` and `&Path` to `open_store`, and `listener` reads every field of `HttpConfig`.
  - No tests, generated code or vendored code is present, so nothing was excluded.
- Coverage: the base question is completed across every declaration. Profiles do not apply.
  - `open_store` needs no change. `AsRef<Path>` is what lets the documented caller types (string literals, `String`, `PathBuf`, `&Path`) be passed directly. The body borrows once and converts with `to_path_buf`, which fits a path that is stored. Narrowing it to `&Path` or `PathBuf` would break those callers.
  - `Store::root` returns `&Path`, a borrowed view with elided lifetimes and no extra relationship to express.
  - `HttpConfig` and `Listener` are plain public-field structs built with struct literals. Every field is read, so the config is a real value and not a bag of optional settings. A builder would add concepts without exposing a hidden choice.
  - `listener(&HttpConfig)` only reads, so borrowing is correct. Returning an owned `Listener` with cloned strings decouples the result from the config, which is a legitimate choice.
  - Units and absence are carried by types (`Duration`, `usize`, `String`). There are no booleans, `Option`s or fallible conversions to clarify.
  - The `*2` and `*3` multipliers in `listener` are unexplained derivation constants. They belong to the naming and rationale lenses, not to call-contract expression.
- New applicability signals: none

No candidates. The supplied API surface already expresses its calls, and no supported burden or compatible remedy was found within this lens.
