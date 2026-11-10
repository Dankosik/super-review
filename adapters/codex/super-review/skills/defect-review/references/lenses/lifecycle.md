# Lifecycle

**Is everything that is started also observed and ended?**

## Expect

- Whatever something else depends on has an owner that learns how it ended,
  including by error or panic. Work nothing depends on may be detached.
- Whatever is started is ended when its owner goes away or the service
  stops.
- Whatever is acquired is released on every path out: early return, error, a
  caller that goes away in the middle of a wait.
- Whatever accumulates has a bound, or something that removes from it.
- Health and readiness say what is true now.
- What is meant to be single is single.

## Look for

List what the code starts: tasks, threads, timers, connections,
subscriptions, temporary files, permits, locks held across a wait. For each,
find who learns how it ended, what ends it, and whether it is released on
every path.

- A handle dropped or stored and never awaited, so an error or panic ends
  the work silently while the rest reports healthy.
- A task that outlives its owner, or is aborted in the middle of work that
  had to finish.
- A background loop that exits on the first error and is never restarted.
- Cleanup written after the work instead of in a guard, so an early return,
  a `?` or a dropped future skips it.
- Shutdown that signals and does not wait, or waits without a limit.
- Readiness reported before the thing is usable, or never withdrawn.
- A queue, map, cache or list of handles that only grows: an entry added
  per request, per key or per reconnect and never removed.
- A second supervisor after a reconnect; a retry that starts a new attempt
  while the old one runs.

## Not a bug

A detached task whose outcome nothing depends on. An end observed through a
guard or a state change instead of a join. What the ending is reported as
belongs to [errors](errors.md).
