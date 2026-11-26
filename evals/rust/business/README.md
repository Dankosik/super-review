# Rust business-logic contrasts (`RB01-RB18`)

Maintainer/evaluator material only; never installed as review context.
Baseline: Super Review 3.38.0 at `dd2c61d3e068b7ffb45e6f72dbf86657ce9837bc`.

This corpus pairs 9 multi-file Rust business-logic `report` inputs with 9
symmetric `retain` controls across vertical call spines (`handler -> usecase ->
domain -> repo`, 4 to 8 files per crate). It closes previously uncovered Rust
lenses and profiles (`logic`, `placement`, `naming`, `conventions`,
`diagnostics`, business `effects-separation`) while keeping the eight base
lenses, 56 stable rule IDs, and fresh-context specialist isolation unchanged.

## Contrast pairs

| Pair | Lens (+ profiles) | Decision boundary |
| --- | --- | --- |
| `RB01` / `RB02` | `representation` | Flat `OrderRow` + scattered status/Option mutations vs boundary decode into runtime `OrderState` enum + owned `Order::cancel` (retaining plain `String` note and avoiding generic typestate) |
| `RB03` / `RB04` | `function-cohesion` + `effects-separation` | Interleaved renewal discount/grace rules + store/gateway/ambient clock vs short linear CRUD under lock guard (`TxGuard`) |
| `RB05` / `RB06` | `logic` | Nested `if`/`else` refund rules with redundant arms and implicit fallthrough vs exhaustive `match (role, state, reason)` + separate amount threshold guard |
| `RB07` / `RB08` | `control-flow` + `error-expression` | Crate-wide god-`AppError` mixing business outcomes, infra faults, and unreachable variants vs `Result<PayoutOutcome, InfraError>` + thin outer HTTP mapping |
| `RB09` / `RB10` | `placement` | Horizontal layer folders (`handlers/`, `services/`, `validators/`, `dtos/`) + `utils/` grab-bag against vertical `catalog/` vs cohesive vertical `invoice/` module |
| `RB11` / `RB12` | `naming` | Mixed `Org`/`tenant`/`account`, stale `seats_vec` map suffix, double negation `!not_suspended`, bare `86_400`, `into_summary(&self)` vs consistent `TenantSeats` vocabulary |
| `RB13` / `RB14` | `conventions` | `refunds.rs` introducing `f64` dollars + ambient clock against established `Money` + `UnixSecs` vs aligned `refunds.rs` + justified external bank CSV adapter |
| `RB15` / `RB16` | `rationale` + `diagnostics` | Stale cutoff comment, bare `#[allow(clippy::too_many_arguments)]`, context-free `"failed"` error, double logging vs accurate why-comment, structured error fields, single-boundary logging |
| `RB17` / `RB18` | `change-locality` | Shipment transitions and wildcard matches scattered across `dispatch.rs`/`cancel.rs`/`audit.rs` vs single owning `Shipment` impl with exhaustive matches and thin direct handlers |

## Replay and isolation

`inputs.json` contains neutral packets only; never pass `cases.json`, this
README, or peer runs to a reviewer. Feed one packet at a time with the normal
installed contract, Rust context, assigned lens/profiles, and candidate format.
Grade observation support, remedy quality, `Next change` evolvability reasoning,
compatibility, and retain discipline separately.

## Evidence status

- Offline compiler check: all 18 multi-file crates (`RB01-RB18`) passed
  `RUSTFLAGS="-D warnings" cargo check --offline --all-targets` on
  `rustc 1.98.1`.
- Mechanical fixture and isolation check: `bun test tests/rust-business.test.ts`.
- Behavioral baseline-versus-candidate model comparison: **NOT RUN**.
  Fixture compilation and mechanical checks verify valid Rust and package
  integrity, not model precision or recall.
