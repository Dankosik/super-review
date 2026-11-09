<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD67; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD67

- Snapshot: Whole supplied source, with no diff or base revision. Local packet at `.../scratchpad/packets/RD67`. Identity is the working files `Cargo.toml`, `src/lib.rs` and `src/render.rs`. No hashes are available.
- Instructions: content identity unverified. Resources were read from the installed root `.../scratchpad/baseline/skills/super-review`.
- Assignment: Lens `abstractions` (rule `rust.abstractions.earn-the-boundary`), profile `dependency-boundaries`. Scope is all production declarations and uses in a private, unreleased crate. Effective team policy: none. Baseline is Rust edition 2021 with rust-version 1.85, and there are no features or cfg conditions.
- Status: completed
- Inspected evidence: `Cargo.toml`, `src/lib.rs` (`mod render; pub use render::*;`), and all of `src/render.rs`: `Row`, `Report`, `Format`, `RenderOptions`, `render`, `header`, `body`, `pad`. The context facts say the only consumer is the workspace CLI. It calls `render` twice, always with `Format::Text`, `include_header: true` and `width: 80`. `header`, `body` and `pad` are used only inside `render.rs`. I did not inspect the CLI source, so its uses rest on the packet's context facts.
- Coverage: Base question and the `dependency-boundaries` profile are both covered across all declarations. There is no missing evidence. Remedy status is stated per candidate.
- New applicability signals: none.

## C-RD67-1: Internal rendering steps are exposed as crate API through a glob re-export

- Change anchor: `src/lib.rs` `pub use render::*;`. `src/render.rs` `pub fn header`, `pub fn body`, `pub fn pad`. Anchored in the whole-source snapshot.
- Basis: `rust.abstractions.earn-the-boundary`, via the `dependency-boundaries` profile (information hiding of imports, exposed types and construction).
- Observation: The context facts say `header`, `body` and `pad` are used only inside `render.rs`, and the consumer calls only `render`. `mod render` is private, but the glob re-export makes all three public crate items. A reader of the crate surface sees four equally weighted entry points. They must infer that `render` is the operation and the other three are internals. `body` and `header` also take a bare `width` that duplicates `RenderOptions.width`. `body` computes `width - 8`, so each function's width handling is an unstated part of its contract. The glob re-export also makes every future `pub` item in `render.rs` public automatically, so the module's `pub` marking has to double as the crate's API decision. The burden is narrow and the cost is small. It is established by the declarations and the stated uses.
- Remedy: Make `header`, `body` and `pad` private to `render.rs` (drop `pub`). Re-export only what callers use, for example `pub use render::{render, Format, RenderOptions, Report, Row};`. The `Row`, `Report`, `Format` and `RenderOptions` re-exports are inferred from the `render` signature and the consumer's construction of `RenderOptions` and `Report`. Callers then learn one function and its option types. The helpers' width conventions become local. Alternative to keep: leave the glob if the crate is expected to offer composable rendering pieces. The source shows no such use.
- Preserve: The `render` signature and output text are unchanged. The facts say no other crate depends on this one, so narrowing visibility affects no known consumer. The CLI's own imports are not inspected. If it does `use crate_name::*` or names a helper, that import would need the explicit list.
- Affected files: `src/lib.rs`, `src/render.rs`. Needed consumer context: the CLI's import lines, not supplied.

## C-RD67-2: `Format` is a single-variant enum that gives callers a choice the crate does not offer

- Change anchor: `src/render.rs` `pub enum Format { Text }`, `RenderOptions.format`, and `match options.format { Format::Text => out.push_str(&body(report, options.width)) }` in `render`.
- Basis: `rust.abstractions.earn-the-boundary`, via the `dependency-boundaries` profile.
- Observation: `Format` has one variant, and the `match` is a single arm that forwards to `body`. It hides no existing variation. Callers still construct and pass `Format::Text` at both call sites, and the reader of `render` must learn `Format`, the match and `RenderOptions.format`. The same options struct carries `include_header` and `width`, but both consumer calls use the same constant values (true and 80), so those fields are only a parameter surface. The source shows no second format, only the shape for one. The strongest case against changing it is that it is a deliberate extension point. The packet states no requirement for a second format, and the contract bars inventing one. I did not find evidence that the enum is part of any external contract.
- Remedy: unresolved. The exact missing decision is whether a second output format is an actual near-term requirement of the owners. Supported alternatives:
  - If no format is planned, drop `Format` and its match. `render` would call `header` (when the header is wanted) and `body` directly, and `RenderOptions` would keep only fields that actually vary.
  - If a format is planned, keep `Format`.
  Separately, the always-constant `include_header` and `width` are a call-site observation only. Whether they should become defaults or stay fields is a tradeoff the source does not settle.
- Preserve: The `render` output for `Format::Text` is unchanged. The facts say the CLI constructs `RenderOptions` and `Format::Text` at two sites, so removing the enum would require editing those two sites in the same change. The CLI source is not inspected.
- Affected files: `src/render.rs`. Needed consumer context: the CLI's two `render` call sites.
