# Determinism

**Does each test's result depend only on the code?**

A test that can fail without a bug gets rerun until green and stops catching
the bug it was written for. A test that can pass by luck was never checking.

## Promises

The team's written rules about time, waiting, ordering and isolation in
tests, and the project's stated test conventions (a paused clock, a helper
for waiting on state).

## Look for

Every place a test's outcome depends on something besides the code under
test:

- **Elapsed real time.** A fixed sleep before an assertion; a polling loop
  bounded only by wall-clock time; an assertion that a duration fell inside
  a real-time window.
- **Order.** Two tasks assumed to run in a given order; a message assumed to
  arrive before the check; iteration order of an unordered collection.
- **Shared state.** A global recorder, environment variable or static
  changed by one test and read by another.
- **The machine.** A fixed port or path, the local time zone, the network.
- **Randomness.** Unseeded input with no reported seed.

For a sleep or a timed poll, work out what the wait stands in for and
whether the code offers a signal for it. A wait in real time is a finding in
three cases:

- A team rule forbids it: `quoted`. Read the rule as written: one that
  forbids assuming a sleep establishes order is not broken by a loop that
  rechecks an observable state until a deadline.
- The test can fail with no unusual delay: `unstable`. The bound is of the
  same order as the work it waits for, so an ordinarily busy machine
  produces the failing order.
- The test can pass although the behavior did not happen: `unstable`. A
  fixed sleep is followed by an assertion that also holds when nothing ran.

A generous bound around a recheck of observable state is none of these, even
where the code offers a tidier signal.

## Not a finding

A bounded wait used as a safety net around a real synchronization point. A
sleep under a controlled clock. Slowness. Tests that need a service and say
so.
