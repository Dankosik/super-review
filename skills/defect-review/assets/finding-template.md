# Results

Compact Markdown. Evidence, not a transcript of reasoning. Quote only code
you read. No fixes and no remarks on readability.

## Reader result

- Lens and scope.
- Read: files and symbols read in full, callers and dependency source
  consulted, documents used. What in scope you could not read.

With no candidates, say so.

### <number>. <what goes wrong, for whom, in one line>

- Expected: what should have happened.
- Basis: `written` (verbatim quotation with path and lines), `declared` (the
  declaration and what it says) or `principle` (who relies on it here).
- Location: path, symbol and lines. For a change review, how the change
  introduces or exposes it, or `pre-existing`.
- Trigger: the input, state or order of events, and why real use produces
  it.
- Harm: who observes what, and what it costs them.
- Proof: `traced` (numbered steps from trigger to effect, each with path,
  lines and quoted code; where you looked for something that would stop
  it), `quoted` (both quotations and why they cannot both hold), or `none`
  with the missing step.
- Documented: any document, comment or test that describes this behavior on
  purpose, quoted with its reason, or `none found`.

## Challenger result

### <number>. `stands` | `falls` | `disputed` | no verdict

- Trace: where your own walk from the trigger ended, and the line that
  breaks the reader's trace if one does.
- Trigger: which callers or peers can or cannot produce it.
- Expectation: whether the basis holds as read.
- Deliberate choice: the decision quoted with its reason and accepted cost,
  and whether the reason is true; or `none found`.
- Decides it: the one piece of evidence behind the verdict.
