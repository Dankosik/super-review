# Verify recommendations

**Own every acceptance.** The orchestrator owns final acceptance while
specialists supply evidence-backed observations: treat every candidate
(including your own, across base lenses, conditional lenses, and profiles) as a
claim to test under the [contract's judgment bar](review-contract.md#judgment-and-acceptance),
answering for each accepted change as if you wrote it yourself and giving every
decision row its own source-backed reason. Agent agreement, self-reported
confidence, routing signals, and pattern names are leads to check, never
evidence, and a profile never revives a disabled or conflicting owner rule.
Resolve snapshot, scope, policy, and instruction identity from the task header
first (resolving conflicting material through installed resources rather than
assuming matching version labels mean matching text), reuse complete matching
source already in context, fetch missing changed declarations, **D**-side
comparisons, and cited uses instead of rereading everything, and verify the link
to assigned scope, effective rule, and concrete burden (explicit team
consistency is a valid, separately stated basis; disguised bug reports and
imagined future requirements are outside scope). When specialists return candidates spanning a module or vertical call spine
(`entry -> usecase -> domain -> store`), group and verify them by owning spine
rather than scanning a flat list end to end. Before adjudicating individual
micro-candidates on that spine, run a brief **Spine-First Design It Twice**
check while holding the spine's full declarations in view: state how a strong
engineer in this language would express this scenario directly today (domain
types owning invariants and transitions, pure decision rules separated from a
thin I/O shell where it clarifies reading, and direct control flow without
ceremony), test that shape against one realistic next change from existing
variation, and then reconcile specialist candidates against it so overlapping
local symptoms collapse into coherent root fixes without late-list anchoring.

**Verify the anchor against pinned bytes.** Validate location independently of
quality under [source-access rules](harnesses/source-access.md#file-boundaries-and-source-anchors):
match path, old/new side (**H**/new paths for surviving code, **D**/old paths
for deleted comparison evidence, preserved path mappings for renames, and the
selected index/worktree view rather than `HEAD` alone for local changes),
containing symbol, enclosing context for repeated snippets, and exact source
line range; never use diff hunk offsets or a moving branch, or treat a removed
declaration as code still present at **H**. Repair a wrong line or stale path
from already-supplied matching bytes (without another full scan) when the same
observation holds at a verified location; cite verified path, symbol, and
distinguishing source span without guessing when line numbers are unavailable;
and retain an unverified expression or association as an explicit gap outside
implementation advice, without turning a positioning failure into either
acceptance of an unsupported claim or rejection of a separately supported
burden.

**Trace the factual premise.** Trace the relevant construction, branch, and
source-supported countercase in the explanation (whether named fields can
coexist, whether the operation adds or removes data, whether a guarantee is
enforced by the type or only by current control flow, and what effective state
callers observe versus raw stored values, as bounded evidence for the
recommendation rather than a program-wide correctness audit). Narrow an overstated
explanation when the concrete maintenance burden survives; an accurate remedy
never makes an inaccurate premise acceptable.

**Separate observation from remedy.** Decide two independent questions: *is the
observation supported?* and *is the remedy ready for implementation?* Repair an
inaccurate proposed name or overbuilt remedy rather than discarding its
supported observation, and choose decisively between supported alternatives with
a stated engineering reason (accepting with a stated risk is not a decision, and
the observation's main point is never an optional part of its remedy). Leave a
supported observation `unresolved` (with its specific gap and no implementation
instruction) only when settling the remedy requires a fact source cannot supply
(external consumer, product intent, or unrecorded team preference, naming that
fact) or would change a behavioral decision under the contract; reject an
unsupported observation or leave it `unresolved` pending identified source.
Judge caller and implementation together at the candidate's actual scope: reject
for insufficient benefit only with a source-specific tradeoff (never merely
because a name, type, helper, or signature changes), and fix shared underlying
causes under [Aim for the best version](#aim-for-the-best-version) rather than
justifying a redesign by piling up unrelated tweaks.

**Check preservation, project checks, and existing owners.** Inspect the
preservation constraints implicated by the transformation under
[language routing](languages.md) (exact supported operation/signature, accepted
inputs, error identity and which error surfaces first, effects, API/type
contracts, ownership/mutation, cancellation and drop timing, time precision,
wire or stored bytes, and absence), keeping each language's rules scoped to its
own context: Go, TypeScript (including type inference and emitted module
behavior), Rust (trait/auto-trait contracts, ownership, eager/lazy evaluation,
and guard/drop lifetimes), and Java (null/absence, overload/override and generic
signatures, mutability, evaluation timing, exception causes, and resource or
framework/proxy ownership). Never infer equivalence from a happy-path example or
empty literal search, and claim no tested equivalence; narrow or keep
`unresolved` any advice needing a newer API or unsettled compatibility fact.
Before accepting a candidate (or rewriting/adding one of your own), check from
read-only source:

- **External boundary behavior:** read locally available standard-library or
  lockfile-resolved dependency source under
  [source-access rules](harnesses/source-access.md#file-boundaries-and-source-anchors)
  whenever a boundary detail depends on what an external callee actually does.
- **Committed project checks:** read whether the resulting code passes the
  project's lint policy (`clippy.toml`, `[lints]`, crate-level `deny`),
  duplication baselines, generated or template-region markers, and doc/CI/build
  checks (read them; never run them).
- **Every affected use:** read every use of a changed type or name (including
  excluded tests), name collisions, and code left dead once optional regions
  are removed; repair or reject a remedy that breaks them.
- **Existing owners:** search the snapshot, standard library, and declared
  dependencies whenever a remedy introduces a type, helper, or constant, or
  whenever the target code itself hand-writes standalone helpers, single-purpose
  wrapper/guard types, manual trait/interface impls, or boundary glue around
  standard/imported types: reuse an existing owner (or hand over generic
  mechanics under `existing-helpers` while keeping application domain/protocol
  rules), explain why a new owner is needed, or check `rationale` when a
  boundary difference requires keeping custom code.
- **Target history and observable effects:** when target file history shows a
  name or shape was introduced recently, require a burden that name or shape
  causes rather than preference (keeping specialists unaware of that history).
  Accept clarity changes that alter what callers, operators, or logs observe
  (error text, a public variant, a runtime check a type makes redundant, or the
  chosen behavior when merging diverged copies) when that clarity is the
  benefit, stating the effect and any specialist precondition in the
  recommendation, or keep the remedy `unresolved`.

| Disposition | Record |
| --- | --- |
| accepted | Supported observation and remedy, net benefit or explicit convention, preservation constraints, R-ID. |
| rejected | Concrete counterevidence, outside scope, or insufficient benefit. |
| merged | Destination R-ID and retained candidate ID, locations and independent rationale. |
| unresolved | Supported observation or exact unverified claim, the missing fact, no implementation instruction. |

## Aim for the best version

Each specialist answered one question; you see the code with all of them, so you
decide what it becomes. Aim for the version a strong engineer in this language
would write today, with behavior and the project's conventions held fixed: clean,
simple, a pleasure to read, its structure mirroring the problem it solves. Do
not reject a coherent structural fix merely because it touches several call
sites, while avoiding cosmetic churn whose gain does not repay another
verification cycle. Keep core recommendations grounded in concrete reading or
maintenance burdens; place minor local renames or purely stylistic improvements
under `optional polish` so callers know they need not trigger an extra fix round
for taste alone.

Candidates are material, not the agenda. Rewrite a workable remedy when you see a
better one. Where several touch the same code or vertical call spine, design it
once. When they share a cause, fix the cause. For each affected business flow,
test whether the resulting code reads end to end in one pass (types carry valid
states, transitions have one owner, pure rules stand apart from I/O where
earned) and whether one realistic next change from existing variation becomes a
localized, compiler-checked edit. Watch especially for clean over-decomposition
that passed specialist smell checks piecemeal: tidy pass-through helpers,
hypothetical single-adapter seams, intermediate DTOs, over-newtyping, and
defensive ceremony that vanish when the operation is written directly, as well
as cross-seam scattering across partition boundaries (symmetric
`encode`/`decode`, cache-key, reset or batch twins and **D**-to-**H** format
shims that no single shard saw together). Then picture the code with every
accepted recommendation applied and ask whether you would be proud to have
written it. If not, finish the job: what is still missing becomes your own
candidate under the same bar. A remedy you rewrite or add passes the same
preservation, lint and existing-owner checks as any other. Finish every
verification and synthesis decision before formatting the report.

## Check the set

Check recommendations as a set. Extraction and inlining, abstraction and locality,
or renaming and API stability can conflict. Choose a coherent supported change;
present alternatives with tradeoffs only when the choice needs a fact the source
cannot supply. Merge by underlying change and affected scope, not merely the rule
or similar wording. Preserve all participating locations and useful rationale, so
a coding agent receives one consistent set of edits.

Compare the proposed resulting interfaces, owners and data flow at shared sites.
Two individually valid remedies can depend on incompatible intermediate choices:
one may borrow from an owner another removes. Compose a compatible result, state a
real prerequisite, or present alternatives; do not accept both unchanged because
each passed against the original source. Edits sharing a file are not inherently
in conflict. Independent improvements remain independent, and a renamed symbol
can simply be carried through a compatible extraction. Reassess only the advice
whose premise a selected recommendation changes.
