# Frontend technology-depth inputs

Controlled source excerpts, not Git revisions, installed policy or worker outputs.
Each section is an independent task: supply only that section and the selected
installed review resources. The baseline statements are controlled context, not
claims about a real checkout. Included declarations are whole-source targets;
external implementations and generated definitions not supplied remain unavailable.
No fixture code is executed. Grading material lives separately in cases.json.

## D01

Request: Review Pulse.tsx for React interaction cohesion only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### Pulse.tsx

```tsx
import { useEffect, useLayoutEffect, useRef } from "react";
export function Pulse({ onPulse }: { onPulse: () => void }) {
  const current = useRef(onPulse);
  useLayoutEffect(() => { current.current = onPulse; }, [onPulse]);
  useEffect(() => {
    const timer = window.setInterval(() => current.current(), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return null;
}
```

## D02

Request: Review Listener.tsx for React interaction cohesion only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### Listener.tsx

```tsx
import { useEffect } from "react";
export function Listener({ eventName }: { eventName: string }) {
  useEffect(() => {
    const log = () => console.log(eventName);
    window.addEventListener(eventName, log);
    return () => window.removeEventListener(eventName, log);
  }, [eventName]);
  return null;
}
```

## D03

Request: Review Draft.tsx for React state representation only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### Draft.tsx

```tsx
import { useState } from "react";
export function Draft() {
  const [text, setText] = useState("");
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [mode, setMode] = useState<"editing" | "confirmed">("editing");
  function confirm() { setConfirmed(text); setText(""); setMode("confirmed"); }
  function editAgain() { setText(confirmed ?? ""); setConfirmed(null); setMode("editing"); }
  function discard() { setText(""); setConfirmed(null); setMode("editing"); }
  return <section>{mode === "editing"
    ? <><input value={text} onChange={e => setText(e.target.value)} /><button onClick={confirm}>Confirm</button></>
    : <><output>{confirmed}</output><button onClick={editAgain}>Edit again</button></>}
    <button onClick={discard}>Discard</button></section>;
}
```

## D04

Request: Review Preferences.tsx for React state representation only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### Preferences.tsx

```tsx
import { useState } from "react";
export function Preferences() {
  const [showHints, setShowHints] = useState(true);
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");
  return <section><label><input type="checkbox" checked={showHints}
    onChange={e => setShowHints(e.target.checked)} />Hints</label>
    <select value={density} onChange={e => setDensity(e.target.value as typeof density)}>
      <option value="compact">Compact</option><option value="comfortable">Comfortable</option>
    </select></section>;
}
```

## D05

Request: Review Frame.tsx and its caller for component API clarity only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### Frame.tsx

```tsx
import { Children, cloneElement, type ReactElement, type ReactNode } from "react";
type PartProps = { children: ReactNode; location?: "heading" | "body" };
function Part({ children, location }: PartProps) { return <div data-location={location}>{children}</div>; }
function Frame({ children }: { children: ReactElement<PartProps>[] }) {
  return <section>{Children.map(children, (child, index) =>
    cloneElement(child, { location: index === 0 ? "heading" : "body" }))}</section>;
}
export function Example() { return <Frame><Part>Account</Part><Part>Details</Part></Frame>; }
```

## D06

Request: Review DescribedControl.tsx for component API clarity only.

Baseline: Private React/React DOM 19.2 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot.

### DescribedControl.tsx

```tsx
import { cloneElement, type ReactElement } from "react";
type ControlProps = { "aria-describedby"?: string };
// The caller supplies exactly one control accepting aria-describedby.
export function DescribedControl({ control, descriptionId }: {
  control: ReactElement<ControlProps>; descriptionId: string;
}) {
  const ids = [control.props["aria-describedby"], descriptionId].filter(Boolean).join(" ");
  return cloneElement(control, { "aria-describedby": ids });
}
```

## D07

Request: Review language-context.tsx and Layout.tsx for component API clarity only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. The deployed RSC integration supports direct rendering of client-exported Context. Only supplied private consumers exist.

### language-context.tsx

```tsx
"use client";
import { createContext, use, type ReactNode } from "react";
export const LanguageContext = createContext("en");
export function Boundary({ v, children }: { v: string; children: ReactNode }) {
  return <LanguageContext value={v}>{children}</LanguageContext>;
}
export function Greeting() { return <h1>{use(LanguageContext) === "fr" ? "Bonjour" : "Hello"}</h1>; }
```
### Layout.tsx

```tsx
import { Boundary, Greeting } from "./language-context";
export default function Layout() { return <Boundary v="fr"><Greeting /></Boundary>; }
```

## D08

Request: Review counter-context.tsx for component API clarity only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. RSC integration supports direct client-exported Context.

### counter-context.tsx

```tsx
"use client";
import { createContext, useState, type ReactNode } from "react";
export const CounterContext = createContext({ count: 0, increment: () => {} });
export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  return <CounterContext value={{ count, increment: () => setCount(c => c + 1) }}>{children}</CounterContext>;
}
```

## D09

Request: Review LocalZone.tsx and App.tsx for React interaction cohesion only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. SSR renderer supports browser(). Only supplied consumers exist.

### LocalZone.tsx

```tsx
import { useEffect, useState } from "react";
export function LocalZone() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <output>{Intl.DateTimeFormat().resolvedOptions().timeZone}</output>;
}
```
### App.tsx

```tsx
import { Suspense } from "react";
import { LocalZone } from "./LocalZone";
export function App() { return <Suspense fallback={null}><LocalZone /></Suspense>; }
```

## D10

Request: Review Zone.tsx for React interaction cohesion only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. SSR renderer supports browser().

### Zone.tsx

```tsx
import { useEffect, useState } from "react";
export function Zone({ serverZone }: { serverZone: string }) {
  const [zone, setZone] = useState(serverZone);
  useEffect(() => { setZone(Intl.DateTimeFormat().resolvedOptions().timeZone); }, []);
  return <output>{zone}</output>;
}
```

## D11

Request: Review app/Panel.tsx for Next loading and recovery flow only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot.

### app/Panel.tsx

```tsx
"use client";
type Result = { phase: "loading" } | { phase: "failed"; message: string } | { phase: "ready"; title: string };
export function Panel({ result, retry }: { result: Result; retry: () => void }) {
  return <section><h2>Report</h2>{result.phase === "loading" ? <p>Loading</p> :
    <div>{result.phase === "failed" ? <div><p>{result.message}</p><button onClick={retry}>Retry</button></div> :
      <article><h3>{result.title}</h3><p>Report details</p></article>}</div>}</section>;
}
```

## D12

Request: Review app/page.tsx and Report.tsx for Next loading and recovery flow only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot.

### app/page.tsx

```tsx
import { Suspense } from "react";
import { Report } from "./Report";
export default function Page() {
  return <main><h1>Report</h1><Suspense fallback={<p>Loading report</p>}><Report /></Suspense></main>;
}
```
### app/Report.tsx

```tsx
export async function Report() {
  const response = await fetch("https://service.example/report");
  return <article>{await response.text()}</article>;
}
```

## D13

Request: Review app/Recovery.tsx for Next loading and recovery flow only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot. The legacy boundary implementation is unavailable; only its explicit props contract below is available.

### app/Recovery.tsx

```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LegacyBoundary } from "./legacy-boundary";
export function Recovery({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { setAttempt(0); }, [path]);
  return <LegacyBoundary resetKey={`${path}:${attempt}`} fallback={(error: Error) =>
    <section><p>{error.message}</p><button onClick={() => { router.refresh(); setAttempt(a => a + 1); }}>Retry</button></section>
  }>{children}</LegacyBoundary>;
}
```
### app/legacy-boundary.d.ts

```ts
import type { ReactNode } from "react";
export declare function LegacyBoundary(props: {
  resetKey: string; fallback: (error: Error) => ReactNode; children: ReactNode;
}): ReactNode;
```

## D14

Request: Review app/error.tsx for Next loading and recovery flow only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot.

### app/error.tsx

```tsx
"use client";
export default function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  return <section><p>{error.message}</p><button onClick={reset}>Try again</button></section>;
}
```

## D15

Request: Review app/products/[id]/page.tsx for Next boundaries only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot. Existing scripts run next typegen and tsconfig includes .next/types/**/*.ts; route helper use is established by the supplied sibling. Generated definitions are not supplied.

### app/products/[id]/page.tsx

```tsx
type ProductRouteProps = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export default async function Page({ params }: ProductRouteProps) {
  return <h1>{(await params).id}</h1>;
}
```
### app/users/[id]/page.tsx

```tsx
export default async function Page({ params }: PageProps<"/users/[id]">) {
  return <h1>{(await params).id}</h1>;
}
```

## D16

Request: Review app/products/[id]/page.tsx and shared/ProductTitle.tsx for Next boundaries only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot. shared is a published React package also consumed outside Next; those consumers are not supplied.

### shared/ProductTitle.tsx

```tsx
export type ProductTitleProps = { productId: string };
export function ProductTitle({ productId }: ProductTitleProps) { return <h1>{productId}</h1>; }
```
### app/products/[id]/page.tsx

```tsx
import { ProductTitle } from "../../../shared/ProductTitle";
export default async function Page({ params }: PageProps<"/products/[id]">) {
  return <ProductTitle productId={(await params).id} />;
}
```

## D17

Request: Review app/Draft.tsx and draft-owner.tsx for Next data ownership only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot. next.config.ts sets cacheComponents: true. The supplied DraftOwner wraps the shared layout; only these consumers exist.

### app/draft-owner.tsx

```tsx
"use client";
import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
export const DraftContext = createContext<{ text: string; setText: Dispatch<SetStateAction<string>> } | null>(null);
export function DraftOwner({ children }: { children: ReactNode }) {
  const [text, setText] = useState("");
  return <DraftContext value={{ text, setText }}>{children}</DraftContext>;
}
```
### app/Draft.tsx

```tsx
"use client";
import { use, useState } from "react";
import { DraftContext } from "./draft-owner";
export function Draft() {
  const owner = use(DraftContext)!;
  const [text, setText] = useState(owner.text);
  return <input value={text} onChange={e => { setText(e.target.value); owner.setText(e.target.value); }} />;
}
```

## D18

Request: Review app/Draft.tsx for Next data ownership only.

Baseline: Next.js 16.3 App Router, React/React DOM 19.3, strict TypeScript. No team policy in this controlled snapshot. next.config.ts sets cacheComponents: true.

### app/Draft.tsx

```tsx
"use client";
import { useEffect, useState } from "react";
// Drafts must survive a page reload in the same tab.
export function Draft() {
  const [text, setText] = useState("");
  useEffect(() => { setText(sessionStorage.getItem("draft") ?? ""); }, []);
  return <input value={text} onChange={e => {
    const value = e.target.value;
    setText(value); sessionStorage.setItem("draft", value);
  }} />;
}
```

## D19

Request: Review Details.tsx for Tailwind presentation state only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper.

### Details.tsx

```tsx
import { useState } from "react";
export function Details() {
  const [open, setOpen] = useState(false);
  return <details onToggle={e => setOpen(e.currentTarget.open)}>
    <summary>Details <span className={open ? "inline-block rotate-180" : "inline-block"}>⌄</span></summary>
    <p>Information</p>
  </details>;
}
```

## D20

Request: Review Filter.tsx for Tailwind presentation state only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper.

### Filter.tsx

```tsx
import { useState } from "react";
export function Filter({ report }: { report: (active: boolean) => void }) {
  const [active, setActive] = useState(false);
  return <section><button aria-pressed={active} className={active ? "font-bold" : "font-normal"}
    onClick={() => { const next = !active; setActive(next); report(next); }}>Filter</button>
    {active && <p>Only active items</p>}</section>;
}
```

## D21

Request: Review Card.tsx for Tailwind layout boundaries only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper.

### Card.tsx

```tsx
import { useEffect, useRef, useState } from "react";
export function Card() {
  const shell = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= 360));
    observer.observe(shell.current!);
    return () => observer.disconnect();
  }, []);
  return <div ref={shell}><article className={wide ? "grid grid-cols-2" : "grid grid-cols-1"}>
    <h2>Account</h2><p>Details</p>
  </article></div>;
}
```

## D22

Request: Review Card.tsx and Preview.tsx for Tailwind layout boundaries only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper.

### Card.tsx

```tsx
export function Card({ density }: { density: "compact" | "comfortable" }) {
  return <article className={density === "compact" ? "p-2" : "p-6"}>Account</article>;
}
```
### Preview.tsx

```tsx
import { useState } from "react";
import { Card } from "./Card";
export function Preview() {
  const [compact, setCompact] = useState(false);
  return <><label><input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} />Compact</label>
    <Card density={compact ? "compact" : "comfortable"} /></>;
}
```

## D23

Request: Review local ui/NumberButtons.tsx and Caller.tsx for shadcn API clarity only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. components.json selects React Aria; local code imports react-aria-components. External implementation is not supplied.

### ui/NumberButtons.tsx

```tsx
import { Button } from "react-aria-components";
// Used only inside the product NumberField composition.
export function A() { return <Button slot="increment">+</Button>; }
export function B() { return <Button slot="decrement">-</Button>; }
```
### Caller.tsx

```tsx
import { NumberField, Label, Group, Input } from "react-aria-components";
import { A, B } from "./ui/NumberButtons";
export function Quantity() {
  return <NumberField><Label>Quantity</Label><Group><A /><Input /><B /></Group></NumberField>;
}
```

## D24

Request: Review local ui/Choice.tsx for shadcn API clarity only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. components.json selects React Aria; external primitive implementation is not supplied.

### ui/Choice.tsx

```tsx
import { Button, NumberField, Label, Group, Input } from "react-aria-components";
export function Quantity() {
  return <NumberField><Label>Quantity</Label><Group>
    <Button slot="decrement" className={({ isPressed }) => isPressed ? "font-bold" : "font-normal"}>-</Button>
    <Input />
    <Button slot="increment" className="data-[pressed]:font-bold">+</Button>
  </Group></NumberField>;
}
```

## D25

Request: Review Tick.tsx for React interaction cohesion only.

Baseline: Published React package: peer react ^19.0.0, development React/React DOM 19.3. Existing consumers include 19.1. No team policy in this controlled snapshot.

### Tick.tsx

```tsx
import { useEffect, useRef } from "react";
export function Tick({ callback }: { callback: () => void }) {
  const latest = useRef(callback);
  useEffect(() => { latest.current = callback; }, [callback]);
  useEffect(() => { const id = setInterval(() => latest.current(), 1000); return () => clearInterval(id); }, []);
  return null;
}
```

## D26

Request: Review app/error.tsx for Next loading and recovery flow only.

Baseline: Next.js 16.0 App Router and React 19.2. No team policy in this controlled snapshot.

### app/error.tsx

```tsx
"use client";
export default function ErrorView({ reset }: { reset: () => void }) {
  return <button onClick={reset}>Try again</button>;
}
```

## D27

Request: Review Quantity.tsx for shadcn API clarity only.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Aliased local primitive implementations are unavailable; the package contains both @base-ui/react and react-aria-components.

### Quantity.tsx

```tsx
import { NumberField, StepButton } from "@/ui/number-field";
export function Quantity() { return <NumberField><StepButton slot="increment">+</StepButton></NumberField>; }
```

## D28

Request: Use Super Review to review only Counter.vue for maintainability.

Baseline: Vue 3.5 and TypeScript strict; only this single-file component is supplied. No team policy in this controlled snapshot.

### Counter.vue

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
const count = ref(0);
const double = computed(() => count.value * 2);
</script>
<template><button @click="count++">{{ double }}</button></template>
```

## D29

Request: Review Toggle.tsx only for Tailwind presentation state, using the supplied target policy for this controlled probe.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper. The request explicitly selects the following policy snapshot.

### Toggle.tsx

```tsx
import { useState } from "react";
export function Toggle() {
  const [open, setOpen] = useState(false);
  return <details onToggle={e => setOpen(e.currentTarget.open)}><summary className={open ? "font-bold" : "font-normal"}>Details</summary><p>Text</p></details>;
}
```
### SUPER_REVIEW.md

```markdown
# Review conventions

## team.ts.state-owner
Language: TypeScript
Paths: Toggle.tsx
Lens: data-flow
Action: disable ts.data.make-transformations-visible

Retain the current state ownership convention for this component during the approved UI transition.
The independent component owner maintains this representation until that transition is complete.
```

## D30

Request: Review Details.tsx for Tailwind class duplication only; exclude state ownership and layout questions.

Baseline: Private React/React DOM 19.3 app; matching types; TypeScript strict, react-jsx. No team policy in this controlled snapshot. Tailwind 4, CSS imports tailwindcss; no custom variants or merge helper.

### Details.tsx

```tsx
import { useState } from "react";
export function Details() {
  const [open, setOpen] = useState(false);
  return <details onToggle={e => setOpen(e.currentTarget.open)}><summary className={open ? "font-bold" : "font-normal"}>Details</summary><p>Text</p></details>;
}
```
