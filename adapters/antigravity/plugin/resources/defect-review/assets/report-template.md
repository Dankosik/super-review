# Defect Review

Write in the user's language. Attach no severity labels and give no fix
advice. Omit a section that would be empty and say so in the outcome.

## Outcome

The bugs that stood, most harmful and most ordinary trigger first, those
this repository's own code reaches before those only its public interface
admits, and the counts: bugs, disputed, drift, rule violations, unproven,
rejected. With nothing found, say that no bug was shown in what was read.

What was reviewed: the PR or local root and revision, the lenses used and
left out, what could not be read, where siblings of each bug were looked
for, and files that changed during the review. Nothing was built or run;
findings rest on reading.

## Bugs

### F-001 — <what goes wrong, for whom>

**Expected.** What should have happened, and the basis.

**Does instead.** File, symbol and lines; the behavior and its trigger, as
inputs and order of events a test could set up. Reach: this repository's
own code, or only the public interface. For a change review, the link to the
change, or `pre-existing`.

**Harm.** Who observes what, and what it costs them.

**Proof.** The trace as you confirmed it: numbered steps from the trigger to
the effect, each with its file, lines and quoted code.

**Challenge.** What the challenger tried and why the claim stood.

**Documented.** What a document or comment says about this behavior and why
that did not settle it. Omit when nothing was found.

## Disputed

### D-001 — <the effect and the decision>

The effect as for a bug, then the decision: its text, its stated reason and
the cost it accepts, quoted. Report both sides and do not say which the team
should prefer.

## Drift

Statements in documents that the code contradicts, each with both
quotations.

## Rule violations

Team rules the code breaks, each with the rule and the code quoted.

## Unproven and rejected

One line each: the claim, and the missing step or the counter-evidence.
These are not bugs and carry no advice.
