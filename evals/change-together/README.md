# Change together: duplication across areas

Maintainer/evaluator material only. Baseline: Super Review 3.5.0 at `a79b1bb`.

## Decisions

| Decision | Instruction action | Cases |
| --- | --- | --- |
| A partitioned duplication task finds partners outside its area | Search sentence in the Go, Rust, TypeScript and Java duplication lenses | CT01, CT06-CT08, live replay |
| A copy connected by the compiler costs an edit, not silent divergence | Compile-link sentence in the Rust, TypeScript and Java lenses. Go has no exhaustive switch or required field to connect copies | CT02, CT03, CT06, CT07, live replay |
| A recorded decision clears only what it names | No instruction change; baseline already held | CT03 |

## Replay

`inputs.json` holds neutral packets. Give a reviewer exactly one input object, with
the normal contract, matching language context, lens and candidate template from the revision
under test. Never send this README, `cases.json` or peer answers.

The live replay is one specialist on lens `duplication`, area `crates/jobs-worker`,
in a partitioned whole-project review of public
[rust-service-template-rest](https://github.com/Dankosik/rust-service-template-rest)
at `5d58c8bf`. Grade against the code as it stood there:

- **Should report:** histogram registrations copied in both bootstraps, where an
  unlisted name silently renders `DEFAULT_BUCKETS`.
- **Should report as uncoupled:** `replica_instance_id`, copied with no compile link.
- **Should not report:** signal, budget and teardown copies, which
  `docs/architecture/async.md` names. Sampler and session-budget matches should
  not stand as silent risks.

## Evidence

Measured 2026-11-05 and 2026-11-06 with the `super-review:specialist` Claude Code
role (its `opus` alias), session effort, fresh contexts, instruction copies in neutral
directories. One rater, the author, who knew the arms and wrote the instruction.
Raw reports are in [results](results).

| Live replay, `jobs-worker` | Runs | Named the histogram copy | Kept compile-connected maps out of candidates |
| --- | ---: | ---: | ---: |
| Baseline | 2 | 0 | 0 |
| Compile sentence only | 1 | 0 | 1 |
| Search and compile sentences (this change) | 2 | 2 | 1 |

| Static packet | Baseline | This change |
| --- | --- | --- |
| CT02, compile-connected copy | Candidate, remedy unresolved | Candidate, states the small cost and favors keeping |
| CT03, histogram list and named signals | Reports list, keeps signals | Same |
| CT01 | NOT RUN | NOT RUN |
| CT06, TypeScript: gateway timeout and differing labels | Reports timeout, keeps labels | Same |
| CT07, Java: attempt limit and sealed switches | Reports limit; proposes moving the switch onto `Kind` | Reports limit; marks the switch low cost, remedy unresolved, keeping defensible |
| CT08, Go: gateway timeout and independently owned predicates | Reports timeout, keeps predicates | Same |

The live replay is Rust only. For Go, TypeScript and Java the evidence is one static run per arm, where the whole snapshot is in the packet, so the search sentence cannot show its effect there. Five runs on one area cannot establish a rate, and the run counts are too small to
separate the two sentences' effects cleanly. Runs also varied in ways unrelated to
this change, as each arm's other candidates show.

## Tried and not adopted

These were in the first candidate and removed, because they showed no difference:

- Change-locality search and `git log` co-change. On `infra-webhooks`, baseline and
  candidate both found the copied observation limits. History added no new finding.
- A one-situation code signal in control flow. On a fixture with one-value branches
  and a documented backoff, baseline and candidate both reported the branches and
  kept the backoff.

Their reports remain in `results` with the `dropped-` prefix. A merge sentence in
verification and a recorded-decision sentence in the contract were also removed:
the first was not run, and baseline already held the second.


## Search from decisions (CT09-CT16, 2026-11-09)

Baseline: Super Review 3.8.0 at `c1512cf`. A maintainer read of the lenses found
that they say how to judge a found pair but give only names, literals and call
shapes as search keys, so a rewritten or renamed copy, a copy a change left on
the old value, a one-way exhaustive table and a copy in configuration were not
asked for.

| Decision | Instruction action | Cases |
| --- | --- | --- |
| Search keys a rewrite keeps: other spellings and units, external identifiers, sibling signatures; common values only with their unit | Search paragraph in all four duplication lenses | CT11-CT12, live replay |
| Search the old value when a change edits a decision | Old-value paragraph | CT09-CT10 |
| A reverse table ending in a wildcard is not compile-connected | Rust, TypeScript and Java compile paragraphs; Go states it has no exhaustive switch | CT13-CT14 |
| A partner may be configuration, a chart, a migration, a schema or a protocol file; a local-run fallback is not a second owner | Partner paragraph | CT15-CT16 |
| Name searched decisions in the existing coverage line | Coverage sentence; no new field or status | all |

### Evidence

Fresh-context Claude Code subagents, model `claude-sonnet-5-5`, one lens and one
input per run. The author graded against `cases.json` without blinding. Raw
outputs are the `results/search-*` files. A fresh independent maintainer audit
of the first candidate found a coverage rule that contradicted the contract
(no recorded search made a task unfinished), an unbounded search mandate, an
overstated Go compile claim, and a CT16 chart whose templating sat in
`values.yaml`. Those were fixed and the affected runs repeated; `-r1` files
predate the fix.

| Input | 3.8.0 | This change (final text) |
| --- | --- | --- |
| CT09 copy left on the old value | Found | Found |
| CT11 renamed copy, other spelling | Found | Found (r1) |
| CT13 hand-kept reverse table | Found | Found |
| CT15 partner in a chart | Found | Found |
| CT10, CT12, CT14 retain contrasts | Not run | No candidate |
| CT16 local-run fallback | Candidate (default as a second copy) | Candidate (unset versus invalid input, outside this lens); no longer treats the default as a copy |

| Live replay, `jobs-worker` at `5d58c8bf` | Runs | Named the histogram copy | Reported documented signal/budget copies |
| --- | ---: | ---: | ---: |
| 3.8.0 | 2 | 0 | 2 |
| This change, first candidate | 1 | 1 | 1 |
| This change, final text | 2 | 1 | 2 |

The small packets hold the whole snapshot in view, so 3.8.0 already found every
useful copy there; they show the new rules cause no regression and, apart from
CT16, no new noise. The live replay is where the search matters: the histogram
copy appeared in 2 of 3 candidate runs and 0 of 2 baseline runs (and 0 of 2 in
the earlier 3.5.0 baseline above). Both arms still reported the shutdown
primitives that `docs/architecture/async.md` assigns to separate owners. Five
live runs on one area cannot establish a rate.
