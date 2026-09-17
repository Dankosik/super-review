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

## rust.functions.coherent-purpose

**One operation.** Does the function tell one coherent story, or interleave
responsibilities that change for different existing reasons? A computation and
its environment may deserve a boundary when their intermediate value is meaningful
and the call remains comprehensible. Keep clear orchestration, including its
error handling. Do not manufacture a service object, builder or trait solely
to hold what can remain an ordinary function.
