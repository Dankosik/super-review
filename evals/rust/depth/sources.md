# Primary sources and compatibility notes

Consulted for the Rust depth change on 2026-09-17. These references support decisions,
not mandatory style policy or dependency upgrades. The version shown by a documentation
page is not the target project's MSRV. Use its Cargo.toml/workspace inheritance,
feature/target context and relevant locked dependencies; unknown transitive or macro
constraints remain a specific gap. No Cargo or procedural-macro execution is implied.

## Language and standard library

| Decision | Primary reference | Availability / limitation |
| --- | --- | --- |
| Recognizable conversion versus named semantic operation | [From](https://doc.rust-lang.org/std/convert/trait.From.html#when-to-implement-from), [API flexibility](https://rust-lang.github.io/api-guidelines/flexibility.html) | Infallibility alone is insufficient; preserve meaning and consumer contracts. |
| View versus comparison-compatible borrow; implicit target API | [Borrow](https://doc.rust-lang.org/std/borrow/trait.Borrow.html), [Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html) | New impls change supported API/coercion obligations. |
| Meaningful construction choices and state types | [API Guidelines](https://rust-lang.github.io/api-guidelines/type-safety.html), [Book state-pattern discussion](https://doc.rust-lang.org/book/ch18-03-oo-design-patterns.html) | A builder or typestate must explain an existing protocol, not hypothetical variation. |
| Associated types, trait bounds and runtime boundaries | [Rust Book](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html), [trait reference](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility) | Do not trade a supported generic parameterization or dyn boundary for a cosmetic signature. |
| Derive-generated generic bounds | [Clone](https://doc.rust-lang.org/std/clone/trait.Clone.html) | A function-pointer field need not impose Clone on its output; retain a manual impl where its contract matters. |
| Input/result relationships and captures | [elision](https://doc.rust-lang.org/reference/lifetime-elision.html), [RPIT capture guide](https://doc.rust-lang.org/edition-guide/rust-2024/rpit-lifetime-capture.html) | Precise use captures are available since 1.82 for the free-function situation in RD27, not every syntactic position. Edition 2024 separately changes implicit captures. |
| Optional/fallible transformations | [Option](https://doc.rust-lang.org/std/option/enum.Option.html), [Iterator](https://doc.rust-lang.org/std/iter/trait.Iterator.html) | Ordinary transpose: 1.33; const transpose: 1.83. try_fold/try_for_each: 1.27. These are separate from eager/lazy and first-error contracts. |
| Downstream/public and environment constraints | [Cargo SemVer](https://doc.rust-lang.org/cargo/reference/semver.html), [MSRV](https://doc.rust-lang.org/cargo/reference/rust-version.html), [drop scopes](https://doc.rust-lang.org/reference/destructors.html) | Re-exports, trait/auto-trait impls, Send/Sync, drop and guard lifetime can constrain a local edit. |

The fixture MSRV is stated per input and is not a compatibility proof for a complete
dependency resolution. No unsupported constant-evaluation use is introduced.
Native async-trait syntax (1.75) does not establish equivalent dynamic dispatch or
returned-future Send contracts; see the [stabilization discussion](https://blog.rust-lang.org/2023/12/21/async-fn-rpit-in-traits/).
An error trait in core (1.81) is distinct from the older std error trait; do not
move a no_std crate to that newer path without checking its own baseline.

## Library observations, not universal baselines

The docs.rs pages consulted reported the following versions. `latest` links are
background references; packet manifests pin their direct versions explicitly.

| Library | Observed manifest minimum | Required distinction |
| --- | --- | --- |
| [Tokio 1.53.1](https://docs.rs/crate/tokio/latest/source/Cargo.toml) | Rust 1.71 | rt for JoinSet; macros for select. Completion order/drop-abort is not handle detachment. |
| [tokio-util 0.7.19](https://docs.rs/crate/tokio-util/latest/source/Cargo.toml) | Rust 1.71 | rt for TaskTracker; closed-and-empty completion, not abort-on-drop. |
| [Serde 1.0.229](https://docs.rs/crate/serde/latest/source/Cargo.toml) | Core manifest: Rust 1.56 | Not a verified minimum for serde_derive and all transitive dependencies. Distinguish derive, rc, alloc, format crates and no_std. |
| [clap 4.6.6](https://docs.rs/crate/clap/latest/source/Cargo.toml) | Rust 1.85 | This consulted manifest, rather than the earlier report's 4.6.7 label, is pinned in the inputs. Distinguish derive/env/string and default features. |
| [Axum 0.8.9](https://docs.rs/crate/axum/latest/source/Cargo.toml) | Rust 1.80 | json/query/macros and axum-core compatibility still matter. |

The runtime notes link the relevant primary mechanism documentation directly:
[Tokio JoinSet](https://docs.rs/tokio/latest/tokio/task/struct.JoinSet.html),
[TaskTracker](https://docs.rs/tokio-util/latest/tokio_util/task/task_tracker/struct.TaskTracker.html),
[shutdown](https://tokio.rs/tokio/topics/shutdown),
[Serde representation](https://serde.rs/enum-representations.html),
[Serde lifetimes](https://serde.rs/lifetimes.html),
[Serde features](https://serde.rs/feature-flags.html),
[clap derive](https://docs.rs/clap/latest/clap/_derive/index.html),
[clap Parser](https://docs.rs/clap/latest/clap/trait.Parser.html),
[Axum extraction](https://docs.rs/axum/latest/axum/extract/index.html),
and [Axum responses](https://docs.rs/axum/latest/axum/response/index.html).

Some version-specific docs.rs URLs were unavailable in the authoring tool; the
corresponding latest pages and displayed package manifests were read instead.
That limitation is not a reason to claim the target supports a new operation.
The new examples use static source and supplied contracts, not executed macro
expansions, benchmark results, or evidence of tested equivalence.
