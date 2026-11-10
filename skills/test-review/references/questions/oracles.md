# Oracles

**Does each test fail when the behavior it names breaks?**

Work from the tests to the code. A test's name says what it claims to
protect. Its assertions decide whether it does.

## Promises

For each test: what its name or comment says it checks, and the written
promise behind that behavior. A test whose named behavior has no written
promise is noted and not probed.

## Look for

Read each test as a question: which change to the production code would make
this fail? Follow every assertion to the value it compares and where that
value comes from.

- The test asserts only that the code returned, did not panic, or returned
  `Ok` or `Err` without looking at the value.
- The expected value is computed by the same code or by a copy of the
  production logic.
- The assertion is on the fake: what the test double was told, not what the
  code under test did with it.
- The expectation is broader than the promise: `contains` where the promise
  fixes the whole, any error where it names the variant.
- The setup already guarantees the outcome.
- The assertion sits in a branch, callback or spawned task the test does not
  prove was reached.
- A table of cases where every case takes the same path.
- A test marked ignored or gated behind a feature, so it protects on paper
  only. Quote what excludes it; no mutant is needed.

The mutant breaks exactly the behavior the test names. The witness is
usually the same test with the missing assertion.

## Not a finding

A test that is narrow on purpose and names only what it asserts. Redundant
tests. Style, length or structure of test code.
