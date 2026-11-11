# Test Review

Write in the user's language. Omit a section that would be empty and say so
in the outcome.

## Outcome

The proven findings, the gap that lets most through first, and the counts:
mutants considered, killed and surviving; findings by kind; unproven;
rejected. With nothing proven, say that every mutant considered is killed
and name what was not probed.

What was reviewed: the PR or local root and revision, the questions used and
left out, the promise sources read, packages with no tests, tests the
project's own command does not run. Nothing was built or run and no mutant
was applied; each witness is a test that has not been run.

## Findings

### T-001 — <the promised behavior no test pins>

**Promise.** Verbatim quotation with path and lines.

**Gap.** The nearest existing tests and why they do not fail.

**Proof.** The mutant diff, the tests that reach the changed code and why
each still passes, and the witness. Or the rule and the test code, with
every location. Or the two orders of events.

**Lets through.** Which promised behavior could change unnoticed.

**Test to add.** The witness, as written and not run, with where it goes,
or the finding whose witness also covers this one. For a quoted rule, what
the rule asks for, in the rule's own words.

## Unproven and rejected

One line each: the claim, and the missing piece or the counter-evidence.
These are not findings and carry no advice.

## For whoever adds these tests

Close with these instructions for the person or agent that adds the tests:
run each witness on the original code and see it pass; apply its mutant
locally, see the witness fail, and revert the mutant; when a witness does not
behave that way, report it against the finding instead of adjusting the test
until it passes.
