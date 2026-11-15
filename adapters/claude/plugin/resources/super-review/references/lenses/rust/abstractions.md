# Rust abstractions

## rust.abstractions.earn-the-boundary

**Load-bearing boundaries.** Test each trait, generic parameter, wrapper,
builder, or macro against the direct concrete type or function. Ask which
responsibility or variation it hides from callers and what callers must learn in
exchange. Collapse shallow boundaries that forward calls through interface
twins, and deepen leaky ones that push internal mechanics into every caller.

Check whether each seam is real. A trait whose only other implementation is a
test double for internal choreography is a hypothetical seam: production code
pays for an interface the program does not vary. A layer whose methods forward
arguments and results unchanged is a Middle Man. A struct built only to invoke
one action hides a function, and a single-use struct written solely to run one
cleanup expression in `Drop` or abort a task handle hides a local guard that
`std::mem::DropGuard` (within MSRV) or an existing crate guard expresses at the
site. Names such as `Manager`, `Service`, or `Helper` invite this ownership
check, though the finding rests on the missing responsibility rather than the
word.

Flag Speculative Generality where a parameter, options struct, enum variant, or
type parameter receives the same fixed value at every inspected caller or exists
only for a hypothetical future variant: recommend the fixed form until a real
caller varies it. Look for standard traits before bespoke ones: a crate trait
forwarding to `Read`, `Write`, `Iterator`, `Display`, `FromStr`, or `Extend`
repeats a known contract; a stateless one-method trait is a function or closure
parameter; and crate-closed alternatives told apart by a kind tag or downcasting
read directly as an `enum`.

Tighten generic obligations that leak across callers:
- Move a trait bound on a `struct` or `enum` declaration (`T: Clone`, `T: Debug`)
  to the `impl` blocks that actually require it.
- Lift method bodies repeated across every implementor of a crate trait into a
  provided method.
- Replace a caller-chosen type parameter with an associated type when each
  implementation fixes the output.
- Replace a macro with an ordinary function when evaluation and ownership stay
  clear, and flag macros that hide `return` or `?` or invent a miniature surface
  language for public methods and bounds.
- Compare derives with manual impls by their contract: use a derive to drop
  field-by-field boilerplate, or a manual impl to avoid false generic bounds
  (such as `Clone` on a function pointer's output), redact sensitive fields, or
  format entries directly with `fmt::from_fn` and `debug_list`/`debug_map`
  instead of staging temporary collections.

**Keep when:** a single implementation crosses a real capability, plugin, or
dependency-direction boundary; `dyn Trait`, boxing, or erasure preserves
heterogeneous storage, dyn compatibility, async-trait bounds, or a returned
future's `Send` contract; a dedicated guard owns an invariant, exposes methods,
or crosses an API boundary; outside code extends an open trait set; a macro
legitimately captures syntax or evaluation order; or external consumers depend
on the public signature under shared compatibility judgment. Judge macros from
supplied expansion, accessible source, or documented contracts without executing
procedural macros.

Background: [associated types](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html),
[Clone derivation](https://doc.rust-lang.org/std/clone/trait.Clone.html),
and [dyn compatibility](https://doc.rust-lang.org/reference/items/traits.html#dyn-compatibility).
