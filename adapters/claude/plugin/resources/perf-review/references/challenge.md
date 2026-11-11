# The challenge

A reader who has found a saving believes in it. The challenger is the person
who does not: it tries, honestly and with the source in hand, to show the
work is not there or not worth removing. Nothing is run or measured, so this
is what keeps advice about cold code, imagined costs and changed behavior
out of the report.

The challenger gets each claim's location, hot path, cost trace, cheaper
form and resource, and the lens the claims came from. It does not get the
reader's reasoning or anyone's verdict, and it is not told which outcome
anyone hopes for. It reads the code and documents itself.

## Lines of attack

Take each claim through all four.

1. **The path is not hot.** Follow the callers yourself. Is the code
   reached once at startup, once per connection, behind a cache, only on an
   error path? Does the multiplier the claim names reach this code, or does
   something upstream keep it small: a protocol limit, a configuration
   bound, a fixed-size type? For a library, "no caller here loops over it"
   defeats nothing when the interface is for per-item use.
2. **The work is not done.** Walk the trace yourself from one unit and note
   what each line does. Is every quoted line there? Does the callee or
   dependency, at the version the lockfile resolves, already avoid the
   work: capacity reserved, a borrow returned, a buffer or cache inside,
   a reference count where the claim saw a copy? A claim that the compiler
   removes or keeps a cost needs a profile, a benchmark or a documented
   guarantee, from you as from the reader.
3. **The cheaper form changes behavior.** Run the sketch through the inputs
   the entry admits: empty, one, duplicates, a failure halfway, a dropped
   future, a panic while a lock is held. Does it keep results, their order,
   errors and when they surface, drop timing, `Send` and `Sync`, the public
   API, and what other callers observe of locking and timing? A change the
   team could accept makes the claim a tradeoff; one callers rely on makes
   it fall.
4. **A larger cost swallows the saving.** Find the largest cost on the same
   path for the same resource. Is the saving still visible to a caller or
   operator beside it? A network wait swallows a CPU saving's effect on
   latency, not its effect on CPU.

## Verdicts

| Verdict | Means | Requires |
| --- | --- | --- |
| `stands` | Nothing on the four lines defeats the claim. | What you checked on each line, including your own walk of the trace. |
| `falls` | The claim is wrong: the path is not hot, the work is not done, the cheaper form breaks what callers rely on, or the saving is swallowed. | The counter-evidence, quoted with its location. |
| `tradeoff` | The saving is real and the cheaper form changes something the team must weigh. | What changes, quoted, and who would notice it. |

Doubt is not a verdict. If you could not read a source you needed, say which
one and give no verdict for that claim.

Do not apply the change, propose another form or raise claims of your own.
