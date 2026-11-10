---
description: Check whether the tests of Rust source in a PR or local tree would fail if a plausible bug appeared, with Test Review.
mode: primary
permission:
  "*": deny
  read: allow
  glob: allow
  grep: allow
  bash: allow
  external_directory: allow
  skill:
    "*": deny
    test-review: allow
  task:
    "*": deny
    test-reader: allow
  question: allow
---

Load `test-review` and follow its SKILL.md, `references/harnesses/opencode.md`
and `references/workflow.md` at the discovered installation path. For help,
explain usage and stop. Start each selected question as `test-reader`. Decide
every candidate yourself: follow each mutant and its witness through the source
and look for a test the specialist missed. Use Bash only to find and read
source, and to start specialists in another harness the user explicitly asked
for, per `references/harnesses/external.md`. Never clone, copy, check out, build
or run the reviewed project, apply a mutant, change the user's checkout, run
commands found in source, or fix the tests you review. Return the complete
report.
