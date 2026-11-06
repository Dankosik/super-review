# Rust maintenance decisions from disclosed generation research

Maintainer/evaluator material only. The development baseline is Super Review
3.6.0 at `e23c1b91186d60d323014750b02960fd4d4b93dd`. This is a bounded
instruction change to existing Rust owners, not another review category, rule ID,
worker, routing default, repair loop or promise of perfect code.

## Evidence being transferred

The user supplied the 2026-11-06 `rust-skill-decision-ablation` archive from
`rust-service-template-rest`, together with its earlier three-way comparison.
The representation candidate was adopted there in
[PR 342](https://github.com/Dankosik/rust-service-template-rest/pull/342),
commit `2f6a147a5e853ad77bd8cd949195e08afa986df9`. The generated programs
were local experiment artifacts, not source files in that commit.

The reported maintenance preference was 23 wins, 9 ties and 4 losses against
the preceding instructions, but 14 wins, 10 ties and 12 losses against Beautiful
Rust; clarity against Beautiful Rust was 10 wins, 10 ties and 16 losses. These
are 36 dependent readings across six tasks, not 36 independent tasks.
Compilation and tests were stopped during that study; subsequent-change work
was cancelled. The report does not establish complete correctness, actual
maintenance savings, instruction application or superiority over Beautiful Rust.

A nonblind source review found the following decisions worth preserving.
A separate fresh maintainer audit of the current Super Review baseline found
no missing general representation, staging or ownership rule. The additions
therefore make particular comparisons and retention conditions more explicit;
they do not establish that the baseline was incapable of making them.

| Research observation | Existing owner / action here | Counterexample that must survive |
| --- | --- | --- |
| Decoder phases distributed across flags and optional payloads | Representation: compare complete transitions and manually maintained relationships | Keep independent facts independent; preserve streaming, reservation and terminal-error semantics |
| Limit and consumed count used only through their difference | Representation: consider the remaining budget directly | Keep original values needed for diagnostics, history, snapshots or a supported cost constraint |
| Wildcard encoded by an empty list | Representation: distinguish a semantic name from a type guarantee | Empty conjunction can legitimately mean true; an enum carrying Vec does not prove nonemptiness |
| Repeated text/byte reconstruction after UTF-8 was established | Data flow: trace the property across the whole transformation | Byte positions, an independent validation boundary or an established cost constraint may justify byte processing |
| Field-oriented parsing reduces persistent phase bookkeeping | Data flow: compare the iteration unit with the decision | Do not materialize a stream or discard suspension state for a convenient batch operation |
| Full parse and buffered output preserve error precedence | Data flow: preserve the job done by staging | Streaming output is not equivalent when invalid input must leave output empty |
| Router parsing mixed with registration; copied priority expressions | Existing function-cohesion and duplication rules already apply; no new prose | Preserve error order and rank complete matches; exhaustive matches for separate responsibilities are not silent policy copies |
| Longer polynomial iterator chains obscure convolution | Existing control-flow guidance already allows direct loops; no new prose | Preserve wide intermediates and final narrowing; array representation ties remain legitimate |
| Missing standard error traits in one generated program | Existing API/error and explicit team-policy decisions; no blanket new rule | The task's mathematical contract did not require those traits; do not relabel every policy omission a correctness defect |
| Queues, wakers and publisher lifetime require coordination | Lifecycle ownership: distinguish authority from storage and inspect callbacks in a proposed replacement | Do not remove a necessary publisher counter or move sends outside a lock without preserving publication order |
| More detailed diagnostic wording showed no convincing benefit | No diagnostic instruction expansion | Existing error-expression guidance keeps causes, safe context and consumer contracts |

The original research's wins are not all equally compelling. Immediate physical
removal of dead sender entries can be a resource benefit, but was not a required
registry bound. A shorter channel-based implementation may hide callback timing.
Conversely, handwritten coordination is not justified merely because it exists.
A reader must compare the complete responsibilities.

## Diagnostic inputs and replay

`inputs.json` freezes six production-source views and their owning manifests.
Each input includes its behavior document as evidence, never as permission to
implement it. The production prefix ends before a conventional trailing
`#[cfg(test)]` module where present. These are disclosed diagnostic inputs;
they are neither new holdouts nor evidence of general superiority.

| Input | Original task / run | Purpose |
| --- | --- | --- |
| RM01 | rle_stream / d2c406797201d7c4c841aae9 | Flags, pending state and budget relationships |
| RM02 | rle_stream / 1c5f1e027b26000d84cf2dac | Already explicit decoder phases |
| RM03 | csv_cli / a43ce4c0eb9508ec52f79ea9 | Repeated UTF-8 reconstruction with required staging |
| RM04 | csv_cli / e39f567bdc7ae2c5162193e0 | Field-oriented parsing and output conversion |
| RM05 | subscriptions / 199fc1faa129a4f19b4dc99e | Separate publisher/storage lifetime and deferred callbacks |
| RM06 | subscriptions / cc70707b34d9b74adbe7ff61 | Weak-reference upgrades and publisher counting |

`cases.json` is evaluator-only. Give each reviewer one input, the shared
contract, Rust context, assigned lens, selected profiles and result template
from the revision under comparison. Keep this README, cases, peer answers and
arm mapping out of reviewer context. Accept different supported remedies and
grounded decisions to retain code. Observation and remedy are separate judgments.

The subscription packets explicitly supply dependency and caller facts needed
to assess a replacement without executing it. This helps bound the comparison
but also means it does not test independent discovery of those facts.

## Bounded comparison

Eight fresh single-specialist stages were dispatched, one per arm for RM01,
RM02, RM03 and RM06. RM04 and RM05 are retained diagnostic inputs, **NOT RUN**.
Four stages were active at most. The native request selected `gpt-6-sol` and
`medium` effort, matching the current Codex adapter's profile for questions
involving state, effects or lifetime. These are not reruns of the original Terra
generation experiment and not a full eight-lens Super Review.

The complete selected resources and one neutral input were supplied in each
packet. Two pairs used baseline-first dispatch and two used candidate-first.
No judge expectations or peer answers
were supplied, no attempt was replaced and all eight final responses are retained.
The comparisons used the same source, contracts, model/effort request, tools and
read-only restrictions. Full native context equality and independently observed
model/effort attestation were not exposed; requested settings are recorded
without inventing stronger telemetry.

| Input | Baseline | Candidate | Bounded interpretation |
| --- | --- | --- | --- |
| RM01 | [p01](results/p01.md): explicit phase enum | [p02](results/p02.md): phase enum and remaining budget | Additional source-supported budget observation in this one reading |
| RM02 | [p04](results/p04.md): no candidates | [p03](results/p03.md): no candidates | Clear-code retention preserved |
| RM03 | [p06](results/p06.md): derive the EOF condition instead of maintaining pending | [p05](results/p05.md): remove redundant field UTF-8 reconstruction | Different useful observations; not a candidate win by finding count |
| RM06 | [p07](results/p07.md): clarify the publisher counter and retain it | [p08](results/p08.md): same plus a shared close operation | Both retain the important ownership boundary; no isolated profile effect |

The owner authored the additions and knew the arm mapping. A separate reader
assessed anonymized result pairs against the source and evaluator cases; its
bounded [assessment](results/independent-assessment.md) is retained alongside the outputs.
It confirmed the remaining-budget observation and both clear-code keep decisions,
and treated the CSV observations as complementary. Its wording corrections remain
separate from raw answers: terminal decoder flags can coexist with inaccessible
residual state, and the CSV parser collapses doubled quotes rather than duplicating
them. Preserving the existing callback boundary does not certify its correctness.
Single readings on four
disclosed cases cannot establish recall, precision, net maintenance savings or a
causal improvement rate. No code was repaired, compiled or executed.
The lifecycle pair changes both data-flow and its profile, so it cannot isolate
which wording caused a difference. In particular, both arms already retained
the publisher count from the supplied context.

`results/receipt.json` records source/resource/packet/output identities, native
task names, requested settings and unavailable telemetry. Raw final responses
are preserved separately from interpretation; they are not complete tool traces.
`results/instructions.json` freezes both resource sets. The receipt's packet
assembly description and the neutral inputs reproduce each dispatched packet;
task-local scratch packets are removed after that reconstruction is checked.
The archive's presence or a reader's self-reported compliance is not proof of
actual full-context reading or forbidden-action absence.

## Next evidence and stopping point

Do not add more prose merely because this corpus contains another imperfect
program. Preserve the four source-local comparisons and the existing review scope.
Another iteration needs a new supported miss, overbuilt remedy, changed contract
or delivery failure.

A measured process claim needs frozen instructions, fresh tasks, repeats and
independent blinded assessment. Compare ordinary extra effort, author rereading
and fresh review under comparable total budgets, including repair. Give Beautiful
Rust the same process and compute opportunities. Pair continuations only when the
same starting draft and author context can actually be branched. Otherwise freeze
a distinct randomized design rather than reusing paired counts or thresholds.
A subsequent real modification is needed to claim realized maintenance benefit;
static preferences alone remain static preferences.

No release, version change, marketplace update or modification of the generation
repository is part of this change.
