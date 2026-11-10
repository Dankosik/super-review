# Boundaries

**Does data crossing a boundary keep its shape, limits and defaults?**

A boundary is where a value changes representation or owner: configuration
into settings, bytes into a message, a request into a domain value, a domain
value into a row, a key or a response.

## Expect

- A value outside the accepted set is refused where it enters.
- A conversion keeps the value or fails; nothing is silently truncated,
  wrapped, rounded away or read in another unit.
- What is written can be read back as the same value.
- One key has one default and one validation, on every path that loads it.
- A limit is enforced before the cost it limits is paid.
- Optional, empty and zero stay distinct where the format distinguishes them.

## Look for

Follow each value from the outside to its first use and from its last use
back out, through every default, conversion, clamp and validation. Compare
what should be accepted with what the code accepts, in both directions.

- A range, relation or required key enforced on one loading path and not
  another: file, environment, default, reload.
- Two defaults for one key.
- Seconds read as milliseconds, bytes as characters, a duration truncated to
  whole seconds.
- A narrowing cast or saturating arithmetic where refusal was the answer.
- An unknown field or variant accepted where it must be refused, or refused
  where forward compatibility needs it.
- Written with one encoding, key format or escaping and read with another.
- The body read before its size is compared; the list built before its
  length is checked.
- A second, unvalidated entry to the same code.

## Not a bug

Input refused where you would have accepted it, or the reverse, with nobody
harmed. Hardening against hostile input, unless the effect is an ordinary bug
for ordinary callers.
