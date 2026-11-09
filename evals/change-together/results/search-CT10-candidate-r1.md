<!-- model: claude-sonnet-5-5; native Claude Code subagent, fresh context; 2026-11-09 -->
## Task result: CT10

- Snapshot: local packet CT10, change review of `delivery/src/retry.rs`. Base has `&[502, 503]` and head has `&[429, 502, 503]`. Source is the packet's `files` map. No commit or blob identities were supplied.
- Instructions: `content identity unverified`. Read from `<scratchpad>/dup/candidate/skills/super-review`.
- Assignment: lens `duplication`, rule `rust.duplication.share-knowledge`, no profiles. Scope is the change to `delivery/src/retry.rs` plus the rest of the snapshot as search space. No team override.
- Status: completed
- Inspected evidence:
  - `Cargo.toml`: edition 2024, rust-version 1.90. No part of the analysis depends on MSRV.
  - `delivery/src/retry.rs`: `RETRY_STATUSES` and `retryable`, read in full.
  - `breaker/src/trip.rs`: `counts_toward_trip`, read in full.
- Coverage: The searches covered every file in the snapshot. Test items are none and generated files are none.
  - The decision is the set of HTTP statuses classed as transient gateway or throttle failures. I searched for the old value `[502, 503]`, the new value, `502 | 503` and the literals 429, 502 and 503. I read two matches.
  - Match 1, `breaker/src/trip.rs`, `matches!(status, 502 | 503)`: it was identical to the old retry set. The edit made the two diverge on 429. The doc comment states that the exclusion is deliberate: throttling must not open the circuit because the upstream recovers on its own schedule. The context fact says a different team owns the breaker policy. The two sets answer different questions, "retry this request" and "count toward tripping the circuit", so the divergence is intended policy and not drift.
  - Match 2, the `retryable` function in `delivery/src/retry.rs`: this is the sole owner of the retry set, so there is no second copy within retry.
  - Both directions of the tables were checked. Neither side is a reverse or `FromStr` table. No handwritten general mechanism such as a parser, encoding or backoff is present.
  - Sharing the two sets would need a flag or a combined type to keep the 429 difference. It would also couple two independently owned policies.
- New applicability signals: none

No candidates. The overlap on 502 and 503 is incidental overlap between two independent policies, so the duplication is acceptable to keep.
