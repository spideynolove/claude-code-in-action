# Repomix

Use `repomix` when you need a compact, queryable view of a codebase or remote repository.

## When to use it

- Pack the current repository into a single output for analysis.
- Pack a remote repository without cloning it manually.
- Search or read from an existing `repomix` output through MCP tools.

## Prefer MCP during active sessions

If `repomix` is registered in `mcporter`, prefer the MCP tools:

- `pack_codebase`
- `pack_remote_repository`
- `read_repomix_output`
- `grep_repomix_output`
- `file_system_read_file`
- `file_system_read_directory`

This avoids writing large output files unless you explicitly need them on disk.

## CLI usage

From a project root with a `repomix.config.json`:

```bash
repomix
repomix --style markdown -o repomix-output/summary.md
```

Use `--compress` on larger repositories to reduce token usage.

## Project config

Prefer a local `repomix.config.json` so output paths and ignore rules stay consistent across runs.
