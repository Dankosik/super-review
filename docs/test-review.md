# Test Review

Test Review is the third skill in this repository. It asks one question:
would the tests fail if a plausible bug appeared in the code?

## Why a separate skill

Super Review judges readability and excludes tests. Defect Review hunts bugs
in production code and treats tests as evidence.
Neither says whether the tests would notice the next mistake, and coverage
numbers do not either: a line can run under test with nothing asserted about
what it does. Coding agents in particular tend to write the code, a test for
the main path, and leave the branch that runs once a month unpinned.

The question needs its own contract because its proof is a different kind of
argument. [The family design](review-family.md) explains how the three
reviews relate and why none of them runs the project. Test Review's mutants
must break a written promise, because the check that would catch a mistake
needs an oracle nobody disputes. Bugs against what nobody wrote down are
Defect Review's subject.

## What makes a finding

A finding is one of three kinds, each checkable without trusting the
reviewer's reasoning.

**Unpinned.** A promised behavior is not pinned by any test. The proof has
four parts:

1. the **promise**, quoted from a source the project owns;
2. a **mutant**: one small, plausible mistake in production code that would
   break that promise, written as a diff and never applied;
3. the **tests that reach it**: every test that drives the changed code, and
   why each would still pass, from what it asserts;
4. a **witness**: an input and an assertion that hold for the original code
   and fail for the mutant, followed through both.

The witness is what keeps false positives out. Without it a mutant may be an
equivalent rewrite that changes nothing observable, and reporting it would
send someone to write a test for a difference that does not exist. With it,
the finding comes with the test to add, marked as not run.

**Quoted.** A test breaks a checkable rule the team wrote for test code, shown
by quoting both. This is how a fixed sleep before an assertion is reported
when the team's testing rules require synchronizing on an observable state.

**Unstable.** A test's result does not depend only on the code: two orders of
events the test permits, one in which it passes and one in which it fails
with the code unchanged, each traced through its lines.

Anything less is listed as an unproven candidate without advice. The
orchestrator follows every mutant and witness through the source itself and
searches for a test the specialist missed. A mutant the tests catch is
counted, not reported.

## Not mutation testing as a tool runs it

A mutation tool applies every operator everywhere, runs the suite each time
and reports a score. This review applies nothing. A specialist reads the
promises and the tests, and for each promised behavior asks which mistake an
author could plausibly make there and which test would then fail. The result
is a short list of proven gaps, each with its test, not a percentage. A suite
that catches every mutant considered has not been shown complete, and the
report says what was not probed.

## Questions

Five questions, one per specialist. Behavior and failure paths work from the
promises to the tests. Oracles works from each test to what it would catch.
Determinism asks whether a test's result depends only on the code. Team rules
checks tests against the team's written rules for them.

## Reading only

The review does not clone, copy, check out, build or run the project, and no
role has a tool for writing files. A mutant is a described change. Whether a
test would fail is decided from what the test drives and what it asserts,
which is why the proof names every test that reaches the changed code.

## Current limits

- Rust only; Claude Code and Codex only.
- It probes written promises. Code with no documentation, meaningful types or
  team rules gives it little to aim at.
- It reports that tests would not notice a mistake, not that the code is
  wrong. Defects in production code belong to Defect Review.
- "This test would still pass" is a reading, not an observed run. A test
  the specialist and the orchestrator both overlooked would make a finding
  wrong; the proof lists where they searched.
- Completed coverage is not exhaustive discovery.

Mechanical tests in `tests/test-review.test.ts` check delivery copies, role
tools and instruction integrity. They do not measure whether a model finds
gaps.
