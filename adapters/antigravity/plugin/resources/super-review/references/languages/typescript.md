# TypeScript context

**Compatibility.** Establish the owning package and applicable compiler configuration
at H before version-sensitive advice. Read its `package.json`, the relevant
`tsconfig` and available inherited/project-reference settings; consult a committed
text lockfile only when the resolved compiler or library version matters. The
nearest file is a starting point, not proof that it governs this source. A newer
workspace toolchain or locked compiler does not raise a library's supported
consumer baseline. Missing configuration limits the remedy; do not run a compiler,
package script, installer, config loader, or external lookup to fill that gap.

Distinguish language support, emitted JavaScript, type libraries, and the actual
runtime. Account for module resolution,
package exports/type, JSX mode, decorators, and relevant strictness flags only as
they affect a proposed change. Do not prescribe new compiler flags, a dependency,
or an upgrade as a readability improvement. Read the actual inherited configuration as text. An inaccessible custom config
or dependency declaration is an explicit context gap, not permission to guess
its contents.

For a public change, distinguish the authoring compiler from the files consumers
actually receive: source TypeScript, JavaScript, and selected declarations. New
syntax erased during the build need not raise the consumer baseline; syntax or
library types retained in shipped source/declarations may. Inspect available
entry-point and build evidence, not just the workspace compiler version. TypeScript
or `@types/node` alone establishes neither Node.js, Bun, Deno nor a backend framework;
resolve the actual execution path per area without adding runtime support or migration.

**Craft.** Read the source against how an experienced TypeScript author would
write the same operation today, under the package's compiler settings and actual
runtime, by the defaults of the TypeScript Handbook, typescript-eslint's
recommended reasoning and the Google TypeScript Style Guide. Their core: types
that state what the code knows, with discriminated unions and narrowing in place
of assertions; an untrusted value treated as `unknown` and parsed once ("parse,
don't validate"); inference where an annotation would only repeat the
expression, and a return annotation where the inferred type is wide or assembled
from several branches; `satisfies` where an annotation would widen and `as`
would skip the check; `any`, `as` and `!` only where the code can say why;
`const` by default; no class used as a namespace or as a structural type; and
the platform's standard APIs and utility types, within the runtime, before the
project's own. Where the code relies on handling every member of a union and the
project already checks exhaustiveness, the `switch` keeps that check; this is
about what the next change sees, not a hunt for missing cases. Whether a
promise's failure is handled is visible at the call (typescript-eslint's
no-floating-promises reasoning; `void` marks intent but leaves a rejection
unhandled); this is about how the call reads, not a hunt for unhandled promises.
Where the source falls short of this and the gap costs a reader or the next
change something you can name, report it, however small.

**Idiom owners.** Idiom is evidence inside the assigned lens, not a separate
pass. Narrowing, exhaustive `switch`, optional chaining and early returns belong
to control-flow, and a check for a case the types or code already rule out to
its defensive-checks profile; `const` bindings, spreading, mutation and iteration
to data-flow; a platform or project operation replacing handwritten mechanics to
duplication; signatures, overloads, option objects and return types to
api-clarity; unions, literal and branded types and `unknown` boundaries to
representation; name forms to naming; helpers, classes, generics and type-level
utilities to function-cohesion and abstractions; the project's established way
of handling a concern to conventions; where a declaration lives to placement;
how many cases and passes a computation needs to logic. Report an idiom under
the lens that owns it and leave the others to their owners.

**Judgment.** An idiom earns a recommendation by what it removes: an assertion,
a cast, a branch, a second check, another place to edit. Optimize the
reader's understanding of values, contracts, and effects, not the number of type
annotations or resemblance to another language. Plain functions, structural types,
local mutation, classes with a real lifecycle, and ordinary loops can already be
clear. `interface` versus `type`, array spelling, semicolons, naming prefixes,
`enum` versus literal unions, and functions versus arrow functions are not blanket
review rules. Effective team conventions govern style; these sources are background,
not silently adopted policy. Committed lint configuration (ESLint, Biome) and
`tsconfig` strictness are the project's adopted choices: do not recommend what
they deny, and leave listing their violations to the project's own checks. Do
not reproduce formatter/linter chores.

Prefer supported project or standard-library operations when they name the actual
work more directly; identify the specific reading burden they remove. A clever
pipeline or type-level utility can be less clear than a local loop or named shape.
Do not invent APIs or claim performance improvements without evidence.

**Preservation.** A refactoring must retain the implicated runtime and type-level
contracts: inference/contextual typing, accepted calls and return relationships,
structural assignability, property presence versus `undefined`, nullish versus
falsy values, aliasing and mutation, and public declarations. Assertions and types
are not runtime validation. `readonly` and `as const` do not freeze objects or
provide deep independence. Explain the particular constraint the change touches,
not a generic bug checklist; do not claim tested equivalence.

Type-only edits can still affect consumers; syntax such as imports, enums, classes,
and decorators can affect emitted code. Inspect available consumers before changing
exports, overloads, augmentation, or signatures. Unavailable consumers may require
a compatible local clarification instead. For TSX, establish the actual framework
from imports/configuration: `.tsx` alone does not mean React. Use its existing
component/props conventions, not a framework migration, memoization campaign, or
new hooks audit. For established frontend source, also use the selected
[frontend context and owner profiles](../frontend.md); apply only the assigned
question and preserve local framework contracts.

Background: [everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html),
[functions](https://www.typescriptlang.org/docs/handbook/2/functions.html),
[narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html),
[objects](https://www.typescriptlang.org/docs/handbook/2/objects.html),
[module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html),
[declaration guidance](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html),
and [React TypeScript](https://react.dev/learn/typescript) only where React is established.
These are authoring references, not mandatory web reads during a review.
