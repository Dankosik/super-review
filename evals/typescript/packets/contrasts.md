# TypeScript reviewer inputs

Sections are independent changed-source examples. Unless stated otherwise, code
is private to the shown module, all uses are supplied, the supported compiler is
TypeScript 5.4 with strict checking, and no additional team convention applies.
The review scope is expression/structure, not correctness or tests. Each section
is a separate packet; do not supply adjacent cases or evaluator expectations.

## T01

Changed local formatting function and its only call:

```ts
function welcome<T extends string>(name: T): string {
  return `Welcome, ${name}`;
}
const message = welcome("Ada");
```

## T02

Changed function and calls:

```ts
function identity<T>(value: T) { return value; }
const user = identity({ name: "Ada", active: true });
const active: boolean = user.active;
```

## T03

The new formatter is used only with the declared Person shape. No external input
or decoding takes place in this module.

```ts
type Person = { first: string; last: string };
const people: Person[] = [{ first: "Ada", last: "Lovelace" }];
function label(person: any): string {
  const first = (person as { first: string }).first;
  const last = (person as { last: string }).last;
  return `${last}, ${first}`;
}
const labels = people.map(label);
```

## T04

A dependency's shipped declaration is stale; the pinned runtime always returns
the documented Port. The package adapter owns this assertion.

```ts
type Port = { close(): void };
declare function legacyOpen(): unknown;
// The pinned legacy runtime returns Port; its shipped declaration is unknown.
function openPort(): Port { return legacyOpen() as Port; }
const port = openPort();
port.close();
```

## T05

These are the complete internal producers and readers of the changed state.

```ts
type State = { kind: "loading" | "ready"; value?: string };
function loading(): State { return { kind: "loading" }; }
function ready(value: string): State { return { kind: "ready", value }; }
function label(state: State): string {
  if (state.kind === "loading") return "Loading";
  return (state.value as string).toUpperCase();
}
function size(state: State): number {
  return state.kind === "loading" ? 0 : (state.value as string).length;
}
const states = [loading(), ready("ok")];
const labels = states.map(label);
const sizes = states.map(size);
```

## T06

The new public options have independent meanings; these four forms are used by
existing integrations. Their serialized property names are part of the API.

```ts
export type ViewOptions = { compact: boolean; highlighted: boolean };
const views: ViewOptions[] = [
  { compact: false, highlighted: false },
  { compact: false, highlighted: true },
  { compact: true, highlighted: false },
  { compact: true, highlighted: true },
];
```

## T07

The function's null and empty paths both return the empty string. Whitespace is
not considered empty and must retain its existing formatting.

```ts
function display(value: string | null): string {
  if (value !== null) {
    if (value !== "") {
      return `[${value.toUpperCase()}]`;
    } else {
      return "";
    }
  } else {
    return "";
  }
}
const labels = [null, "", " ", "a"].map(display);
```

## T08

Activation begins only after registration completes. Failure is propagated without
translation. This is the complete changed operation.

```ts
declare function register(): Promise<string>;
declare function activate(id: string): Promise<void>;
async function start(): Promise<void> {
  const id = await register();
  await activate(id);
}
```

## T09

Changed config and later write in the same module:

```ts
type Config = { mode: "fast" | "safe" };
const config: Config = { mode: "fast" };
config.mode = "safe";
```

## T10

This is a handwritten public declaration. The package documents TypeScript 4.8+
consumer support; the workspace lockfile uses TypeScript 5.4. External consumers
are not available in the supplied snapshot. No API migration is requested.

```ts
export interface Options { mode: "fast" | "safe" }
export declare function options(): Options;
```

## T11

The changed package uses ESM and verbatimModuleSyntax. The platform module
registers a runtime adapter when evaluated; its Client shape is also a type.

```ts
import "./platform.js";
import type { Client } from "./platform.js";
export function close(client: Client): void { client.close(); }
```

## T12

The returned view deliberately shares nested state with its owner. Consumers only
read it; the owning module updates status later.

```ts
type Item = { status: { ready: boolean } };
const item: Item = { status: { ready: false } };
function view(): Readonly<Item> { return item; }
item.status.ready = true;
const ready = view().status.ready;
```

## T13

Changed complete local transformation:

```ts
function formatNames(names: readonly string[]): string {
  const trimmed = names.map(name => name.trim());
  const nonempty = trimmed.filter(name => name !== "");
  const unique = [...new Set(nonempty)];
  return unique.join(", ");
}
const label = formatNames([" Ada ", "", "Ada"]);
```

## T14

The changed operation calculates an invoice total and sends one summary. The
calculation is an existing domain responsibility, not a requested new capability.

```ts
type Line = { quantity: number; unitPrice: number };
declare function send(message: string): Promise<void>;
async function deliver(lines: readonly Line[], discount: number): Promise<void> {
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const discounted = subtotal * (1 - discount);
  const rounded = Math.round(discounted * 100) / 100;
  await send(`Total: ${rounded}`);
}
```

## T15

The email and receipt labels intentionally follow the same settlement rule,
including rounding and the currency suffix. These are its two current owners.

```ts
function emailLabel(cents: number): string {
  return `${(cents / 100).toFixed(2)} USD`;
}
function receiptLabel(cents: number): string {
  return `${(cents / 100).toFixed(2)} USD`;
}
```

## T16

The wire and persisted schemas are independently versioned. Their matching name
fields happen to be the same today; neither schema is derived from the other.

```ts
export interface WirePerson { name: string }
export interface StoredPerson { name: string }
export function decodeName(value: WirePerson): string { return value.name; }
export function storedName(value: StoredPerson): string { return value.name; }
```

## T17

The private helper receives a duration in milliseconds and a retry count. Its
argument labels now obscure those units at the only call site.

```ts
function describe(a: number, b: number): string {
  return `Wait ${a}ms; try ${b} times`;
}
const summary = describe(250, 3);
```

## T18

Both changed functions encode presentation metadata for the same fixed internal
codes. Unknown codes intentionally use the existing fallback in both readers.

```ts
function label(code: string): string {
  switch (code) {
    case "ready": return "Ready";
    case "paused": return "Paused";
    default: return "Unknown";
  }
}
function color(code: string): string {
  switch (code) {
    case "ready": return "green";
    case "paused": return "gray";
    default: return "black";
  }
}
```

## T19

The pinned dependency documentation and the local wrapper agree on the shape.

```ts
type Handle = { dispose(): void };
declare function oldFactory(): unknown;
// oldFactory v2 returns Handle; its legacy .d.ts still declares unknown.
function createHandle(): Handle { return oldFactory() as Handle; }
```

## T20

The owning package depends on Preact, configures jsxImportSource to preact, and
uses this props style consistently. The changed component has no state or effects.

```tsx
import type { ComponentChildren } from "preact";
type Props = { label: string; children?: ComponentChildren };
export function Panel({ label, children }: Props) {
  return <section aria-label={label}>{children}</section>;
}
```
