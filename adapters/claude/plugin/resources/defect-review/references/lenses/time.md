# Time

**Does every wait end when it should, and for the reported reason?**

## Expect

- Every wait can end: by a limit, a cancellation or the peer.
- A budget is spent once. Inner steps get what remains, and the total stays
  inside what the caller was given.
- The reason reported for ending is the real one: the limit, the caller
  leaving, the peer closing.
- Work whose caller was told it failed does not quietly take effect later.
- Retries, backoff and intervals are bounded and paced.

## Look for

For each wait, note who sets the limit, what it covers and which clock
measures it. Follow the limit inward: is the same deadline carried, or a new
duration started? Follow every way the wait can end to what is reported and
what is left running. Add up what a caller waits in total.

- A fresh duration passed down where a deadline was computed above.
- A stage outside the budget that should cover it: the limit starts after
  the lookup, the file read or the wait for a permit.
- Sequential steps or retries that each get the whole budget.
- A check that waits on something first and only then starts its own limit.
- The caller going away recorded as a timeout; the limit elapsing recorded
  as another error because the inner error arrives first.
- A wait with no limit: a lock, a channel send, a join, a connect.
- A shorter internal limit cutting work still inside the caller's longer
  one.
- Backoff that exceeds its cap, never resets after success, or resets on
  every failure.
- Wall-clock time where elapsed time was meant.

For "the caller went away", name the suspension point where the future is
dropped and what runs afterwards.

## Not a bug

A timeout value you would choose differently. A wait with no limit where
nothing depends on it ending. A number that differs between a document and a
constant belongs to [stated-facts](stated-facts.md).
