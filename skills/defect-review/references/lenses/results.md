# Results

**Does each operation return and do what it stands for, at the edges too?**

## Expect

- An operation returns and does what its name, signature and description
  say, for every input its type admits.
- Boundaries behave as stated: empty, absent, zero, one, the maximum, a
  repeated call. Where nothing is stated, the operation still gives an
  answer its name and type allow, and does not panic or hang.
- Absence, emptiness and failure are different answers.
- A result that reports success means the effect happened, once.
- An invariant a constructor establishes holds after every later operation.

## Look for

List the outcomes each operation's name, signature and description imply,
and match every path in the implementation to one of them. Follow each
boundary through the code. Check what the operation leaves behind as well as
what it returns.

- A boundary handled as its neighbor: an inclusive limit compared
  exclusively, an empty input treated as absent, "at most N" allowing N+1.
- An outcome no path produces, or a path whose outcome the description
  excludes.
- A miss reported as an empty value or the reverse; a default returned where
  "none" was the answer.
- An invariant broken by a later mutator or a second constructor.
- Success reported while the write, event or metric did not happen, or
  happened twice.
- A second call that differs from the first where callers rely on
  idempotence.
- A value stored normalized and compared raw.

## Not a bug

Behavior stricter or more lenient than you would choose, with nobody harmed.
An edge the type makes unrepresentable or no caller can reach. How a failure
is classified belongs to [errors](errors.md).
