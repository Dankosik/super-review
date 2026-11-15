# Errors

**Is each failure reported as what it is?**

A failure is reported in several places at once: the returned error, the
status sent to a peer, the log event, the metric label, the health state.
Someone acts on each.

## Expect

- A failure is reported as its cause, as precisely as those who act on the
  report need: a caller that branches on it, an operator who alerts or
  diagnoses by it.
- Every channel tells the same story.
- A failure is not passed off as success, absence or a default. Where the
  code degrades on purpose, such as a cache failure served as a miss, the
  failure stays visible to an operator and the substitute is safe for what
  the caller does with it.
- A failure belongs to whoever caused it: a request's own failure is not
  charged to a shared resource, and a broken resource is not passed off as
  the request's failure.
- Recovery matches the failure: retry what can succeed, stop on what cannot.
- A failed operation leaves nothing half-done that a caller takes for done.

## Look for

List the distinct causes that can fail the operation: each fallible call,
early return, cancellation, deadline and dependency failure. Follow each to
every place it is reported, reading every conversion on the way (`From`
implementations, `map_err`, `?`, catch-all arms). A conversion is where a
cause is renamed.

- One cause under another's name: a file that cannot be read reported as
  rejected credentials, a caller leaving reported as a timeout.
- A catch-all that folds a distinguishable cause into a general one when a
  name for it exists.
- A swallowed error: mapped to `None`, an empty result or a default with
  nothing recording it, or where the caller then acts on the substitute as
  fact: "could not check" taken for "not there", a failed lookup taken for
  the permissive default (fail-open).
- The returned error says one thing and the metric label or log event
  another; one channel skipped on an early return.
- A failure counted twice, or not at all.
- A permanent failure retried, a transient one treated as final.
- A cause merged into a broader name on purpose while people are told to act
  on that name as a sign of one cause: an alert on timeouts that also fires
  when callers leave.

## Not a bug

An error message you would word differently. A general error where nothing
downstream could act on the difference. Deliberate degradation that stays
visible and whose substitute is safe. What else the failure damages
belongs to [shared-state](shared-state.md).
