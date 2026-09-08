# Candidate format

Return compact Markdown. For no candidates, state `completed`, the task and
scope inspected, and any limitations. Otherwise use one block per candidate:

## C-<task>-<number>: <concrete improvement>

- Lens and task:
- Snapshot: PR, H, comparison D.
- Location: path, symbol, exact lines at H if known.
- Rules: effective default/team IDs.
- Observation and cost: what is present and why reading or changing it suffers.
- Transformation and benefit: the smallest useful change and its intended effect.
- Counterargument: why the current code might deserve to stay.
- Preserve: relevant contracts, ownership, lifetime, and effect order.
- Affected files: verified paths; distinguish a local change from a cross-file one.
- Missing context: required source not yet read, or `none`.

Do not invent line numbers. A verified path and symbol are better than a guessed
range. Suggestions are not patches or proof that behavior is preserved.
