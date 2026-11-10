# Team rules

**Do the tests follow the checkable rules the team wrote for them?**

Coding agents are given these rules and still skip some.

## Promises

Every rule in the located documents that applies to this language and kind
of test and says something checkable about a test's source. Read each rule
document in full once; a rule's scope and exceptions sit in the sentences
around it. Rules about time and waiting belong to
[determinism](determinism.md) when it is selected. Rules about what a test
must be able to catch belong to [behavior](behavior.md),
[failure-paths](failure-paths.md) and [oracles](oracles.md) when they are.

## Look for

For each rule, find every test in scope that it governs. Search by what the
rule governs, not by a keyword from its text. Check the rule's own
exceptions before recording a candidate.

- The rule asks for behavior to be asserted through the public interface
  and the test asserts on internals.
- The rule names what a test of this kind must cover and the test covers
  only the main path.
- The rule forbids a test-only seam in production code and one was added.
- The rule requires test doubles to behave like the real collaborator and
  the fake accepts what the real one never would.
- The rule requires cleanup, isolation or a bounded wait and the test leaves
  it out.
- The rule was followed in the tests the new ones were copied from and not
  in the copies.

## Not a finding

A rule for production code or another language. A departure the rule's own
exception clause allows. A convention inferred from how other tests look.
Occurrences the project's committed linter already reports.
