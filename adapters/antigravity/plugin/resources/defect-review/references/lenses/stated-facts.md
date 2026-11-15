# Stated facts

**Do the written numbers, names and descriptions match the code?**

This lens reads the documents against the code, statement by statement, and
mostly proves by quotation.

## Expect

Every checkable statement about the reviewed area is true of it: numbers
with units, defaults and ranges, names of configuration keys, metrics,
labels, log events and variants, counts, orderings, and descriptions of
which path does what.

## Look for

Work from each statement to the code that makes it true, then from the
code's constants, defaults and exported names back to the documents. Follow
a constant to where it takes effect and a default through its overrides
before quoting it. In a change review, start from what changed: a constant
whose document did not, a document whose code did not.

- A timeout, interval, limit, retry count or default that differs.
- A metric, label value, log event or configuration key spelled differently,
  so a dashboard, alert or setting silently matches nothing.
- A unit that differs or is missing on one side.
- Two documents that state different values for the same thing.
- A description of behavior the code no longer has.
- A described item that no longer exists.

## Not a bug

Prose style, missing documentation, a document that is silent. Wording the
document marks as approximate. Behavior over time or across paths, which
needs a trace and belongs to the lens that owns it.
