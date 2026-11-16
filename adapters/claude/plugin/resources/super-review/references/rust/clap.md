# clap mechanisms inside existing Rust questions

Use only for an implicated `clap` CLI under [Rust context](../languages/rust.md),
verifying resolved version, MSRV, and enabled features (`derive`, `env`,
`string`; disabling default features does not imply `no_std` support).

## api-clarity

- **Single-source static grammar**: express static flags, subcommands, value
  sets, and argument relations once via `Parser`/`Args`/`Subcommand`/`ValueEnum`
  instead of hand-synchronizing `Command` builders, extraction, and mirror
  structs.
- **Keep when**: the CLI grammar is genuinely dynamic (`Command` builder),
  domain validation depends on runtime state, or an explicit subcommand `match`
  already reads clearly (do not invent command traits or registries). Preserve
  external flag/command/value spellings explicitly across Rust renames, keep
  `Option<T>` without `default_value` when `None` distinguishes unset flags for
  layered config precedence, preserve `parse` (process exit) vs `try_parse`
  (returned error), and keep `PathBuf`/`OsString` inputs non-UTF-8 safe.

## change-locality

- **Shared vs independent options**: flatten a shared `Args` struct only when
  subcommands encode the same decision and evolve together; keep visually
  similar flags separate when commands own independent contracts, and preserve
  public argument IDs and CLI spellings.

Sources: [derive reference](https://docs.rs/clap/latest/clap/_derive/index.html),
[derive tutorial](https://docs.rs/clap/latest/clap/_derive/_tutorial/index.html),
[Parser](https://docs.rs/clap/latest/clap/trait.Parser.html),
and [Arg](https://docs.rs/clap/latest/clap/struct.Arg.html).
