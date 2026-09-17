# Spring quality decisions

Maintainer/evaluator resources only. This corpus deepens the existing Java
questions; it is not an installed Spring agent or a framework-correctness suite.
[Source rationale](sources.md) records the audited baseline, references and the
instruction gaps. Existing Java J02/J10/J11/J14 remain useful regression inputs;
the new cases exercise mechanism-specific contrasts rather than replacing them.

## Isolate one decision

Each `## Sxx` section in `packets/` is a separate synthetic snapshot with its own
request, baseline and source/consumer evidence. Its snapshot label is not a Git
SHA or evidence of a live source acquisition. Supply exactly that section, from
its heading to the next section/end, not the whole packet or its other examples.
Record the instruction revision and exact source bytes used for the run.

For a specialist case, provide the shared contract, Java context, Spring context,
one assigned Java lens, that owner's selected profiles and candidate format.
Supply explicit B policy and request scope without adding an expected finding.
For routing cases, provide the normal routing/aspect-selection resources and ask
for applicability decisions, not invented worker outputs. Selected profiles,
source exclusions and missing evidence remain different from completed coverage.

`cases.json`, this guide and `sources.md` are evaluator-only. Never send their
kind labels, expected outcomes, case comparisons or peer answers to a reviewer.
No fixtures, graders or model output are copied into installed skill resources.
Independent runs need fresh contexts; a sequential author pass is not independent
coverage. Do not execute the Java snippets or resolve fixture dependencies.

## Compare and grade

Follow [the bounded evaluation protocol](../README.md). Compare the original
instruction revision with the candidate under the same source, policy, host,
actual model/effort and tool availability. Preserve all outputs and failures.
Score observation support, useful simplification, unjustified churn, remedy
compatibility, missed improvements, policy compliance and actual coverage
separately. A merely named annotation or framework pitfall is not a quality win.
Accept a coherent alternative remedy or no finding where supported; retain
uncertainty about a remedy separately from a proven reading burden.

The contrasts include fixed wiring/runtime policy, related settings/single values,
constructor binding/dependency injection, configuration interception/conditions,
transparent wrappers/real application ports, operation cohesion/transaction units,
HTTP mapping/functional handlers, shared/error-specific contracts, MVC/WebFlux
validation, container/provider/caller ownership, reactive scope, projections/entities,
provider-specific embeddables, serialization and scoped policy/version gaps.

Re-run only affected decisions plus their counterexamples and selected unchanged
Java cases. Use separate unseen production-like inputs before claiming general
quality gains; these authored cases are not holdouts. Do not create another broad
Spring review or require a finding count.

## Evidence status

Baseline/candidate behavioral comparison: **NOT RUN**. No independent model runs,
latency/token measurements, or quality gains are claimed. The source-backed
instruction extension and proposed contrasts are inspectable without simulating
agent results. Native delegation was unavailable for the authoring pass.

`bun test tests/spring.test.ts tests/java.test.ts` checks fixture structure,
profile ownership, routing links and delivery identities, not model behavior.
`bun run build`, `bun run validate`, typecheck and the existing CI gate cover
packaging/maintenance. Report actual command and CI results in the PR; absence of
local Bun is not a passing run. Application code is never started by this corpus.
