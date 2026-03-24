# 14-checkpoints

Safe experimentation via Claude Code's automatic checkpoint and rewind system.

## What Checkpoints Are

Every user prompt automatically creates a checkpoint — a snapshot of:
- The full conversation history
- All file modifications Claude made

No manual saving. No commands to remember. It just works.

## How to Rewind

Two ways to open the checkpoint browser:

```
Esc + Esc          ← keyboard shortcut
/rewind            ← slash command
```

Once open, select any past checkpoint. You'll get five options:

| Option | What it does |
|--------|-------------|
| Restore code and conversation | Full revert — messages + files |
| Restore conversation | Rewind messages only, keep current files |
| Restore code | Revert files only, keep full conversation |
| Summarize from here | Compress the conversation into a summary (reduces context) |
| Never mind | Cancel |

## The Core Pattern: Branch and Compare

```
Implement baseline → [Checkpoint A]
  └── Try approach 1 → test → [Checkpoint B]
  └── Rewind to A → Try approach 2 → test → [Checkpoint C]
  └── Choose winner → continue from B or C
```

This is the main use case. Instead of committing to one approach, you explore both and pick the winner.

## When to Use Each

| Situation | Checkpoint move |
|-----------|----------------|
| About to try a risky refactor | Do it — rewind if it fails |
| Tests started failing mid-session | Rewind to last green state |
| Two architecture options to compare | Checkpoint → impl A → checkpoint → rewind → impl B |
| Conversation too long | Summarize from an early checkpoint |
| Accidentally overwrote something | Rewind + Restore code |

## What Checkpoints Do NOT Track

- `rm`, `mv`, `cp`, shell operations — filesystem changes outside Claude's tools
- Files you edited manually in your editor
- External processes (database state, running servers)

**Rule:** if Claude didn't write the file change, the checkpoint doesn't know about it.

## Checkpoints vs Git

| | Git | Checkpoints |
|---|---|---|
| Tracks | File diffs | Conversation + files |
| Lifetime | Permanent | 30 days |
| Granularity | You decide | Every prompt |
| Sharing | Yes | No |
| Good for | Finalized work | Active exploration |

Use them together:
1. Explore with checkpoints — no fear, fast iteration
2. Once satisfied, `git commit` the result

## Config

```json
{
  "autoCheckpoint": true
}
```

Default is on. Only reason to turn it off is disk space.

## Practical Example: Debugging with Hypotheses

```
Bug: memory leak in production

Checkpoint "before debug" (auto)
  └── Hypothesis 1: event listeners not cleaned up
      → fix → profile → still leaking
      → Rewind to "before debug"
  └── Hypothesis 2: database connections leaking
      → fix → profile → still leaking
      → Rewind to "before debug"
  └── Hypothesis 3: circular reference in cache
      → fix → profile → FIXED ✓
      → git commit
```

Without checkpoints this requires git stash gymnastics. With checkpoints it's just `Esc+Esc`.
