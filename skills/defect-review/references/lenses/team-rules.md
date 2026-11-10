# Team rules

**Does the code follow the checkable rules the team wrote for it?**

Coding agents are given these rules and still skip some.

## Expect

Every rule in the located team documents that applies to this language and
area and states something checkable about production code. Read each rule
document in full once; a rule's scope and exceptions sit in the sentences
around it. Leave out rules about readability, process and test code.

## Look for

For each rule, find every place in scope where what it governs occurs.
Search by what the rule governs, not by a keyword from its text: a rule
about spawned work applies to every way the code starts work. Check the
rule's own exceptions before recording a candidate.

- The code takes the path the rule reserves for a justified exception,
  without the justification.
- The rule is followed on the main path and not on the error, shutdown or
  reconnect path.
- The rule was followed in the code the change copied from and not in the
  copy.
- The rule requires a pair (acquire and release, record and return) and one
  half is present.

A rule about what must or must not appear is proven by quoting the rule and
the code. A rule about behavior is proven by a trace.

## Not a bug

A rule for another language or area. A departure the rule's own exception
clause allows. A rule inferred from how the rest of the code looks. A
violation the project's committed linter already reports.
