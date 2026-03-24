i deleted half my Claude setup last week and every output got BETTER

sounds backwards, but anthropic's own team just explained exactly why it works.

here's the one prompt that tells you what to cut (and you don't even have to paste anything):

this is what happens to everyone...

you get a bad output, so you add a rule to your skills. "be more concise."

next week, another bad output. another rule. "use a casual tone."

but a month later, something else breaks. "always explain technical terms."

you keep stacking, and it feels productive because you're fixing problems as they come up.

but 3 months in, you've got 30 rules piled on top of each other.

some of them contradict each other ("be concise" and "always explain your reasoning" are fighting).

some of them fix problems that the model doesn't even have anymore.

and the model is trying to follow all of them at once, which means it's doing none of them well.

it's like handing a chef a 47-step recipe when they only need 12.

the extra 35 steps slow the chef down, make them second-guess the parts they already know, and the dish comes out worse than if you'd just let them cook.

that's what over-prompting does.

anthropic just published a piece on how they build claude code (the ai coding agent).

their own engineering team found that their scaffolding was making the ai worse

which means your custom instructions are almost certainly doing the same thing.

so here's the actionable move...

instead of manually reading through your setup line by line, just tell claude to audit itself.

if you're in claude's desktop app, claude already has access to your:

claude[.]md (the file where your preferences and rules live), your skills folder (where your reusable instruction files are stored), your context files, everything.

just open claude code/cowork and say this:

—

"read my entire setup before responding. check my claude .md, every skill in my skills folder, every file in my context folder, and any other instruction files you can find.

then go through every rule, instruction, and preference you found. for each one, tell me:

1. is this something you already do by default without being told?
2. does this contradict or conflict with another rule somewhere else in my setup?
3. does this repeat something that's already covered by a different rule or file?
4. does this read like it was added to fix one specific bad output rather than improve outputs overall?
5. is this so vague that you'd interpret it differently every time? (ex: 'be more natural' or 'use a good tone')

then give me a list of everything you'd cut with a one-line reason for each, a list of any conflicts you found between files, and a cleaned up version of my claude.md with the dead weight removed."

—

one message. claude goes and reads your entire setup, audits it, and comes back with exactly what to cut and why.

you don't dig through files, you don't read every rule yourself. it does the whole thing.

once you get the results, don't just blindly delete everything it flags.

here's the process:

1. read what it flagged and why
2. delete the flagged rules
3. run your 3 most common tasks with the trimmed setup
4. did the output stay the same or get better? the deleted rules were dead weight
5. did something specific break? add back just that one rule

the goal is to find the minimum viable setup that gets you the output you want.

your ai setup should be getting simpler over time.

addition by subtraction baby