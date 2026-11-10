import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const launcher = resolve(import.meta.dir, "../adapters/opencode/super-review");

// Fake OpenCode binaries record the launch; no model or real OpenCode runs here.
function launch(helpText: string, withGlobal: boolean, script = launcher) {
  const scratch = mkdtempSync(join(tmpdir(), "super-review-launcher-"));
  try {
    const fake = join(scratch, "opencode");
    writeFileSync(fake, `#!/bin/sh
if [ "$1" = "--help" ]; then printf '%s\\n' '${helpText}'; exit 0; fi
printf 'ARGS=%s\\n' "$*"
printf 'DIR=%s\\nDISABLE=%s\\nCONFIG=%s\\nCONTENT=%s\\n' "$OPENCODE_CONFIG_DIR" "\${OPENCODE_DISABLE_PROJECT_CONFIG:-}" "\${OPENCODE_CONFIG:-}" "\${OPENCODE_CONFIG_CONTENT:-}"
`);
    chmodSync(fake, 0o755);
    const xdg = join(scratch, "xdg");
    if (withGlobal) {
      mkdirSync(join(xdg, "opencode"), { recursive: true });
      writeFileSync(join(xdg, "opencode/opencode.json"), "{}");
    }
    const result = spawnSync("sh", [script, "naming", "only"], {
      env: { PATH: process.env.PATH, HOME: scratch, XDG_CONFIG_HOME: xdg, OPENCODE_BIN: fake, SUPER_REVIEW_SPECIALIST_MODEL: "prov/model-1" },
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    return { out: result.stdout, xdg };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

test("OpenCode 2 launcher uses a private server, keeps global config and selects review roles", () => {
  const { out, xdg } = launch("  --standalone            Run with a private server", true);
  expect(out).toContain("ARGS=--standalone --prompt Use Super Review for this request: naming only");
  expect(out).not.toContain("--pure");
  expect(out).toContain("DISABLE=1");
  expect(out).toContain("CONFIG=" + join(xdg, "opencode/opencode.json"));
  const content = JSON.parse(out.match(/^CONTENT=(.*)$/m)![1]);
  expect(content).toEqual({ default_agent: "super-review", agent: { "super-review-specialist": { model: "prov/model-1" } } });
});

test("the launcher finds its package when started through a symbolic link", () => {
  const bin = mkdtempSync(join(tmpdir(), "super-review-bin-"));
  try {
    // An absolute link, as in ~/.local/bin, and a relative link to that link.
    symlinkSync(launcher, join(bin, "super-review"));
    symlinkSync("super-review", join(bin, "sr"));
    for (const name of ["super-review", "sr"]) {
      const { out } = launch("      --pure          run without external plugins", false, join(bin, name));
      expect(out).toContain("DIR=" + resolve(import.meta.dir, "../adapters/opencode") + "\n");
    }
  } finally {
    rmSync(bin, { recursive: true, force: true });
  }
});

test("OpenCode 1 launcher keeps --pure and --agent and ignores project roles", () => {
  const { out } = launch("      --pure          run without external plugins", false);
  expect(out).toContain("ARGS=--pure --agent super-review --prompt Use Super Review for this request: naming only");
  expect(out).toContain("DISABLE=1");
  expect(out).toContain("CONTENT=\n");
});
