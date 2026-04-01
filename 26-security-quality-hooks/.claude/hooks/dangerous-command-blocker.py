#!/usr/bin/env python3
import json
import sys
import re

data = json.load(sys.stdin)
cmd = data.get('tool_input', {}).get('command', '')

catastrophic_patterns = [
    (r'\brm\s+.*\s+/\s*$', 'rm on root directory'),
    (r'\brm\s+.*\s+~\s*$', 'rm on home directory'),
    (r'\brm\s+.*\s+\*\s*$', 'rm with star wildcard'),
    (r'\brm\s+-[rfRF]*[rfRF]+.*\*', 'rm -rf with wildcards'),
    (r'\b(dd\s+if=|dd\s+of=/dev)', 'dd disk operations'),
    (r'\b(mkfs\.|mkswap\s|fdisk\s)', 'filesystem formatting'),
    (r'>\s*/dev/sd[a-z]', 'direct disk write'),
    (r'\bchmod\s+(-R\s+)?777\s+/', 'chmod 777 on root'),
    (r'\bchown\s+(-R\s+)?.*\s+/$', 'chown on root directory'),
]

for pattern, desc in catastrophic_patterns:
    if re.search(pattern, cmd, re.IGNORECASE):
        print(f'BLOCKED: Catastrophic command — {desc}', file=sys.stderr)
        print(f'Command: {cmd[:100]}', file=sys.stderr)
        sys.exit(2)

critical_paths = [
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?\.claude(/|$|\s)', 'Claude Code configuration'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?\.git(/|$|\s)', 'Git repository'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?node_modules(/|$|\s)', 'Node.js dependencies'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?[^\s]*\.env\b', 'Environment variables'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?[^\s]*package\.json\b', 'Package manifest'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?[^\s]*requirements\.txt\b', 'Python dependencies'),
    (r'\b(rm|mv)\s+(-[rfRF]+\s+)?[^\s]*go\.mod\b', 'Go module file'),
]

for pattern, desc in critical_paths:
    if re.search(pattern, cmd, re.IGNORECASE):
        print(f'BLOCKED: Critical path protection — {desc}', file=sys.stderr)
        print(f'Command: {cmd[:100]}', file=sys.stderr)
        sys.exit(2)

suspicious_patterns = [
    (r'\bfind\s+.*-delete', 'find -delete operation'),
    (r'\bgit\s+push\s+.*--force', 'force push'),
    (r'\bgit\s+reset\s+--hard', 'git reset --hard'),
]

for pattern, desc in suspicious_patterns:
    if re.search(pattern, cmd, re.IGNORECASE):
        print(f'WARNING: Potentially destructive command — {desc}', file=sys.stderr)
        print(f'Command: {cmd[:100]}', file=sys.stderr)

sys.exit(0)
