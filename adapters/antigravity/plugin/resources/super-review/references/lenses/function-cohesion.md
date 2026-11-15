# Function cohesion

## go.functions.extract-for-clarity

**Load-bearing helpers.** Read the function, its immediate helpers, and their
calls as one operation. Extract a helper when it names an independent decision,
centralizes repeated knowledge, or hides low-level mechanics the caller can use
without opening its body. Inline existing single-caller helpers that chop one
linear story into step-by-step fragments, forward parameters unchanged, or pass
local state across declarations as bookkeeping arguments and return tuples.
Judge the resulting call and remaining body together; neither line count nor a
fresh verb earns a boundary.

## go.functions.coherent-purpose

**One story.** Separate responsibilities when a function mixes orchestration
with low-level parsing, index/byte mechanics, or a mode parameter that selects
between bodies sharing little. Regroup fragmented helpers back into their caller
when reading the sequence (`read -> validate -> act -> render`) in one place is
clearer than jumping across declarations.

**Keep when:** a linear handler or flat `switch` already tells one coherent
story at one level of detail; a one-line helper names a real domain rule or owns
a boundary; a closure deliberately holds local state that explicit parameters
would turn into bookkeeping; or moving statements across a call would shift a
`defer` boundary, lock scope, error order, or named-result update. Regroup a
function's own steps here; new services, interfaces, or package layers belong to
abstractions.
