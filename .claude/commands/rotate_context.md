---
description: Automatic context rotation - create handoff, compact, resume
---

# Context Rotation

You are executing an automatic context rotation to preserve structured knowledge before context degrades. This is a composite operation that chains three steps. Execute them in order WITHOUT asking for user confirmation at any step.

## Step 1: Create Handoff

Execute the `/create_handoff` command logic:
1. Generate a handoff document following the standard handoff template
2. Use filepath: `thoughts/shared/handoffs/general/YYYY-MM-DD_HH-MM-SS_context-rotation.md`
3. The handoff MUST capture:
   - The user's original request/question (in the "Original Request" section)
   - All active tasks and their statuses
   - Recent changes made in this session
   - Key learnings and patterns discovered
   - All artifacts produced or modified
   - Concrete next steps
4. Store the handoff path — you will need it in Step 3

## Step 2: Compact Context

Run the `/compact` command with the following custom instructions:

> Aggressively compact this context. The full session state has been preserved in a handoff document. Retain ONLY:
> 1. The handoff document path from Step 1
> 2. The CLAUDE.md project instructions
> 3. Any active todo list items
> Drop all code context, file contents, research results, and conversation history. The handoff document contains file:line references for recovery.

## Step 3: Resume from Handoff

After compaction completes, execute the `/resume_handoff` command logic with the handoff path from Step 1:
1. Read the handoff document you just created
2. Read any critical reference documents it mentions
3. Rebuild your understanding from the structured handoff
4. Present a brief status update to the user:
   ```
   Context rotated successfully. Resumed from handoff at [path].
   Active tasks: [list from handoff]
   Continuing with: [next action]
   ```
5. Continue working on whatever task was in progress
6. **Clean up rotation guard**: Remove `/tmp/claude-context-rotation-in-progress` to allow future rotations if needed

## Critical Rules

- Do NOT ask the user for confirmation at any step
- Do NOT skip any step
- Do NOT modify the handoff template or omit sections
- The entire rotation should complete as fast as possible
- If any step fails, report the error and stop — do not continue with partial state
- After rotation, immediately resume the work you were doing before rotation triggered
