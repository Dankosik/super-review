# Failure paths

**Does a test fail when an error, timeout, cancellation or cleanup path goes
wrong?**

These are the paths most often left untested: the happy path has a test and
the branch that runs once a month does not. Work from the promises to the
tests.

## Promises

Error type documentation and variant names; documented status, label and log
mappings; stated budgets, deadlines, retry counts and what each covers; what
cancellation and shutdown do; guarantees on release; what one caller's
failure does to others; what is recorded when an operation fails, times out
or is dropped.

## Look for

List each way the operation can fail or be cut short: every fallible call,
early return, deadline, dropped caller, closing peer, shutdown. For each,
find the test that drives that path and read what it asserts about the
returned error, the recorded outcome and the released resource. A test that
checks only "it returns an error" pins none of the rest.

Mutants that show most:

- One cause reported under a neighboring failure's variant, status or label.
- A distinguishable cause folded into the general arm.
- A failure turned into success, absence or a default.
- The recording skipped on one early return, or done twice.
- A fresh duration passed where the remaining budget was computed; a limit
  removed from one wait.
- A deadline reported as cancellation or the reverse.
- The permit, gauge or registration not released on error or on drop.
- A retry made on a failure the promise calls permanent.
- A background task's failure no longer reaching its owner.

The witness causes the failure at the real boundary (a refusing fake peer, a
missing file, a dropped future, a controlled clock) and follows the
project's conventions for time, so it does not itself depend on timing.

## Not a finding

A failure path whose behavior nobody promised. A mutant that changes only an
error message the promise does not specify. Whether the failure handling is
the right design.
