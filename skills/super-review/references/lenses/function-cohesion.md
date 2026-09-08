# Function cohesion

## go.functions.extract-for-clarity

Extract when the helper names a coherent operation, removes repeated knowledge,
or separates genuinely different levels of detail. Judge the call and the
remaining function together; a reader should gain more than another jump.

Useful: a substantial repeated normalization operation has one clear contract.
Insufficient: extract three ordered field assignments into three one-line helpers
because the containing function exceeds a line limit.

## go.functions.coherent-purpose

Keep a function's steps connected to its task. A command handler may legitimately
read, validate, act, and render in sequence. Separation helps when an independently
meaningful responsibility obscures that sequence; a separate function is not
required for every verb.

Preserve necessary values, lifetime, and effect ordering when discussing a split.
Do not invent a new service or interface to make the resulting function shorter.
This lens owns extraction/cohesion, not all package architecture.
