# Quality judgment calibration

This instruction change responds to a review of `codex-retain`. It
changes judgment guidance, not reader mechanics, model selection, review category,
or release status. Evaluation packets and expectations are not runtime resources.

## Observed session

Source task: `01a088e0-41e0-7c62-9e5f-3c4c09ca681f`, “Проведи ревью Rust-кода”,
2026-09-10. Super Review 2.2.0; native fallback for an explicitly requested
whole-project local review. Reviewed HEAD was
`5920f33e8f8d2a438be540d3302fb7fb5718cdab`, with the snapshot's dirty engine comment.
Ten specialists used `gpt-5.6-terra` / `medium`. Read-only investigation examined
the specialist outputs, the final decision appendix, and source anchors; it did
not repeat the entire review or validate application behavior.

Eleven candidates became seven rejections, one unresolved observation, and three
accepted contributions narrowed/merged into two recommendations. Four specialist
passes returned no candidates. Quantity is not a recommendation-quality score.

| Evidence | Assessment |
| --- | --- |
| Naming initially assessed only the dirty comment despite reading broader source; the parent requested a corrected whole-project pass, which returned N-001 | A scope-routing failure, subsequently repaired. The assignment packet should state review extent explicitly. |
| N-001 demonstrated an integer seconds unit hidden by `duration`; final rejection cited two uses and unknown public consumers | Compatibility uncertainty is real, but does not refute the naming benefit. Preserve the observation or assess a compatible remedy. |
| API candidate 1 argued from `execute(..., true)`, whereas the production caller used nearby named `apply` | Unsupported example. The parent correctly rejected that argument. Actual source, not a hypothetical call, must support the burden. |
| API candidate 3 identified positional flags but proposed `create_locked` for a function that does not lock | Valid observation with an inaccurate remedy. Repair the name before rejecting the observation. |
| API candidate 2 was dismissed because writable is an ordinary binary mode | This does not resolve the demonstrated call-site lookup burden. It needs a concrete tradeoff. |
| Control-flow candidate 1 changed bootout authorization; candidate 2 changed emitted error diagnostics | Exclusion from a behavior-preserving clarity pass is defensible; this investigation establishes neither as a bug. |
| Cohesion, data flow, duplication and rationale returned no candidates with specific ownership, durability, compatibility or nearby-documentation reasons | These are substantive keep arguments. No-findings results do not by themselves show weak work or exhaustive discovery. |
| Duplication reported that requested resources were unavailable, then returned PASS | Its source rationale can be assessed, but exact instruction adherence is not established by that result. Existing missing-resource/coverage rules already address this; no speculative new fallback was added. |
| Abstractions retained an unresolved library-boundary decision; representation identified real protocols but proposed additional models | Useful observations with open tradeoffs. A blanket instruction to accept all findings would also be wrong. |

The causal claim is limited: the instructions contain conservative defaults and
the parent applied some weak rejection arguments, but the trace alone cannot
isolate wording, model behavior, context delivery, or task adaptation as the cause.
No model-specific adjustment is justified by this single session.

## Candidate

The shared contract now favors supported improvements in the resulting code,
separates patch-writing effort from lasting complexity, and assesses compatibility
from actual commitments. Verification can revise an inaccurate remedy rather
than discard the observation. Specialist guidance anchors improvements in actual
declarations/uses, and Rust API guidance distinguishes named choices from opaque
flags. Related Go/TypeScript compatibility wording points to the same contract.
Rule IDs, eight base questions, optional profiles and read-only boundaries remain.

## Independent stage comparison

Four fresh child contexts read only their selected packet and role resources.
Both arms used `gpt-6-astra` / `medium`; these are **not** tests of the default
Terra specialist profile or the full native adapter. Baseline ran first, candidate
second, once per role; order was not randomized. The saved receipt identifies
baseline commit, exact instruction/packet hashes, models and sessions. Raw final
outputs are retained in `results/`. No expected answers or peer outputs were sent.

| Decision criterion | Baseline | Candidate |
| --- | --- | --- |
| API A: expose the actual file-opening operations without inventing locking | Found the burden; proposed std `File::open` plus local marker options | Found the burden; proposed two explicit helpers |
| API B: retain a call already clarified by `options.verbose` | No candidate | No candidate |
| C1: support a seconds rename when owner confirms no library API commitment | Accepted | Accepted |
| C2: preserve a supported released method while retaining the naming observation | Unresolved; acknowledged a possible compatible remedy | Accepted an added explicit method with the old method forwarding |
| C3: repair an inaccurate locking name without losing the positional-flags observation | Accepted revised operations | Accepted revised operations |
| C4: reject a hypothetical literal-call argument contradicted by complete source | Rejected | Rejected |

The candidate did not improve every answer: baseline API A used existing standard
operations and avoided the candidate's extra helper/configuration surface. Both
are supported choices in this simplified fixture. C2 shows a more constructive
compatible remedy in this run, not proof that adding a public alias is always best.
The old instructions already handled most contrasts well. These results establish
bounded plausibility and retained discrimination, not a general quality gain.

For replay, provide only `packets/api.md` plus the contract, Rust context, Rust
API lens and candidate template, or `packets/acceptance.md` plus the contract and
verification. Reconstruct baseline resources from the receipt's Git commit; use
matching candidate hashes. Keep this file, results and expectations out of packets.

Remaining evidence: repeat with Terra medium, vary order, separate shared-judgment
and lens-specific effects, and compare complete native review handoffs on realistic
positive and clear-code scopes before claiming a default-profile improvement.
The instruction change is included in 2.3.0. Evaluation hashes identify the
pre-release 2.2.0-labeled candidate; the release changes version metadata only
within these policy resources. These runs do not establish local plugin installation.

## Mechanical validation

`skill-creator` quick validation, `bun run build`, `bun run validate`,
`bun run package`, and `git diff --check` passed. The six existing prompt-context,
resource-context, Rust support/routing, Go idioms and TypeScript test files passed:
31 tests, zero failures. Generated Codex and Claude policy copies are byte-identical
to the canonical skill; all 33 stable rule IDs remain valid. No TypeScript source
or reader behavior changed. These checks do not measure recommendation quality.

The first build could not resolve absent dependencies. Installing the existing
frozen lockfile resolved that environmental failure; the subsequent build passed.
