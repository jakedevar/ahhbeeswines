---
description: Create handoff document for transferring work to another session
---

# Create Handoff

You are an expert documentarian tasked with writing a handoff document to hand off your work to another agent in a new session. You will create a handoff document that is thorough, but also **concise**. The goal is to compact and summarize your context without losing any of the key details of what you're working on.


## Process
### 1. Filepath & Metadata
Use the following information to understand how to create your document:
    - create your file under `thoughts/shared/handoffs/ENG-XXXX/YYYY-MM-DD_HH-MM-SS_ENG-ZZZZ_description.md`, where:
        - YYYY-MM-DD is today's date
        - HH-MM-SS is the hours, minutes and seconds based on the current time, in 24-hour format (i.e. use `13:00` for `1:00 pm`)
        - ENG-XXXX is the ticket number (replace with `general` if no ticket)
        - ENG-ZZZZ is the ticket number (omit if no ticket)
        - description is a brief kebab-case description
    - Run the `scripts/spec_metadata.sh` script to generate all relevant metadata
    - Examples:
        - With ticket: `2025-01-08_13-55-22_ENG-2166_create-context-compaction.md`
        - Without ticket: `2025-01-08_13-55-22_create-context-compaction.md`

### 2. Handoff writing.
using the above conventions, write your document. use the defined filepath, and the following YAML frontmatter pattern. Use the metadata gathered in step 1, Structure the document with YAML frontmatter followed by content:

Use the following template structure:
```markdown
---
date: [Current date and time with timezone in ISO format]
researcher: [Researcher name from thoughts status]
git_commit: [Current commit hash]
branch: [Current branch name]
repository: [Repository name]
topic: "[Feature/Task Name] Implementation Strategy"
tags: [implementation, strategy, relevant-component-names]
status: complete
last_updated: [Current date in YYYY-MM-DD format]
last_updated_by: [Researcher name]
type: implementation_strategy
---

# Handoff: ENG-XXXX {very concise description}

## Original Request
> {The user's original question/request, quoted VERBATIM if possible, or summarized in 1-2 sentences if it's too long. This MUST be stated plainly so someone context-switching can immediately understand what's being worked on. Do NOT paraphrase if you can avoid it — exact wording is preferred.}

## Immediate Next Action
{ONE clear, imperative sentence describing exactly what the next agent should do first, with no ambiguity. E.g. "Implement the `foo()` function in `src/bar.rs:42`" or "Run the failing tests and fix the type error in `crates/flywheel/src/types.rs:88`". This field is read before anything else — make it actionable and specific.}

## Task(s)
{description of the task(s) that you were working on, along with the status of each (completed, work in progress, planned/discussed). If you are working on an implementation plan, make sure to call out which phase you are on. Make sure to reference the plan document and/or research document(s) you are working from that were provided to you at the beginning of the session, if applicable.}

## Critical References
{List any critical specification documents, architectural decisions, or design docs that must be followed. Include only 2-3 most important file paths. Leave blank if none.}

## Recent changes
{describe recent changes made to the codebase that you made in line:file syntax}

## Learnings
{describe important things that you learned - e.g. patterns, root causes of bugs, or other important pieces of information someone that is picking up your work after you should know. consider listing explicit file paths.}

## Artifacts
{ an exhaustive list of artifacts you produced or updated as filepaths and/or file:line references - e.g. paths to feature documents, implementation plans, etc that should be read in order to resume your work.}

## Action Items & Next Steps
{ a list of action items and next steps for the next agent to accomplish based on your tasks and their statuses}

## Other Notes
{ other notes, references, or useful information - e.g. where relevant sections of the codebase are, where relevant documents are, or other important things you leanrned that you want to pass on but that don't fall into the above categories}
```
---

### 3. Approve and Sync
Save the document.

Once the handoff document is written to `thoughts/shared/handoffs/`, the daemon automatically detects this Write and derives the next pipeline step (`/resume_handoff`). No special tags are needed — the file path IS the signal.

---
## Original Question Restatement — MANDATORY

At the very end of your response to the user, always include a clearly labeled restatement of the original research question that initiated this pipeline. Extract it from:
- The "Original Request" section of the handoff you just wrote
- The plan or research document you were working from
- The user's original input if nothing else is available

Format:
```
---
**Original Research Question:** {1-2 sentence summary of the original question that started this pipeline}
```

This is critical for maintaining continuity across the `/research_codebase` → `/create_plan` → `/implement_plan` pipeline and any handoff sessions in between.

## Commit and Push — MANDATORY

Before responding to the user, if you have created or modified any files (handoff documents, thoughts/ files, code changes, etc.), you MUST:
1. `git add` the entire `thoughts/` directory and any other changed files
2. Create a commit with a descriptive message
3. `git push`
Do NOT ask for permission. Do this automatically before your final response.

##.  Additional Notes & Instructions
- **more information, not less**. This is a guideline that defines the minimum of what a handoff should be. Always feel free to include more information if necessary.
- **be thorough and precise**. include both top-level objectives, and lower-level details as necessary.
- **avoid excessive code snippets**. While a brief snippet to describe some key change is important, avoid large code blocks or diffs; do not include one unless it's necessary (e.g. pertains to an error you're debugging). Prefer using `/path/to/file.ext:line` references that an agent can follow later when it's ready, e.g. `packages/dashboard/src/app/dashboard/page.tsx:12-24`
