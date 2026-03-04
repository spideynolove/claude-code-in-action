# Find the session
find ~/.claude -name "4f91fa5c-9c09-4ca8-9fe8-b446f82ae0df.jsonl" 2>/dev/null

# Strip invalid thinking blocks (signature < 50 chars = invalid)
python3 -c "
import json, sys

path = sys.argv[1]
lines = open(path).readlines()
out = []
fixed = 0

for line in lines:
    line = line.rstrip()
    if not line:
        continue
    try:
        obj = json.loads(line)
        def clean(content):
            global fixed
            if not isinstance(content, list):
                return content
            result = []
            for b in content:
                if b.get('type') == 'thinking' and len(b.get('signature', '')) < 100:
                    fixed += 1
                    continue
                result.append(b)
            return result
        msg = obj.get('message', {})
        if isinstance(msg.get('content'), list):
            msg['content'] = clean(msg['content'])
        out.append(json.dumps(obj))
    except:
        out.append(line)

with open(path, 'w') as f:
    f.write('\n'.join(out))
print(f'Stripped {fixed} invalid thinking blocks')
" ~/.claude/projects/-home-*/4f91fa5c-9c09-4ca8-9fe8-b446f82ae0df.jsonl
