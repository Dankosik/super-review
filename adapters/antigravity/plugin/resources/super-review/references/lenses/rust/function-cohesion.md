# Rust function cohesion

## rust.functions.extract-for-clarity

**Conceptual extraction.** Would a helper express an independently understandable
operation, or merely move statements out of sight? Compare knowledge removed
from the caller with new arguments, lifetimes, trait bounds and navigation.
Keep a linear transformation together when extraction obscures its stages;
size alone is not a reason to split.

Describe a responsibility and real call, not just a cut point. Moving a guard,
transaction or owned value into a helper can change its drop boundary. Preserve
the relevant lifetime and effects; do not introduce clones, boxing or shared
ownership merely to solve difficulties manufactured by the extraction.

Apply the same test to helpers that already exist. One that only forwards its
arguments, or that reads and writes its caller's locals through a row of `&mut`
parameters, relocates statements without owning a decision; inlining it returns
the story to one place. A helper used once still earns its place when its name,
inputs, result and failure state a complete decision the caller can use without
opening it.

## rust.functions.coherent-purpose

**One operation.** Does the function tell one coherent story, or interleave
responsibilities that change for different existing reasons? A computation and
its environment may deserve a boundary when their intermediate value is meaningful
and the call remains comprehensible. Keep clear orchestration, including its
error handling. What can remain an ordinary function stays one; a new service
object, builder or trait is a question for abstractions.

Signs of two stories in one function: a boolean or mode parameter that selects
between bodies sharing little; steps at different levels, such as orchestration
interleaved with byte or index arithmetic; a Data Clump, a group of parameters
that travels together through several calls and would read as one named value;
a long closure defined mid-function whose captures hide its inputs. A method that
takes `self` without reading it reads better as an associated or free function,
unless a trait fixes its signature. A `new` that opens a connection or spawns
work puts those effects behind the plainest name; std names such constructors
for what they do, as in `File::open`, `TcpListener::bind` and `thread::spawn`.
A long flat `match` whose arms are parallel remains one story at any length;
nesting and mixed levels cost more than lines.
