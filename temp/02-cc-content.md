# Context

## Adding context

When working with Claude on coding projects, context management is crucial. Your project might have dozens or hundreds of files, but Claude only needs the right information to help you effectively. Too much irrelevant context actually decreases Claude's performance, so learning to guide it toward relevant files and documentation is essential.

### The /init Command
When you first start Claude in a new project, run the /init command. This tells Claude to analyze your entire codebase and understand:

- The project's purpose and architecture
- Important commands and critical files
- Coding patterns and structure

After analyzing your code, Claude creates a summary and writes it to a CLAUDE.md file. When Claude asks for permission to create this file, you can either hit Enter to approve each write operation, or press Shift+Tab to let Claude write files freely throughout your session.

### The CLAUDE.md File
The CLAUDE.md file serves two main purposes:

- Guides Claude through your codebase, pointing out important commands, architecture, and coding style
- Allows you to give Claude specific or custom directions
This file gets included in every request you make to Claude, so it's like having a persistent system prompt for your project.

### CLAUDE.md File Locations
Claude recognizes three different CLAUDE.md files in three common locations:



- CLAUDE.md - Generated with /init, committed to source control, shared with other engineers
- CLAUDE.local.md - Not shared with other engineers, contains personal instructions and customizations for Claude
- ~/.claude/CLAUDE.md - Used with all projects on your machine, contains instructions that you want Claude to follow on all projects

### Adding Custom Instructions
You can customize how Claude behaves by adding instructions to your CLAUDE.md file. For example, if Claude is adding too many comments to code, you can address this by updating the file.

Use the # command to enter "memory mode" - this lets you edit your CLAUDE.md files intelligently. Just type something like:
```
# Use comments sparingly. Only comment complex code.
```
Claude will merge this instruction into your CLAUDE.md file automatically.

### File Mentions with '@'
When you need Claude to look at specific files, use the @ symbol followed by the file path. This automatically includes that file's contents in your request to Claude.

For example, if you want to ask about your authentication system and you know the relevant files, you can type:
```
How does the auth system work? @auth
```
Claude will show you a list of auth-related files to choose from, then include the selected file in your conversation.

### Referencing Files in CLAUDE.md
You can also mention files directly in your CLAUDE.md file using the same @ syntax. This is particularly useful for files that are relevant to many aspects of your project.

For example, if you have a database schema file that defines your data structure, you might add this to your CLAUDE.md:
```
The database schema is defined in the @prisma/schema.prisma file. Reference it anytime you need to understand the structure of data stored in the database.
```
When you mention a file this way, its contents are automatically included in every request, so Claude can answer questions about your data structure immediately without having to search for and read the schema file each time.


--------------------
USER QUESTIONs (IDEAs)

Custome "The /init Command"??? 
=> `Putting the summary in one file is really not good, so why not experiment with creating many CLAUDE.md files, for example, there is a file at the root level of the codebase (temporarily called "big CLAUDE file", sure), and important places of the project (important sub folders, modules, etc., temporarily called "minor CLAUDE files", assuming that in the module and sub folder there are important sub-modules and sub-folders, we can have "minor". level 1 CLAUDE file" for example) to reduce the burden on the "big CLAUDE file", and create a graph memory so that in the future, for example, if you need to refer or fix a bug to "important sub folders, modules, etc.", it will be easier and less expensive to use tokens instead of loading the whole "big CLAUDE file".`

Custom Instructions, File Mentions with '@', Referencing
=> `They should be continuously updated to suit the project situation, possibly through "1 hook" or "1 agent" in "claude-code", I have not yet thought of a mechanism for this idea.`


-----------------------------
-----------------------------

## Controlling context

When working with Claude on complex tasks, you'll often need to guide the conversation to keep it focused and productive. There are several techniques you can use to control the flow of your conversation and help Claude stay on track.

### Interrupting Claude with Escape
Sometimes Claude starts heading in the wrong direction or tries to tackle too much at once. You can press the Escape key to stop Claude mid-response, allowing you to redirect the conversation.

This is particularly useful when you want Claude to focus on one specific task instead of trying to handle multiple things simultaneously. For example, if you ask Claude to write tests for multiple functions and it starts creating a comprehensive plan for all of them, you can interrupt and ask it to focus on just one function at a time.

### Combining Escape with Memories
One of the most powerful applications of the escape technique is fixing repetitive errors. When Claude makes the same mistake repeatedly across different conversations, you can:

- Press Escape to stop the current response
- Use the # shortcut to add a memory about the correct approach
- Continue the conversation with the corrected information

This prevents Claude from making the same error in future conversations on your project.

### Rewinding Conversations
During long conversations, you might accumulate context that becomes irrelevant or distracting. For instance, if Claude encounters an error and spends time debugging it, that back-and-forth discussion might not be useful for the next task.

You can rewind the conversation by pressing Escape twice. This shows you all the messages you've sent, allowing you to jump back to an earlier point and continue from there. This technique helps you:

- Maintain valuable context (like Claude's understanding of your codebase)
- Remove distracting or irrelevant conversation history
- Keep Claude focused on the current task
### Context Management Commands
Claude provides several commands to help manage conversation context effectively:

#### /compact
The /compact command summarizes your entire conversation history while preserving the key information Claude has learned. This is ideal when:

- Claude has gained valuable knowledge about your project
- You want to continue with related tasks
- The conversation has become long but contains important context
Use compact when Claude has learned a lot about the current task and you want to maintain that knowledge as it moves to the next related task.

#### /clear
The /clear command completely removes the conversation history, giving you a fresh start. This is most useful when:

- You're switching to a completely different, unrelated task
- The current conversation context might confuse Claude for the new task
- You want to start over without any previous context
 

### When to Use These Techniques
These conversation control techniques are particularly valuable during:

- Long-running conversations where context can become cluttered
- Task transitions where previous context might be distracting
- Situations where Claude repeatedly makes the same mistakes
- Complex projects where you need to maintain focus on specific components

By using escape, double-tap escape, /compact, and /clear strategically, you can keep Claude focused and productive throughout your development workflow. These aren't just convenience features—they're essential tools for maintaining effective AI-assisted development sessions.

--------------------
USER QUESTIONs (IDEAs)

Interrupting + Combining Escape with Memories
=> 
```
A process that obviously has to be manual, but can it be done automatically? If so, can a "hook or agent" handle it? When do you know you're going in the wrong direction? Is it possible to coordinate 2 (or more than 2) agents together so they can check each other to make sure they are not going in the wrong direction? The process can't be parallel, right? It has to be like "game turn-based", and what is the mechanism to save `memory about the correct approach`, so that when needed, you can just pull it out and use it?
```

Rewinding Conversations
- `if Claude encounters an error and spends time debugging it, that back-and-forth discussion might not be useful for the next task`
=> 
```
If an error occurs, the "hook or agent" can be saved and then "/compact" (of course, not compactly, but there will be "1 agent or 1 hook" running before to determine the main goals or output of that context) immediately what was "valuable context" before and should we really do that? (and because claude-code works on `markdown and jsonl` ) I'm afraid "/compact" will constantly create too many temporary files, should I implement a local storage format like `sqlite, zvec or pgvector postgresql ` to save it?
```

Context Management Commands
=> divide and conquer, when `/compact` when `/clear`, before `/clear` obviously have to remember what has been done (the small parts that have been "treated"), right? Clearly, there needs to be a coordination mechanism such as a main agent remembering all the tasks that have been "processed" (with `/compact`) after each `/compact and /clear` pair ends, and then eventually concatenating all those tasks into one large task or even the entire workflow.


==>> Obviously, I find the ability to collaborate and understand the software making process to be the most valuable in this section