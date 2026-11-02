---
description: Resume work from handoff document with context analysis and validation
---

# Resume work from a handoff document

You are tasked with resuming work from a handoff document through an interactive process. These handoffs contain critical context, learnings, and next steps from previous work sessions that need to be understood and continued.

## Restate Original Request — MANDATORY

**In EVERY response you give to the user after resuming, begin with a brief 1-2 sentence bold summary of the original request from the handoff's "Original Request" section, formatted as:**

> **Original request:** {concise restatement of what the user asked}

This is critical for the user's workflow — they manage many concurrent tasks and need instant reorientation. If the handoff does not have an "Original Request" section, infer it from the "Task(s)" section.

## Initial Response

When this command is invoked:

1. **If the path to a handoff document was provided**:
   - If a handoff document path was provided as a parameter, skip the default message
   - Immediately read the handoff document FULLY
   - Immediately read any research or plan documents that it links to under `thoughts/shared/plans` or `thoughts/shared/research`. do NOT use a sub-agent to read these critical files.
   - Begin the analysis process by ingesting relevant context from the handoff document, reading additional files it mentions
   - Then present your analysis and **immediately begin work on the first action item** — do NOT ask for confirmation or permission to proceed.

2. **If a ticket number (like ENG-XXXX) was provided**:
   - Ensure your `thoughts/` directory is synced (copy from the main repo if you are in a worktree).
   - locate the most recent handoff document for the ticket. Tickets will be located in `thoughts/shared/handoffs/ENG-XXXX` where `ENG-XXXX` is the ticket number. e.g. for `ENG-2124` the handoffs would be in `thoughts/shared/handoffs/ENG-2124/`. **List this directory's contents.**
   - There may be zero, one or multiple files in the directory.
   - **If there are zero files in the directory, or the directory does not exist**: tell the user: "I'm sorry, I can't seem to find that handoff document. Can you please provide me with a path to it?"
   - **If there is only one file in the directory**: proceed with that handoff
   - **If there are multiple files in the directory**: using the date and time specified in the file name (it will be in the format `YYYY-MM-DD_HH-MM-SS` in 24-hour time format), proceed with the _most recent_ handoff document.
   - Immediately read the handoff document FULLY
   - Immediately read any research or plan documents that it links to under `thoughts/shared/plans` or `thoughts/shared/research`; do NOT use a sub-agent to read these critical files.
   - Begin the analysis process by ingesting relevant context from the handoff document, reading additional files it mentions
   - Then present your analysis and **immediately begin work on the first action item** — do NOT ask for confirmation or permission to proceed.

3. **If no parameters provided**, respond with:
```
I'll help you resume work from a handoff document. Let me find the available handoffs.

Which handoff would you like to resume from?

Tip: You can invoke this command directly with a handoff path: `/resume_handoff `thoughts/shared/handoffs/ENG-XXXX/YYYY-MM-DD_HH-MM-SS_ENG-XXXX_description.md`

or using a ticket number to resume from the most recent handoff for that ticket: `/resume_handoff ENG-XXXX`
```

Then wait for the user's input.

## Process Steps

### Step 1: Read and Analyze Handoff

1. **Read handoff document completely**:
   - Use the Read tool WITHOUT limit/offset parameters
   - Extract all sections:
     - Task(s) and their statuses
     - Recent changes
     - Learnings
     - Artifacts
     - Action items and next steps
     - Other notes

2. **Spawn focused research tasks**:
   Based on the handoff content, spawn parallel research tasks to verify current state:

   ```
   Task 1 - Gather artifact context:
   Read all artifacts mentioned in the handoff.
   1. Read feature documents listed in "Artifacts"
   2. Read implementation plans referenced
   3. Read any research documents mentioned
   4. Extract key requirements and decisions
   Use tools: Read
   Return: Summary of artifact contents and key decisions
   ```

3. **Wait for ALL sub-tasks to complete** before proceeding

4. **Read critical files identified**:
   - Read files from "Learnings" section completely
   - Read files from "Recent changes" to understand modifications
   - Read any new related files discovered during research

### Step 2: Synthesize and Present Analysis

1. **Present comprehensive analysis**:
   ```
   I've analyzed the handoff from [date] by [researcher]. Here's the current situation:

   **Original Tasks:**
   - [Task 1]: [Status from handoff] → [Current verification]
   - [Task 2]: [Status from handoff] → [Current verification]

   **Key Learnings Validated:**
   - [Learning with file:line reference] - [Still valid/Changed]
   - [Pattern discovered] - [Still applicable/Modified]

   **Recent Changes Status:**
   - [Change 1] - [Verified present/Missing/Modified]
   - [Change 2] - [Verified present/Missing/Modified]

   **Artifacts Reviewed:**
   - [Document 1]: [Key takeaway]
   - [Document 2]: [Key takeaway]

   **Next Actions To Take:**
   Based on the handoff's action items and current state:
   1. [Most logical next step based on handoff] ← STARTING NOW
   2. [Second priority action]
   3. [Additional tasks discovered]

   **Potential Issues Identified:**
   - [Any conflicts or regressions found]
   - [Missing dependencies or broken code]

   ```

2. **Do NOT ask for confirmation** before proceeding. Immediately proceed to Step 3 and begin work. The ONLY exception is if you are genuinely confused about which of multiple conflicting paths to take — in that case, notify the user and respond with <docregblock>?</docregblock>. Otherwise, just start.

### Step 3: Create Action Plan

1. **Use TodoWrite to create task list**:
   - Convert action items from handoff into todos
   - Add any new tasks discovered during analysis
   - Prioritize based on dependencies and handoff guidance

2. **Show the plan and immediately begin**:
   ```
   I've created a task list based on the handoff and current analysis:

   [Show todo list]

   Starting with: [task description]
   ```

### Step 4: Begin Implementation

1. **Start immediately with the first task — no permission needed**
2. **Reference learnings from handoff** throughout implementation
3. **Apply patterns and approaches documented** in the handoff
4. **Update progress** as tasks are completed

## Guidelines

1. **Be Thorough in Analysis**:
   - Read the entire handoff document first
   - Verify ALL mentioned changes still exist
   - Check for any regressions or conflicts
   - Read all referenced artifacts

2. **Be Decisive**:
   - Present findings concisely, then immediately start work
   - Do NOT ask for buy-in or permission to proceed
   - Adapt as you go based on what you discover
   - Only pause if there is genuine ambiguity with no clear path forward

3. **Leverage Handoff Wisdom**:
   - Pay special attention to "Learnings" section
   - Apply documented patterns and approaches
   - Avoid repeating mistakes mentioned
   - Build on discovered solutions

4. **Track Continuity**:
   - Use TodoWrite to maintain task continuity
   - Reference the handoff document in commits
   - Document any deviations from original plan
   - Consider creating a new handoff when done

5. **Validate Before Acting**:
   - Never assume handoff state matches current state
   - Verify all file references still exist
   - Check for breaking changes since handoff
   - Confirm patterns are still valid

6. **Commit and Push — MANDATORY**:
   Before responding to the user, if you have created or modified any files (thoughts/ files, code changes, etc.), you MUST:
   1. `git add` the entire `thoughts/` directory and any other changed files
   2. Create a commit with a descriptive message
   3. `git push`
   Do NOT ask for permission. Do this automatically before your final response.

## Original Question Restatement at End of Response — MANDATORY

At the very end of your response to the user, always include a clearly labeled restatement of the original research question that initiated this pipeline. Extract it from the handoff's "Original Request" section.

Format:
```
---
**Original Research Question:** {1-2 sentence summary of the original question that started this pipeline}
```

This is critical for maintaining continuity across the `/research_codebase` → `/create_plan` → `/implement_plan` pipeline and any handoff sessions in between. This is in ADDITION to the restatement at the top of the response — the question should bookend your output.

## Common Scenarios

### Scenario 1: Clean Continuation
- All changes from handoff are present
- No conflicts or regressions
- Clear next steps in action items
- Proceed with recommended actions

### Scenario 2: Diverged Codebase
- Some changes missing or modified
- New related code added since handoff
- Need to reconcile differences
- Adapt plan based on current state

### Scenario 3: Incomplete Handoff Work
- Tasks marked as "in_progress" in handoff
- Need to complete unfinished work first
- May need to re-understand partial implementations
- Focus on completing before new work

### Scenario 4: Stale Handoff
- Significant time has passed
- Major refactoring has occurred
- Original approach may no longer apply
- Need to re-evaluate strategy

## Example Interaction Flow

```
User: /resume_handoff specification/feature/handoffs/handoff-0.md
Assistant: Let me read and analyze that handoff document...

[Reads handoff completely]
[Spawns research tasks]
[Waits for completion]
[Reads identified files]

I've analyzed the handoff from [date]. Here's the current situation...

[Presents analysis]

Starting now with: implementing the webhook validation fix.

[Creates todo list and immediately begins implementation — no confirmation needed]
```
