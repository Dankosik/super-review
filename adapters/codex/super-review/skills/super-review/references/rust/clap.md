# clap mechanisms inside existing Rust questions

Use only for an implicated clap CLI and the assigned owner under
[Rust context](../languages/rust.md). This is not a separate CLI profile or a
requirement to adopt clap. Resolve the actual version, MSRV and features: `derive`,
`env` and dynamic `string` support are separate capabilities. Disabling default
features is not evidence that a clap version supports `no_std`.

## api-clarity

Does the code describe an existing CLI grammar once, or manually synchronize
argument declarations, extraction and a matching data model? `Parser`, `Args`,
`Subcommand`, `ValueEnum` and argument relationships can express a static grammar
more directly. Compare actual invocations, requiredness, cardinality, parsing,
help and errors; shorter derive text alone is not a benefit.

Keep `Command` construction for a genuinely dynamic grammar, a custom parser for
real value semantics, and an explicit subcommand match for clear orchestration.
Domain validation requiring application state need not become parser policy.
Do not introduce traits or handler registries just to remove a match.

Rust names are not the external CLI contract. Explicit `long`/command/value names
can preserve spelling during an internal rename. Defaults can erase the absence
needed for configuration precedence; inspect value provenance before replacing
manual merging. `parse` exits on an error, while `try_parse` returns it. Preserve
that boundary, diagnostics, environment handling and `PathBuf`/`OsString` inputs;
convenient string APIs do not justify new UTF-8 requirements.

## change-locality

Trace one supported command/argument change across declarations, help and dispatch.
Share an `Args` group or derive only when it removes genuinely repeated knowledge.
Visually similar options belonging to independently evolving commands can stay
separate. Preserve public argument IDs, flags and command names rather than
assuming local Rust consumers are the only consumers.

Sources: [derive reference](https://docs.rs/clap/latest/clap/_derive/index.html),
[derive tutorial](https://docs.rs/clap/latest/clap/_derive/_tutorial/index.html),
[Parser](https://docs.rs/clap/latest/clap/trait.Parser.html),
and [Arg](https://docs.rs/clap/latest/clap/struct.Arg.html).
