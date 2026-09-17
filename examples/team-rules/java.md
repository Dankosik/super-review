# Example Java team rules

Copy or adapt selected rules into the reviewed repository's `SUPER_REVIEW.md`,
or explicitly link this Markdown file from it. A distributed example is not
adopted policy on its own. Rules are loaded from the target commit B.

## team.java.keep-transaction-sequence

Language: Java
Paths: src/main/java/com/example/checkout/
Lens: function-cohesion
Action: refine java.functions.extract-for-clarity

Keep the short transaction sequence visible in its public entry method. Extract
a calculation when its inputs/results form a meaningful concept; do not fragment
the sequence into forwarding helpers or move proxy/transaction boundaries.

## team.java.representation-scope

Language: Java
Paths: src/main/java/com/example/legacy/
Lens: representation
Action: disable java.representation.express-concepts

This compatibility layer is reviewed for naming, flow and other effective lenses,
but its externally bound representations are excluded from representation advice.
Disabling a Java rule does not disable a Go rule with a similar purpose.
