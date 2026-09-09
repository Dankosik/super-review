# Evaluating the instruction proposal

Status: proposed cases, not executed. These files do not establish an improvement
in model behavior. Keep the existing cases, recorded outputs, and native adapter
checks; this is an addition to the current evaluation, not a replacement harness.

Compare the released baseline instructions with the candidate instructions on
the same inputs and installed harness, holding the model, effort, available
source, and tool permissions fixed. Record instruction hashes as well as the
skill metadata version: this unmerged source proposal is not a new release.
Use fresh contexts and vary run order. Repeat where affordable to expose
run-to-run variation; do not present a single favorable response as a general gain.

Supply only the selected Q-section from `packets/instruction-quality.md`, its
neutral snapshot setup, and the runtime resources for that role. Keep
`instruction-quality-cases.json`, contrast-pair membership, prior answers, and
expected outcomes with the evaluator, not with the reviewer. Q01-Q08 are paired
specialist judgments; Q09-Q11 are stage checks. None is a live GitHub end-to-end
run. Resource loading in Q10 still needs an actual native trace before claiming
that every adapter delivers the context in production.

Grade the concrete source evidence, the legitimate improvement retained, the
unnecessary change avoided, net cognitive/maintenance benefit, and preservation
constraints. Allow a supported alternative remedy; do not demand a particular
phrase, decomposition, or number of findings. Flag out-of-scope advice separately.
A reviewer returning nothing on every input should not pass the positive cases.

Retain full inputs and outputs, instruction/model identities, accepted and
rejected rationale, missing context, and run status. Report observations, not
an invented composite quality score. Token use and latency can be recorded
separately; they are not evidence of better recommendations.

Before accepting a policy change, review at least one realistic authorized PR
with a useful refactoring opportunity and one clear-code case. Compare the final
coding-agent handoff, not just specialist text. Do not edit the reviewed PR,
inspect tests, or execute project checks as part of Super Review itself.
