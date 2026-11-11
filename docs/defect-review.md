# Defect Review

Defect Review hunts bugs by reading. It is one of four reviews in this
repository; the [family design](review-family.md) explains how they relate
and why none of them runs the project.

## What it looks for

Behavior that is wrong for someone the code affects: a caller gets a wrong
result, a failure is reported as something it is not, a wait outlives its
limit, something started is never ended, one caller's trouble damages
another's work, a document says what the code does not do. Eight lenses
divide this by kind of failure. Six hunt bugs and prove them by a trace:
results, boundaries, errors, time, lifecycle, shared state. Two compare text
with code and mostly prove by quotation: stated facts and team rules.

Each lens goes to one independent reader, who reads the code itself. For a
small change related lenses are paired, so four readers cover the eight.
Whether a reader with two lenses reads less carefully has not been checked.
In a change review readers also read the removed lines and the callers of
what changed. Readers
overlap on purpose, and the orchestrator merges what two of them find.

## What makes a bug

Four things, each checkable without trusting anyone's reasoning:

1. **The effect, traced**: a trigger real use can produce, each step the code
   takes for it as a quoted line, and what the affected party observes at
   the end. A step that depends on a callee or a dependency quotes that code
   too.
2. **The expectation and its basis**: what should have happened and why. The
   basis is a written statement, what the code declares about itself (a name,
   a type, a protocol), or a named engineering principle such as "a failure
   is reported as its cause".
3. **The harm**: who is affected, and how. For a library, real use is
   anything its public interface admits, not only what today's callers do.
4. **A survived challenge**: an independent agent tried to show the claim is
   wrong and did not succeed.

Nothing has to be written down in advance for something to be a bug. Most
bugs break no sentence anyone wrote. A trace with a step nobody read is an
unproven candidate, listed apart and without advice.

## Why there is a challenge

The first design required a quoted written promise before anything could be
reported, and treated behavior the documents describe as intended. That kept
false positives out and kept bugs out with them: on its first run, three of
seven defects another reviewer had reported were classified as documented
behavior. A document that describes harmful behavior does not make it right.

Dropping that requirement removes the filter, so another one takes its place.
A second agent receives each claim with its trace and without the reader's
reasoning. It follows the trigger through the source itself and then attacks
the claim on four lines: the trace does not hold; the trigger does not happen
in real use; the expectation is wrong; the behavior is a deliberate, reasoned
choice. It returns `stands`, `falls` or `disputed`, with evidence. The
orchestrator treats that verdict as an argument, checks it, and walks the
trace itself.

## Documented behavior

When a document describes the behavior on purpose, the challenge tests the
document as hard as the claim: is a reason given, is it true of this code and
this dependency version, does it accept the cost that was shown?

- The reason is false, or the cost is never mentioned to whoever bears it: a
  bug, reported with what the document says.
- The reason holds and the cost was accepted knowingly: **disputed**. The
  report shows the traced effect and the decision side by side and does not
  say which the team should prefer.

## Reading only

The review does not clone, copy, check out, build or run the project, and no
role has a tool for writing files. It reads the working tree, or a PR's
commits through Git and GitHub. That is an instruction backed by the host's
permission mode, not a sandbox the skill enforces.

## Where the principles draw the line

The lenses name engineering principles, and several of them are judgment
calls. These are the lines they draw:

- **Degrading on purpose is allowed.** A cache failure served as a miss is
  not a bug when the failure stays visible to an operator and the substitute
  is safe for what the caller does with it. It is one when "could not check"
  is taken for "not there".
- **A failure is reported as precisely as someone acts on it.** Merging two
  causes under one name is fine until a caller branches on the name or an
  operator alerts on it.
- **A shared resource is retired only for a failure that breaks it for
  others**: a broken transport, a protocol out of step. A well-formed refusal
  of one request is not that.
- **A timeout leaves the outcome unknown.** A request already sent may still
  take effect. The bug is reporting that as a clean failure for something
  that is then repeated and must not happen twice, or local work that keeps
  running and publishes its result.
- **A wait needs a bound that reaches it.** A caller's timeout counts when
  the caller is polling the wait. It does not reach a spawned task or a
  blocking call.
- **Detached work is fine when nothing depends on it.**
- **Lenient input is fine when it is stated.** An invalid value must not
  take effect as if it were valid.
- **An unstated boundary** must still give an answer the operation's name
  and type allow, without a panic or a hang.

## Current limits

- Rust only. Claude Code and Codex only.
- Security and test quality are out of scope.
- A trace can be wrong where only a run would show it, most often about a
  dependency or the runtime. The contract requires those steps to quote the
  code at the locked version; they do not replace running the fix's test.
- An independent challenge costs one more agent per reader that reports
  traced candidates.
- The engineering principles are the reviewer's standard of what is wrong.
  The challenge constrains it; it does not replace the maintainer's judgment,
  which is why disputed findings exist.
- Completed coverage is not exhaustive discovery.

Version 0.4.0 has not been used on a real repository. The record under
`evals/defect-review/results/` is from the 0.1.0 design, which ran tests.
