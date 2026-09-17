# TypeScript contract-depth inputs

Each section is an independent changed-source packet. Include this baseline with
only the selected section, never adjacent sections or evaluator material. Unless
overridden, the compiler is TypeScript 5.4, strict is enabled, target/lib are ES2022,
module is ESNext with Bundler resolution, and no host-specific ambient types are
loaded. The runtime supports the shown ES2022 operations; no Node.js, Bun, Deno or
framework is implied. All local uses are shown, no extra team style applies, and
the scope is expression/structure rather than correctness or tests. Files shown as
build outputs are compatibility evidence, not additional review targets.

## TD01

The function accepts objects with an id while integrations supply their own extra
fields. The fresh-literal call and explicit type argument below are supported.

```ts
function describeId<T extends { id: string }>(value: T): string {
  return `ID: ${value.id}`;
}
const first = describeId({ id: "42", source: "import" });
const second = describeId<{ id: string; version: number }>({ id: "7", version: 2 });
```

## TD02

The local helper has no effects and is used only here to check palette values.
There are no later writes, external consumers or other uses of the helper.

```ts
type Color = string | [number, number, number];
function definePalette<T extends Record<string, Color>>(value: T): T {
  return value;
}
const palette = definePalette({
  primary: "#336699",
  accent: [10, 20, 30] as [number, number, number],
});
const label = palette.primary.toUpperCase();
const channel: number = palette.accent[0];
```

## TD03

The author compiles with TypeScript 5.4. The ESM package ships only `dist`; it
supports consumers using TypeScript 4.8 and ES2022. Consumers receive neither the
source helper nor source TypeScript. Complete relevant files are supplied; there
are no other exports, side effects, mutation or consumers of the helper.

### package.json (context)
```json
{"type":"module","files":["dist"],"exports":{".":{"types":"./dist/index.d.ts","default":"./dist/index.js"}}}
```

### src/index.ts (changed source)
```ts
export type Color = string | [number, number, number];
function definePalette<T extends Record<string, Color>>(value: T): T {
  return value;
}
export const palette = definePalette({
  primary: "#336699",
  accent: [10, 20, 30] as [number, number, number],
});
```

### dist/index.d.ts (current output)
```ts
export type Color = string | [number, number, number];
export declare const palette: { primary: string; accent: [number, number, number] };
```

### dist/index.js (current output)
```js
function definePalette(value) { return value; }
export const palette = definePalette({ primary: "#336699", accent: [10, 20, 30] });
```

### consumer.ts (TypeScript 4.8 context)
```ts
import { palette } from "palette-package";
const title: string = palette.primary.toUpperCase();
const channel: number = palette.accent[0];
```

## TD04

This local helper names routes. Its callers need literal tuples to name the
existing routes; they do not mutate the returned lists. All callers pass inline
literals and each currently carries the same const assertion.

```ts
function routes<T extends readonly string[]>(names: T): T { return names; }
const pages = routes(["home", "about"] as const);
const dialogs = routes(["confirm", "cancel"] as const);
type Page = typeof pages[number];
const home: Page = "home";
```

## TD05

Callers intentionally receive mutable arrays and append names later. This is the
complete local contract and its uses.

```ts
function routes<T extends string[]>(names: T): T { return names; }
const pages = routes(["home", "about"]);
pages.push("settings");
const selected: string[] = pages;
```

## TD06

Only this local helper and these calls exist. The second argument is selected
from the choices rather than establishing additional choices. There are no
explicit generic arguments. The compiler baseline is TypeScript 5.4.

```ts
function choose<C extends string, D extends C>(choices: readonly C[], selected: D): C {
  return selected;
}
const color = choose(["red", "blue"], "red");
const checked: "red" | "blue" = color;
```

## TD07

Both parameters contribute to the result's element type. All current calls and
the consumer contract are shown.

```ts
function pair<T extends string>(first: T, second: T): T[] { return [first, second]; }
const options = pair("red", "blue");
options.push("blue");
const selected: ("red" | "blue")[] = options;
```

## TD08

The owning package supports TypeScript 5.5+. This function is local and its only
use is the filter below. Nothing writes undefined back into the result.

```ts
const values: (string | undefined)[] = ["one", undefined, "two"];
const names = values.filter((value): value is string => value !== undefined);
const label = names.map(name => name.toUpperCase()).join(", ");
```

## TD09

The compiler is TypeScript 5.5+. The filter callback deliberately has a boolean
contract: the resulting array is later used as a nullable work list.

```ts
const values: (number | null)[] = [1, null, 2];
const pending = values.filter((value): boolean => value !== null);
pending.push(null);
const work: (number | null)[] = pending;
```

## TD10

The owning package supports TypeScript 5.4; no compiler upgrade is requested.
The local filter and all consumers are shown.

```ts
const values: (string | undefined)[] = ["one", undefined, "two"];
const names = values.filter((value): value is string => value !== undefined);
const label = names.map(name => name.toUpperCase()).join(", ");
```

## TD11

The local function has no exported declaration or function-type consumers. Only
these calls exist; callers do not depend on rejecting a union-valued argument.

```ts
function label(value: string): string;
function label(value: number): string;
function label(value: string | number): string { return String(value); }
const labels = [label("item"), label(42)];
```

## TD12

These overloads are a supported public API. Callers rely on the result of each
alternative, and one consumer passes the function as a value.

```ts
export function convert(value: string): number;
export function convert(value: number): string;
export function convert(value: string | number): number | string {
  return typeof value === "string" ? Number(value) : String(value);
}
const numeric: number = convert("42");
const text: string = convert(42);
const readNumber: (value: string) => number = convert;
```

## TD13

The public AllResults contract represents results of both overloads. Consumers
store results from either call; the wrapper's call signature is also used.

```ts
export declare function convert(value: string): number;
export declare function convert(value: number): string;
export type AllResults = number | string;
export const forward: typeof convert = convert;
const results: AllResults[] = [forward("42"), forward(42)];
const first: number = forward("42");
```

## TD14

Each existing event owns one payload shape. The handler object must expose that
per-key relationship; both current handlers and their calls are shown.

```ts
type Payloads = {
  saved: { id: string };
  removed: { id: string; reason: string };
};
type Handlers = { [K in keyof Payloads]: (payload: Payloads[K]) => string };
const handlers: Handlers = {
  saved: payload => payload.id,
  removed: payload => `${payload.id}: ${payload.reason}`,
};
const saved = handlers.saved({ id: "42" });
const removed = handlers.removed({ id: "42", reason: "requested" });
```

## TD15

InternalRow and Summary belong to independently evolving boundaries. Summary's
established contract is a mutable required string id and name. It has no declaration
merging or dependency on persistence modifiers; the shown consumers are complete.

```ts
type InternalRow = { id?: string; name?: string; secret?: string; revision: number };
type Summary = Required<Pick<Omit<InternalRow, "secret">, "id" | "name">>;
function label(summary: Summary): string { return `${summary.id}: ${summary.name}`; }
const summary: Summary = { id: "42", name: "Item" };
summary.name = "Updated";
const title = label(summary);
```

## TD16

The public helper describes arrays containing one variant, not arrays with a mix
of variants. Existing consumers rely on distribution over the union.

```ts
export type VariantArray<T> = T extends unknown ? T[] : never;
type Batch = VariantArray<string | number>;
const batches: Batch[] = [["one", "two"], [1, 2]];
```

## TD17

The owning package already depends on Zod 4.0.0 and TypeScript 5.5+. Entry is
internal and intentionally describes the output of EntrySchema only; the parse
call and all consumers already exist. No new validation is requested.

```ts
import { z } from "zod";
const EntrySchema = z.object({
  tags: z.string().transform(text => text.split(",")),
});
type Entry = { tags: string[] };
function decode(raw: unknown): Entry { return EntrySchema.parse(raw); }
const count = decode({ tags: "one,two" }).tags.length;
```

## TD18

The package already uses Zod 4.0.0 and TypeScript 5.5+. Input text and parsed tags
are distinct phases. PublicEntry belongs to a separately versioned API; it must
not inherit internal schema changes even though its current shape matches output.

```ts
import { z } from "zod";
const EntrySchema = z.object({
  tags: z.string().transform(text => text.split(",")),
});
type EntryInput = z.input<typeof EntrySchema>;
type EntryOutput = z.output<typeof EntrySchema>;
export interface PublicEntry { tags: string[] }
function decode(raw: EntryInput): EntryOutput { return EntrySchema.parse(raw); }
function publish(entry: EntryOutput): PublicEntry { return { tags: entry.tags }; }
const entry = publish(decode({ tags: "one,two" }));
```

## TD19

This complete local registry is the owner of the operation set. The Operation
alias intentionally repeats its keys and has no independent consumers or versioning.

```ts
const operations = {
  trim: (value: string) => value.trim(),
  upper: (value: string) => value.toUpperCase(),
};
type Operation = "trim" | "upper";
function apply(operation: Operation, value: string): string {
  return operations[operation](value);
}
const label = apply("trim", " item ");
```

## TD20

The existing domain has three statuses. The override table is deliberately partial;
unknown labels fall back to the status itself. All three statuses reach this reader.

```ts
type Status = "ready" | "paused" | "archived";
const overrides: Partial<Record<Status, string>> = { ready: "Ready now" };
function label(status: Status): string { return overrides[status] ?? status; }
const labels = (["ready", "paused", "archived"] as const).map(label);
```

## TD21

Selected profile: dependency-boundaries. This internal ESM facade has no effects,
reassigned bindings, external consumers or adaptation. The duplicated type is
intentionally the same Config exported by operation.ts. All involved source is shown.

### operation.ts
```ts
export type Config = { prefix: string };
export function run(config: Config): string { return `${config.prefix}: running`; }
```

### index.ts
```ts
import * as operation from "./operation.js";
export const run = operation.run;
export type Config = Parameters<typeof operation.run>[0];
```

### consumer.ts
```ts
import { run } from "./index.js";
import type { Config } from "./index.js";
const config: Config = { prefix: "Task" };
const label = run(config);
```

## TD22

Selected profile: dependency-boundaries. The ESM package uses verbatimModuleSyntax.
Handle is a public runtime constructor; its value identity is part of the contract.

### handle.ts
```ts
export class Handle {
  constructor(public readonly id: string) {}
}
```

### index.ts
```ts
export { Handle } from "./handle.js";
```

### consumer.ts
```ts
import { Handle } from "./index.js";
const handle = new Handle("42");
const owned: boolean = handle instanceof Handle;
```

## TD23

Selected profile: dependency-boundaries. This package supports import and require
consumers on Node.js 20. They use TypeScript 5.4 with NodeNext resolution/module,
ES2022 target/lib and strict checking. These handwritten public declarations and
their existing JS counterparts intentionally represent both formats. A module
migration is not requested. The selected declarations are the changed source.

### package.json (context)
```json
{"type":"module","exports":{".":{"import":{"types":"./index.d.mts","default":"./index.mjs"},"require":{"types":"./index.d.cts","default":"./index.cjs"}}}}
```

### index.d.mts
```ts
export declare function label(value: string): string;
```

### index.d.cts
```ts
declare function label(value: string): string;
export = label;
```

### index.mjs (runtime context)
```js
export function label(value) { return `Item: ${value}`; }
```

### index.cjs (runtime context)
```js
module.exports = function label(value) { return `Item: ${value}`; };
```

### import-consumer.mts (context)
```ts
import { label } from "dual-label";
const title: string = label("42");
```

### require-consumer.cts (context)
```ts
import label = require("dual-label");
const title: string = label("42");
```

## TD24

Selected profile: dependency-boundaries. Runtime entry points and consumer-selected
declaration files are absent from the supplied snapshot. The workspace uses Bundler
resolution and maps @internal/* to src/*. The exported facade is changed source;
no evidence establishes that consumers can resolve those aliases at runtime.

```ts
export { run } from "./operation.js";
export type { Config } from "./operation.js";
```

## TD25

exactOptionalPropertyTypes is true in this package. Omission means no update,
null means clear, and an empty string is a valid value. Property presence is
observed by the consumer. All producers are shown; no additional states are required.

```ts
type Patch = { name?: string | null };
function patch(name: string | null | undefined): Patch {
  return name === undefined ? {} : { name };
}
function describe(update: Patch): string {
  if (!("name" in update)) return "unchanged";
  return update.name === null ? "cleared" : `set:${update.name}`;
}
const updates = [undefined, null, "", "Ada"].map(patch);
const descriptions = updates.map(describe);
```

## TD26

Partial results and diagnostics are independent parts of the established public
protocol. The shown producers include data together with diagnostics. Consumers
use both; neither is a newly discovered failure state.

```ts
export type Report = { rows: string[]; diagnostics: string[] };
const reports: Report[] = [
  { rows: [], diagnostics: [] },
  { rows: ["one"], diagnostics: [] },
  { rows: [], diagnostics: ["skipped"] },
  { rows: ["one"], diagnostics: ["second row skipped"] },
];
function summarize(report: Report): string {
  return `${report.rows.join(",")}; ${report.diagnostics.join(";")}`;
}
const summaries = reports.map(summarize);
```

## TD27

Null means unknown, while zero is a real displayed count. These are the complete
local function and its callers.

```ts
function countLabel(value: number | null): string {
  return value === null ? "unknown" : String(value);
}
const labels = [null, 0, 1].map(countLabel);
```
