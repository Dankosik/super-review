# OpenCode

Extract the versioned OpenCode ZIP and use its `super-review` launcher, or set
`OPENCODE_CONFIG_DIR` to that extracted directory and run `/super-review`.
The launcher preserves the caller's current directory for local review.

Choose a specialist model using `SUPER_REVIEW_SPECIALIST_MODEL=provider/model-id`
or the existing configuration file at
`~/.config/super-review/opencode-specialist-model`. The orchestrator keeps its
configured model. The adapter adds no runtime dependency or custom tool.

Native read, glob, grep and Bash tools inspect source. The primary role can
invoke only `super-review-specialist`; the specialist cannot delegate. Both omit
edit/write tools, but Bash is not a read-only sandbox. The skill limits it to
source acquisition and inspection. Native task results carry full review reports.

Use a new versioned directory when updating. No provider credentials are bundled
or copied by the package. Host access and model configuration remain yours.
