<!-- model: claude-sonnet-5-5; arm: candidate; input: RD42; tool: native Claude Code subagent, fresh context -->
## Task result: RD42

- Snapshot: local packet RD42, no PR or B/H/D. Source is the two supplied files, `Cargo.toml` and `src/lib.rs`, with no commit or blob identities.
- Instructions: super-review at the scratchpad `eval/candidate` root, content identity unverified.
- Assignment: lens `change-locality` (rust.change.localize-existing-variation), no profiles. Scope is all supplied production declarations and uses in a private, unreleased module, with no external API commitment or team override.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2021, rust-version 1.85.
  - `src/lib.rs`: `Settings`, `parse_target` and `parse_target_v1` in full.
  - Packet context: production still enables `accept_v1_targets`, and the team plans to remove it after the last agent upgrades.
- Coverage: the base lens is fully covered for the supplied source. No other callers were supplied, so none were inspected.
- New applicability signals: none

No candidates.

- **Live compatibility path:** the v1 branch is not dead code. Production selects it through `accept_v1_targets`, so by the lens it is a compatibility path kept alive by a current consumer. Such a path needs its selection and removal condition where a maintainer will find them.
- **Selection:** the only selector is the `accept_v1_targets` check at the top of `parse_target`.
- **Removal condition:** the doc comment on `parse_target_v1` records it ("until every agent upgrades; the deployment notes track the remaining v1 agents"). Removal touches only the flag, the branch and that function.
- **Duplicated knowledge:** the v1 parser is a distinct format, `host:port[:weight]`, split on the first colon. The current parser splits on the last colon. They are separate formats rather than a copied rule, so the two parsers do not make one rule an edit in two places.
- **Preserve:** the plan to remove `accept_v1_targets` and `parse_target_v1` together stays valid.
