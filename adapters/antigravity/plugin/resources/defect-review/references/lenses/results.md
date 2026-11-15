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

- A boundary handled as its neighbor (off-by-one, fence-post): an inclusive
  limit compared exclusively, an empty input treated as absent, "at most N"
  allowing N+1.
- An outcome no path produces, or a path whose outcome the description
  excludes.
- A miss reported as an empty value or the reverse; a default returned where
  "none" was the answer.
- A silent fallback (`unwrap_or_default`, `unwrap_or`, `let Some(..) = .. else
  { return Ok(()); }`, `|| fallback`, `Optional.orElse`, or a wildcard arm over
  an internal enum/union) turning a missing entry, unexpected state or newly
  added variant into apparent success or a zero/empty value while the intended
  effect never happened.
- Asymmetric propagation across sibling paths: a new field, tenant/scope filter,
  or variant handled in `create` or single-item lookup while omitted from
  cache/query keys, invalidation, `clone`/`merge`, equality/hash, form reset, or
  the batch/stream/reload path.
- A helper whose name promises more than its body establishes (`validate`,
  `normalize`, `ensure`, `reset`), leaving callers relying on an unchecked
  field, unnormalized input or unperformed step.
- An invariant broken by a later mutator or a second constructor.
- Success reported while the write, event, or metric did not happen, happened
  twice (such as an unguarded async action), or fired an unintended default
  action alongside the intended one.
- An interactive control or dynamic style rule that drops its effect on a
  reachable input path (nested click targets, active input-method composition,
  keyboard activation, or statically stripped class names).
- A second call that differs from the first where callers rely on
  idempotence.
- A value stored normalized and compared raw.

## Not a bug

Behavior stricter or more lenient than you would choose, with nobody harmed.
An edge the type makes unrepresentable or no caller can reach. How a failure
is classified belongs to [errors](errors.md).
