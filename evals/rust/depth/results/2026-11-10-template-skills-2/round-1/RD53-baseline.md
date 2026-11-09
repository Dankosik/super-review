<!-- model: claude-sonnet-5-5 (requested native alias `sonnet`); arm: baseline fffcf9d; input: RD53; tool: native Claude Code subagent, fresh context; the scratchpad prefix is shortened to `.../scratchpad` -->
## Task result: RD53

- Snapshot: whole supplied source, no diff or base revision. Location: .../scratchpad/packets/RD53. Files: Cargo.toml, src/lib.rs. Commit and blob identities are not exposed.
- Instructions: content identity unverified. Installed resources were read from the skill root supplied in the task.
- Assignment: lens function-cohesion (rust.functions.extract-for-clarity, rust.functions.coherent-purpose). Selected profiles: none. Scope: all production declarations and uses in src/lib.rs, a private, unreleased module. Team policy: none.
- Status: completed
- Inspected evidence: Cargo.toml (edition 2021, rust-version 1.85, no features or dependencies). src/lib.rs in full: Line, Totals, summarize, add_line, apply_bulk, line_cents, build_totals. Context facts say add_line, apply_bulk and build_totals each have a single call site in summarize, and line_cents is called from add_line and apply_bulk.
- Coverage: base lens completed over all declarations. No profile was selected. No test-only or generated items were present. No missing evidence.
- New applicability signals: none. The out-parameter `&mut` accumulators are local mutation and not an effects-separation signal.

## C-RD53-1: summarize splits one accumulation loop into single-use helpers that communicate through `&mut` out-parameters

- Change anchor: .../scratchpad/packets/RD53/src/lib.rs, whole-project snapshot. Symbols: `summarize` (lines 13-22), `add_line` (24-27), `apply_bulk` (29-33), `build_totals` (39-41). Spans: `add_line(line, &mut subtotal_cents, &mut units);`, `apply_bulk(line, bulk_threshold, bulk_percent, &mut discount_cents);`, `build_totals(subtotal_cents, discount_cents, units)`.
- Basis: rust.functions.extract-for-clarity, rust.functions.coherent-purpose. No team convention applies.
- Observation: The whole computation is one linear loop of about three lines of arithmetic. It is split into three private helpers, each with exactly one call site.
  - `add_line` and `apply_bulk` do not return a value. Each mutates a caller-owned accumulator through `&mut`. A reader of `summarize` cannot see how `subtotal_cents`, `units` and `discount_cents` change without opening two other functions.
  - The helper signatures carry extra plumbing: four and five parameters, with `&mut` for each accumulator.
  - The bulk rule, `quantity >= bulk_threshold` followed by `line_cents * bulk_percent / 100`, is the only domain decision here. It is hidden behind a name that only restates the call.
  - `build_totals` only moves three locals into a struct literal. It names no operation that the literal does not already state.
  - No helper removes knowledge from the caller. The extra arguments and navigation are a real reading cost.
  - Strongest evidence for keeping: `line_cents` is a coherent, reused operation (quantity times unit price) and should stay. It is not part of this observation.
- Remedy: Inline `add_line`, `apply_bulk` and `build_totals` into `summarize`. Keep `line_cents`. The loop would read as follows, with `let` bindings for the accumulators and the unchanged `Totals` literal after the loop:
  ```rust
  for line in lines {
      let cents = line_cents(line);
      subtotal_cents += cents;
      units += line.quantity;
      if line.quantity >= bulk_threshold {
          discount_cents += cents * bulk_percent / 100;
      }
  }
  Totals { subtotal_cents, discount_cents, units }
  ```
  The `&mut` plumbing disappears, and the per-line computation, the subtotal and the discount are visible in one place. The extra `let cents` also removes the second `line_cents` call. Tradeoff: `summarize` becomes slightly longer, though still a short function. If the bulk rule should be named, a pure `fn bulk_discount_cents(line, threshold, percent) -> u64` that returns a value would be a clearer extraction than the `&mut` version. That is optional.
- Preserve: Public signatures of `summarize`, `Line` and `Totals` are unchanged. Evaluation order and the arithmetic are unchanged, as are the integer widths and the division. The helpers are private, so there is no external API commitment.
- Affected files: src/lib.rs only. All uses were inspected.
