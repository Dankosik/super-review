# Behavior

**Does a test fail when a promised result, boundary or effect breaks?**

Work from the promises to the tests.

## Promises

For each operation carrying a [promise](../contract.md#promises) in documents,
doc comments, or its public name, signature, variants and units: the outcomes
its description or types name and the condition for each; its boundaries
(empty, absent, zero, one, the stated maximum, the inclusive or exclusive end
of a range); defaults and units; what it leaves behind (the stored value, the
emitted event, the metric with its labels).

## Look for

For each promise, find the tests that reach the code that keeps it and read
what they assert. Either an assertion would fail if it broke, or the code
runs under test and nothing asserts this behavior, or no test reaches it.
The second and third are where gaps are.

Mutants that show most:

- The boundary taken as its neighbor: `<` for `<=`, the range end moved by
  one, an empty input treated as absent.
- A documented default, limit or unit changed to another plausible value.
- One promised outcome returned where another belongs: a hit for a stored
  empty value turned into a miss.
- A validation or normalization moved after the effect it guards, or dropped
  on a symmetric sibling entry point (`decode` beside `encode`, `reload` beside
  `load`, `try_from` beside `from_str`, batch beside single).
- A persisted, cached, queued or rolling-deploy format reader rejecting or
  misreading prior-revision (`D`) payloads because every test only round-trips
  freshly written `H -> H` data instead of feeding a literal `D` payload.
- The return value kept and the side effect dropped, doubled or relabelled.

Put the mutant where the code makes the decision the promise is about, not
in a helper whose change breaks everything at once.

## Not a finding

A behavior nobody promised, however untested. Code with no tests at all,
which the report states without a mutant. Failure, time and cleanup paths
belong to [failure-paths](failure-paths.md).
