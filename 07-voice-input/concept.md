# Voice Input for Claude Code — The Core Idea

## The Debate: Type English vs. Speak Naturally

**Option A — Type in English:**
Force yourself to formulate thoughts in a second language before typing. Cognitive overhead compounds: you're solving the problem AND translating simultaneously. Fast typists can keep up; everyone else slows down.

**Option B — Speak Vietnamese (or mixed Vi/En):**
Think in your native language, speak freely, let the machine translate. Zero translation overhead on your end. Whisper's `translate` task handles Vi→En in one pass — no intermediate step, no separate translation API call.

## Why "Tricky" Wins

The wrapper pattern is deceptively simple:

```
vc → speak → Enter → review English text → claude gets it
```

You never "use English" consciously. You just talk. The pipeline:
1. Captures raw audio (arecord)
2. Resamples to 16kHz mono (ffmpeg — Whisper's required format)
3. Transcribes + translates in one model pass (faster-whisper, task=translate)
4. Shows you the English output to verify before sending

The review step is the key insight: you confirm the translation is accurate before it reaches claude. If Whisper mistranslated a technical term, you catch it. If it's fine, one keypress sends it.

## What This Unlocks

- Mixed-language thinking works fine: "tôi muốn thêm một endpoint để GET /users với pagination" → clean English prompt
- Technical jargon survives translation because Whisper is trained on multilingual technical content
- No internet required after model download (~74MB base, ~244MB small)
- No separate translation service, no API keys, no latency from external calls

## The Real Cost

Speaking is slower than typing for short prompts. The payoff is for longer, more complex prompts where formulating full sentences in English becomes a bottleneck. For a one-liner like "run tests", just type it.

## Practical Rule

- Short command → type
- Complex prompt, nuanced requirement, Vietnamese-dominant thought → `vc`
