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
runtime. `target`/`lib` do not supply polyfills. Account for module resolution,
package exports/type, JSX mode, decorators, and relevant strictness flags only as
they affect a proposed change. Do not prescribe new compiler flags, a dependency,
or an upgrade as a readability improvement. The reader admits conventional
`tsconfig*.json`/`.jsonc` names (and `*.tsconfig.json`), manifests, and text lockfiles;
an inaccessible custom inherited config or dependency declaration is an explicit
context gap, not permission to guess its contents.

**Judgment.** Apply language knowledge within the assigned lens. Optimize the
reader's understanding of values, contracts, and effects, not the number of type
annotations or resemblance to another language. Plain functions, structural types,
local mutation, classes with a real lifecycle, and ordinary loops can already be
clear. `interface` versus `type`, array spelling, semicolons, naming prefixes,
`enum` versus literal unions, and functions versus arrow functions are not blanket
review rules. Effective team conventions govern style; these sources are background,
not silently adopted policy. Do not reproduce formatter/linter chores.

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
new hooks audit.

Background: [everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html),
[functions](https://www.typescriptlang.org/docs/handbook/2/functions.html),
[narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html),
[objects](https://www.typescriptlang.org/docs/handbook/2/objects.html),
[module reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html),
[declaration guidance](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html),
and [React TypeScript](https://react.dev/learn/typescript) only where React is established.
These are authoring references, not mandatory web reads during a review.
