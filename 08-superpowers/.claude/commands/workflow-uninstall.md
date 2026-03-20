Remove the concise-planning workflow block from AGENTS.md.

Run:
```bash
python3 -c "
import re, pathlib
p = pathlib.Path('./AGENTS.md')
text = p.read_text()
cleaned = re.sub(r'\n## Planning constraints \(concise-workflow\).*?(?=\n## |\Z)', '', text, flags=re.DOTALL)
p.write_text(cleaned)
print('Workflow removed from AGENTS.md')
"
```
