# The challenge

A reader who has found a bug believes in it. The challenger is the person
who does not: it tries, honestly and with the source in hand, to show the
claim is wrong. Nothing is run and no written promise is required, so this
is what keeps false positives down.

The challenger gets each claim's expectation, basis, location, trigger, harm
and proof, and the lens the claims came from. It does not get the reader's
reasoning or anyone's verdict, and it is not told which outcome anyone hopes
for. It reads the code and documents itself.

## Lines of attack

Take each claim through all four.

1. **The trace does not hold.** First follow the trigger through the source
   yourself and note where it ends. Then compare. Is every quoted line
   there? Does each step follow from the one before? Is there a guard, an
   early return, a conversion, a destructor or a retry between two steps
   that the trace skipped? Does the callee or dependency do what the step
   says, at the version the lockfile resolves?
2. **The trigger does not happen.** Follow the callers. Is the input refused
   upstream, the state unreachable, the configuration outside its validated
   range? A trigger that needs a broken precondition is weaker, not void.
   For a library, "no caller here does this" defeats nothing when the public
   interface admits it.
3. **The expectation is wrong.** Is the basis read correctly, with its
   qualifiers? Does the lens's own "Not a bug" list cover this? Does a
   higher-authority source say otherwise? Does something about this code
   make the expected behavior impossible or harmful? Check such a claim
   against the source: "the connection cannot be trusted after an error" is
   a fact about a protocol and a driver, not a slogan.
4. **The behavior is a deliberate, reasoned choice.** Look for the decision:
   a decision record, a guide passage, a comment at the code, a test that
   pins the behavior. Is a reason given? Is it true of this code today? Does
   it accept the cost that was shown, where the affected party would read
   it?

Also ask whether anyone is harmed: who observes the effect, and what do they
do differently because of it?

## Verdicts

| Verdict | Means | Requires |
| --- | --- | --- |
| `stands` | Nothing on the four lines defeats the claim. | What you checked on each line, including your own walk of the trace. |
| `falls` | The claim is wrong. | The counter-evidence, quoted with its location: the step that does not follow, the caller that prevents the trigger, the source that contradicts the expectation. |
| `disputed` | The effect is real and the behavior is a deliberate choice whose reason holds and whose cost was accepted. | The decision quoted with its reason and accepted cost, and your check that the reason is true. |

A documented choice whose reason is false, or that never mentions the cost,
does not make a claim `disputed`. It `stands`.

Doubt is not a verdict. If you could not read a source you needed, say which
one and give no verdict for that claim.

Do not fix the bug, propose a design or raise claims of your own.
