#!/usr/bin/env python3
"""Build deterministic install archives; no review logic or model access."""
import hashlib
import json
import shutil
import subprocess
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
VERSION = json.loads((ROOT / "package.json").read_text())["version"]
DIST.mkdir(exist_ok=True)
target = DIST / "opencode"
if target.exists():
    shutil.rmtree(target)
shutil.copytree(ROOT / "adapters/opencode", target)
shutil.copytree(ROOT / "skills/super-review", target / "skills/super-review")
for name in ["docs", "examples"]:
    shutil.copytree(ROOT / name, target / name)
for name in ["README.md", "LICENSE", "PRIVACY.md", "CONTRIBUTING.md", "CHANGELOG.md", "THIRD_PARTY_NOTICES.md"]:
    shutil.copy2(ROOT / name, target / name)

def archive(name, files):
    destination = DIST / name
    with zipfile.ZipFile(destination, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for source, arcname in sorted(files, key=lambda item: item[1]):
            info = zipfile.ZipInfo(arcname, (1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100755 if source.stat().st_mode & 0o111 else 0o100644) << 16
            output.writestr(info, source.read_bytes())
    return {"name": name, "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()}

opencode_files = [(p, "opencode/" + p.relative_to(target).as_posix()) for p in target.rglob("*") if p.is_file()]
skill_root = ROOT / "skills/super-review"
skill_files = [(p, "super-review/" + p.relative_to(skill_root).as_posix()) for p in skill_root.rglob("*") if p.is_file()]
assets = [
    archive(f"super-review-{VERSION}-opencode.zip", opencode_files),
    archive(f"super-review-{VERSION}-skill.zip", skill_files),
]
claude_root = ROOT / "adapters/claude/plugin"
assets.append(archive(f"super-review-{VERSION}-claude.zip", [
    (p, "super-review/" + p.relative_to(claude_root).as_posix())
    for p in claude_root.rglob("*") if p.is_file()
]))
codex_files = []
for name in [".codex-plugin", ".agents", "skills", "runtime", "assets", "docs", "examples"]:
    codex_files.extend((p, "super-review/" + p.relative_to(ROOT).as_posix()) for p in (ROOT / name).rglob("*") if p.is_file())
for name in ["plugin.json", "mcp.json", ".mcp.json", "README.md", "LICENSE", "PRIVACY.md", "CHANGELOG.md", "CONTRIBUTING.md", "THIRD_PARTY_NOTICES.md"]:
    codex_files.append((ROOT / name, "super-review/" + name))
assets.append(archive(f"super-review-{VERSION}-codex.zip", codex_files))
commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True)
receipt = {"version": VERSION, "commit": commit.stdout.strip() if commit.returncode == 0 else None, "assets": assets}
(DIST / "manifest.json").write_text(json.dumps(receipt, indent=2) + "\n")
(DIST / "SHA256SUMS").write_text("".join(a["sha256"] + "  " + a["name"] + "\n" for a in assets))
print(json.dumps(receipt, indent=2))
