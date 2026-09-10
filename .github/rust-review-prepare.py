"""Finish native discovery metadata, then use the existing native build."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
for name in ['plugin.json', '.codex-plugin/plugin.json', 'skills/super-review/agents/openai.yaml']:
    file = root / name
    text = file.read_text().replace('Go PR', 'Go/Rust PR')
    if name == 'plugin.json':
        data = json.loads(text)
        if 'rust' not in data['keywords']:
            data['keywords'].insert(data['keywords'].index('go') + 1, 'rust')
        text = json.dumps(data, indent=2) + '\n'
    file.write_text(text)
print('Rust discovery descriptions and keyword aligned with the implemented language scope.')
