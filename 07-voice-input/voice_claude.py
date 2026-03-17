#!/home/hung/env/.venv/bin/python
import argparse
import os
import signal
import subprocess
import sys
import tempfile
from pathlib import Path

CACHE_DIR = Path.home() / ".cache" / "voice-claude"
MODEL_CACHE = CACHE_DIR / "model"
MIN_WAV_SIZE = 50 * 1024


def record_audio(raw_path: Path) -> bool:
    print("Press Enter to start recording...")
    input()
    print("Recording... Press Enter to stop.")

    proc = subprocess.Popen(
        ["arecord", "-f", "S16_LE", "-r", "44100", "-c", "1", "-t", "wav", str(raw_path)],
        stderr=subprocess.DEVNULL,
    )

    try:
        input()
    except KeyboardInterrupt:
        pass
    finally:
        proc.send_signal(signal.SIGTERM)
        proc.wait()

    if not raw_path.exists() or raw_path.stat().st_size < MIN_WAV_SIZE:
        print("Warning: Recording too short or empty.")
        return False
    return True


def convert_audio(raw: Path, out: Path) -> bool:
    result = subprocess.run(
        ["ffmpeg", "-y", "-i", str(raw), "-ar", "16000", "-ac", "1", str(out)],
        stderr=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
    )
    if result.returncode != 0:
        print("Error: ffmpeg conversion failed.")
        return False
    if not out.exists() or out.stat().st_size < MIN_WAV_SIZE:
        print("Warning: Converted audio too short.")
        return False
    return True


def transcribe(wav: Path, model_size: str) -> str:
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("Error: faster-whisper not installed.")
        print("Run: uv pip install faster-whisper")
        sys.exit(1)

    print("\nTranscribing...")
    model = WhisperModel(
        model_size,
        device="cpu",
        download_root=str(MODEL_CACHE),
    )
    segments, _ = model.transcribe(str(wav), task="translate", language="vi")
    text = " ".join(seg.text.strip() for seg in segments).strip()
    return text


def confirm_and_send(text: str, dry_run: bool, claude_args: list[str]) -> None:
    print(f"\n--- Transcribed text ---\n{text}\n------------------------\n")

    if dry_run:
        print("[dry-run mode — not sending to claude]")
        return

    try:
        answer = input("[Y/n/e] Send to claude? ").strip().lower()
    except KeyboardInterrupt:
        print("\nAborted.")
        return

    if answer == "e":
        editor = os.environ.get("EDITOR", "nano")
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
            f.write(text)
            tmp = f.name
        subprocess.run([editor, tmp])
        with open(tmp) as f:
            text = f.read().strip()
        os.unlink(tmp)
        print(f"\n--- Edited text ---\n{text}\n-------------------\n")
        try:
            answer = input("[Y/n] Send to claude? ").strip().lower()
        except KeyboardInterrupt:
            print("\nAborted.")
            return

    if answer in ("", "y"):
        cmd = ["claude", "-p", text] + claude_args
        subprocess.run(cmd)
    else:
        print("Aborted.")


def main():
    parser = argparse.ArgumentParser(description="Voice input wrapper for Claude Code")
    parser.add_argument("--dry-run", "-d", action="store_true", help="Transcribe only, don't call claude")
    parser.add_argument("--model", "-m", default="base", help="Whisper model size (default: base)")
    parser.add_argument("--no-confirm", action="store_true", help="Skip review, send immediately")
    args, claude_args = parser.parse_known_args()

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    MODEL_CACHE.mkdir(parents=True, exist_ok=True)

    raw_wav = CACHE_DIR / "raw.wav"
    converted_wav = CACHE_DIR / "converted.wav"

    try:
        while True:
            if not record_audio(raw_wav):
                retry = input("Retry? [Y/n] ").strip().lower()
                if retry not in ("", "y"):
                    sys.exit(0)
                continue

            if not convert_audio(raw_wav, converted_wav):
                retry = input("Retry? [Y/n] ").strip().lower()
                if retry not in ("", "y"):
                    sys.exit(0)
                continue

            text = transcribe(converted_wav, args.model)

            if not text:
                print("Warning: No speech detected.")
                retry = input("Retry? [Y/n] ").strip().lower()
                if retry not in ("", "y"):
                    sys.exit(0)
                continue

            if args.no_confirm:
                print(f"\n--- Transcribed text ---\n{text}\n------------------------\n")
                if not args.dry_run:
                    cmd = ["claude", "-p", text] + claude_args
                    subprocess.run(cmd)
                else:
                    print("[dry-run mode — not sending to claude]")
            else:
                confirm_and_send(text, args.dry_run, claude_args)
            break

    except KeyboardInterrupt:
        print("\nInterrupted.")
        sys.exit(0)
    finally:
        for f in (raw_wav, converted_wav):
            if f.exists():
                f.unlink()


if __name__ == "__main__":
    main()
