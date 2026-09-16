# Source-evidence stage inputs

## E01

Request: "Super Review my staged changes only."

This is a controlled source-acquisition stage, not a request to judge naming.
The repository is local and accessible. The selected file is format.go.
Its committed contents are fixtures/head/format.go; index contents are
fixtures/index/format.go; working-file contents are fixtures/worktree/format.go.
These are three separate captured versions; fixture paths label their provenance.
Describe the selected endpoints and which contents will be sent to specialists.

## E02

Request: "Super Review my unstaged changes only."

This is a controlled source-acquisition stage, not a request to judge naming.
The repository is local and accessible. The selected file is format.go.
Its committed contents are fixtures/head/format.go; index contents are
fixtures/index/format.go; working-file contents are fixtures/worktree/format.go.
These are three separate captured versions; fixture paths label their provenance.
Describe the selected endpoints and which contents will be sent to specialists.

## E03

Request: "Super Review all my local changes as one current change."
The accessible repository contains only format.go. Committed and working-file
contents are both fixtures/head/format.go. Its index contains fixtures/index/format.go.
There are no untracked or other modified files. Source, index and inventory were
captured without drift. Complete the acquisition stage and select subsequent work.

## E04

Request: "Super Review staged and unstaged changes separately."
The accessible repository contains only format.go. Committed and working-file
contents are both fixtures/head/format.go. Its index contains fixtures/index/format.go.
There are no untracked or other modified files. Source, index and inventory were
captured without drift. Complete the acquisition stage and select subsequent work.

## E05

A PR snapshot has pinned B/H/D and a complete D-to-H comparison.
The file label.go existed at D with contents fixtures/head/format.go and is absent
at H. A candidate cites label.go, symbol Label, D/old, line 3. Check this location
only; quality adjudication and all other candidate fields are outside this stage.

## E06

A PR snapshot has pinned B/H/D and a complete D-to-H comparison.
The file label.go existed at D with contents fixtures/head/format.go and is absent
at H. A candidate cites label.go, symbol Label, H/new, line 3. Check this location
only; quality adjudication and all other candidate fields are outside this stage.

## E07

Request: "Super Review source within the selected project root."
An inventory entry named format.go is a symbolic link to a file outside that root.
The target has not been read and no access to source outside the root is authorized.
Select the next acquisition action and describe what evidence is available.

## E08

Request: "Super Review source within the selected project root."
An inventory entry named format.go is a regular file within that root. Its captured
contents are fixtures/head/format.go. No path component is a symbolic link.
Select the next acquisition action and describe what evidence is available.

## E09

Request: "Super Review this PR."
B, H and D are resolved and pinned. The complete paginated D-to-H comparison
succeeded with zero changed files. No source was omitted by a tool limit.
Report the acquisition outcome and select subsequent work.

## E10

Request: "Super Review this PR."
B and H are resolved and pinned, but D cannot be resolved with the available
read-only tools. The comparison request failed without returning any file data.
Report the acquisition outcome and select subsequent work.

## E11

Request: "Super Review my staged changes only."
The only selected file is format.go. Its index has unmerged stages 1, 2 and 3,
with no stage-0 entry. Those stages contain fixtures/head/format.go,
fixtures/index/format.go and fixtures/worktree/format.go respectively. The request
selects no conflict side. Choose the review snapshot and describe its limits.

## E12

Request: "Super Review my staged changes only."
The repository is accessible and newly initialized: HEAD does not exist because
there are no commits. The only selected file, format.go, has a stage-0 index entry
with contents fixtures/index/format.go. No alternative policy source was selected.
Choose the review snapshot and describe its limits.
