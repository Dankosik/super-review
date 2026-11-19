# Rust specialist comparison, 2026-11-19

The baseline was Super Review 3.36.3 at `a6fb51e324ce3fde89c6184022cb64ff4049ab68`.
The candidate changed four Rust lens files. Each pair varied only its lens
text, neutral task identity and, in the module packets, the instruction
identity label. The contract, Rust context, profile selection, finding
template and source bytes were the same within each pair.

| Candidate Rust lens | SHA-256 of the dispatched Markdown |
| --- | --- |
| function-cohesion | `b26f23c08baffdde964ebc1e120c436469680edb126e461e2fc6f4b20843251b` |
| change-locality | `29b867f7fdd65eb2af8b1b2fe4688340124c9dbf688b28aeded8db9ccb99ebf6` |
| api-clarity | `aabbc959193555a62a951de749eccb6b76a7c6c8194b7da658ccf347a81201cf` |
| control-flow | `a1ecb2b476d0d5c7635d5fd3a605ef90817b7b876361e243ef9e127031464bc3` |

## Decisions

| Source and assignment | Baseline | Candidate | Source check |
| --- | --- | --- | --- |
| Outbox before extraction, function cohesion and effects separation | [m1](reports.md#task-result-m1) reported no candidate | [m3](reports.md#task-result-m3) extracted the error mapping | The nested match in `Handler::run` translates publication errors into permanent or retryable job errors. The proposed private function keeps each reason string and classification. |
| Outbox after extraction, same assignment | [m2](reports.md#task-result-m2) retained | [m4](reports.md#task-result-m4) retained | The handler already calls `.map_err(publication_job_error)`. Both left the mapping and the cooperative metadata scan in place. |
| RD54, unchanged single-caller helper | [h2](reports.md#task-result-h2) retained | [h1](reports.md#task-result-h1) retained | The helper owns checked arithmetic and the domain error returned to its caller. |
| RD75, local non-exhaustive enum, change locality | [p01](reports.md#task-result-p01) saw the hidden decision and suppressed it because of the attribute | [p02](reports.md#task-result-p02) named `Busy` | Inside the defining crate an exhaustive match lets the compiler flag the next status decision. |
| RD76, external non-exhaustive enum, change locality | [p03](reports.md#task-result-p03) retained | [p04](reports.md#task-result-p04) retained | A re-export preserves the external definition. The fallback also expresses the policy for future refusals. |
| RD77, private immediately awaited arithmetic, API clarity | [p05](reports.md#task-result-p05) removed the inner future | [p06](reports.md#task-result-p06) did the same | Both kept the read and mutation in the outer ticket future. |
| RD78, independently discardable tickets, API clarity | [p13](reports.md#task-result-p13) retained | [p08](reports.md#task-result-p08) retained | Creating or collecting futures leaves the counters untouched. |
| RD79, external exhaustive enum, control flow and defensive checks | [p09](reports.md#task-result-p09) suppressed the observation because the enum was foreign | [p10](reports.md#task-result-p10) named `Busy` | A dependency upgrade adding a refusal requires a new status decision. |
| RD80, local enum with a uniform default, same assignment | [p11](reports.md#task-result-p11) retained | [p12](reports.md#task-result-p12) retained | Every remaining refusal deliberately gets 503, including future ones. |

The callback and two enum recommendations surfaced only with the candidate in
this comparison. The async change clarifies when the existing advice applies.
Both arms reached the same async decisions.

## Inputs and grading

The real module came from [rust-service-template-rest PR 940](https://github.com/Dankosik/rust-service-template-rest/pull/940).
The before and after commits were `5f342f9a009b5545cf6fdc4d2e747f6ef475350e`
and `d1b84390cf023c18da2da9300c9811183f7584bb`. At both commits the target
was `crates/infra-messaging/src/outbox.rs`. Each specialist received one whole
file, including its test-only suffix excluded from review, with snapshot Rust
source and manifests for caller lookup. The packet named only the file, lens
and profile. It contained no diff, Git history, desired extraction or other
arm's output. The maintainer selected this disclosed example knowing the PR.

Fixture packets use the individual [inputs](../../inputs.json). Their public
API, support facts and source accompany each review. The
[grader expectations](../../cases.json) stay with the evaluator. Each fresh
specialist received one input, the shared contract, Rust context, assigned
Rust lens, selected profile if any, and finding template. Archived here are the
[complete specialist reports](reports.md), including the preliminary RD78 run.

In that preliminary [p07 run](reports.md#task-result-p07) the reviewer retained
deferred issuance and also asked for public documentation. The packet supplied
the first-poll contract as a scenario fact while the code omitted it. Both
members of the async pair gained the same rustdoc, then received fresh runs
in both arms. The preliminary result is excluded from the paired comparison.

All native specialist tasks used fresh contexts and requested
`gpt-6.1-terra` at high effort in Codex. Two preliminary standalone CLI
launches for the outbox inputs ended in HTTP 401 before inference, with no
review output. The desktop host then completed both arms. The host exposed
the requested settings and final responses. Effective backend model identity,
complete tool traces and time or token comparisons were unavailable.

The maintainer graded against the source with the arm mapping visible. A second
reader received the same sources and left/right reports in mixed order with task
identifiers and instruction identity removed. Its [assessment](assessment.md)
favored the candidate for RD75 and RD79. On the original outbox it found
the named mapping useful and keeping it local defensible. It saw a cohesion
tradeoff there and gave no separate credit for effects separation.
For A through I the left reports were m3, m2, p01, p04, p06, p13, p10,
p11 and h1. There was one final specialist run per arm per input.
This measures assigned specialist decisions on disclosed sources. Full review
routing, synthesis, repeated-run variability and effects on later maintenance
were outside this comparison.

## Compiler evidence

All six new packets passed `cargo +1.98.1 check --offline --all-targets` with
`RUSTFLAGS="-D warnings"`, edition 2024 and declared Rust 1.98. RD76 and RD79
included their local path dependency. Compiler checks used disposable copies
of authored fixtures; the outbox module was reviewed read-only.

On RD75 and RD79 the explicit three-arm match compiled, then adding a fourth
variant produced E0004 at the mapping. On RD76 the explicit three-arm match
already produced E0004 against the external non-exhaustive enum. On RD80 the
same compiler obligation would force an edit for a deliberately uniform
fallback. This is the defining-crate distinction in the
[Rust Reference](https://doc.rust-lang.org/reference/attributes/type_system.html#the-non_exhaustive-attribute).

For RD77 and RD78 a fixture consumer collected two futures, discarded the
first, and polled the second from a counter initialized to `u32::MAX`. Both
left the discarded counter unchanged and returned zero on the first poll of
the second. The language contract is documented under
[async functions](https://doc.rust-lang.org/reference/items/functions.html#async-functions).
