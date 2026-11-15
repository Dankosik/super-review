# Specialist result

Compact Markdown. Evidence, not a transcript of reasoning. Quote only code
you read. Never present a witness as run. No defects in production code and
no remarks on test style.

- Question and scope.
- Read: test files and production files read in full, promise sources used.
  What in scope you could not read.
- Mutants considered, and for each one a test catches: where, and which
  assertion would fail.
- Promises in scope you did not probe.

With no candidates, say so.

## <number>. <the promised behavior no test pins, in one line>

- Promise: verbatim quotation with path and lines. For a rule about test
  code, the rule with its scope.
- Gap: the tests that come closest and why they do not fail. For a change
  review, the link to the change, or `pre-existing`.
- Proof: one of
  - `unpinned`: the mutant as a diff; every test that reaches the changed
    code and why each still passes, quoting its assertion; where you
    searched; the witness with the lines that make it hold for the original
    and fail for the mutant.
  - `quoted`: the test code with path and lines, every location of the same
    violation, and why it breaks the rule.
  - `unstable`: the two orders of events as numbered steps with their lines,
    and what decides between them.
  - `none`: the missing piece.
- Lets through: which promised behavior could change without a test failing.
