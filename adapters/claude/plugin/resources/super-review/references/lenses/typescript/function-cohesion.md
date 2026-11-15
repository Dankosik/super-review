# Function cohesion

## ts.functions.extract-for-clarity

**Load-bearing helpers.** Read the function, its local or module helpers, and
its calls as one operation. Extract a helper when it names an independent
calculation or adapter whose contract callers can use without opening its body.
Inline single-caller helpers, tiny subcomponents, or wrapper hooks created only
to satisfy a line budget when they scatter one linear sequence across
declarations and pass local state around as parameter bags.

## ts.functions.coherent-purpose

**One story.** Separate responsibilities when a function or component tangles
independent calculations, adapter formatting, state transitions, and external
effects, or switches between unrelated bodies on a mode flag. Extract a branch,
object builder, custom hook, or JSX subcomponent when its inputs and result form
a self-contained concept rather than a slice of its caller's variables.

**Keep when:** a linear sequence or component render already reads as one story
in one place; or extracting/inlining would alter closure captures, `this`
binding, callback or element identity, async ordering, or the UI framework's
hook invocation and lifecycle rules (this lens judges cohesion, not hook bugs or
re-render tuning).
