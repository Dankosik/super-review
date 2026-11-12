# Results

Compact Markdown. Evidence, not a transcript of reasoning. Quote only code
you read. No timings you did not measure, no edits, and no remarks on
readability or bugs.

## Reader result

- Lens and scope.
- Read: files and symbols read in full, callers and dependency source
  consulted, evidence of load used. What in scope you could not read.
- Outside the scope: one line for each cost whose cheaper form changes only
  code the user's narrowing left out, with its location and the work.

With no candidates, say so.

### <number>. <the work removed, where, per what unit>

- Location: path, symbol and lines. For a change review, how the change
  introduces or exposes it, or `pre-existing`.
- Hot path: the entry, the unit and the multiplier, with its basis:
  `source` (the quoted caller, loop or registration), `document` (quoted
  with path and lines), `measurement` (the profile or benchmark output the
  user supplied, the part quoted) or `user` (their words).
- Cost: `traced` (numbered steps from one unit to the work, each with path,
  lines, quoted code and the work it does; the scale as operations times
  the multiplier; where you looked for something that already avoids the
  work) or `none` with the missing step.
- Cheaper form: a minimal sketch, and what it keeps: results, order, errors,
  what has happened on a failure halfway, drop timing, `Send` and `Sync`,
  public API; and that it builds within the project's `rust-version`,
  features and targets. Anything it changes, named.
- Resource: what is saved, as counts per unit before and after, or, for an
  operation the form makes cheaper, the count with what one operation does
  on each side and the basis for its cost; the largest cost on the same
  path for that resource; and any work that only moved.

## Challenger result

### <number>. `stands` | `falls` | `tradeoff` | no verdict

- Hot path: which callers reach it and how often, or what keeps it cold.
- Cost: where your own walk from one unit ended, your counts before and
  after, whether the basis for a cheaper operation's cost holds, and the
  line that breaks the reader's trace if one does.
- Behavior: what the cheaper form keeps and what it changes.
- Dominant cost: the largest cost on the path for the same resource.
- Decides it: the one piece of evidence behind the verdict.
