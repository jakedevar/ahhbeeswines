---
description: Implement technical plans from thoughts/shared/plans with verification
---

# Implement Plan

You are tasked with implementing an approved technical plan from `thoughts/shared/plans/`. These plans contain phases with specific changes and success criteria.

## Five-Expert Verification Framework

This application is built for a single user (IQ 150, ADHD, vim devotee). Quality over speed. Before committing any code, verify it through all five expert lenses:

1. **SWE** (Clean architecture): Is the code clean? No duplication? Correct abstraction boundaries? Single responsibility maintained?
2. **Tech Wizard** (Zero-waste correctness): Am I building on the right foundation? Will any of this code be thrown away when a later phase lands? If so, stop and reconsider the approach.
3. **UI/UX Power User** (Information density): Is the UI information-dense? Every action keyboard-reachable in 1-2 keystrokes? No unnecessary confirmations, hand-holding, or "are you sure?" dialogs?
4. **Cognitive Flow Engineer** (ADHD-aware design): Does this code protect flow state? Is latency acceptable — no polling where subscribe works, no spinners where instant feedback is possible? Is test coverage maintained during transitions — never create a gap that forces debugging by feel?
5. **Vim Language Designer** (Compositional grammar): Do all keybindings compose with vim grammar? `i` means insert mode, not "continue session." Actions follow verb-noun composability. Custom operators wait for motions. Command-mode (`:continue`, `:approve`) over normal-mode overloads.

**If any expert objects to the code being written, stop and resolve before proceeding.** The plan was designed with these experts in mind — if the code violates a lens, either the code or the plan needs adjustment.

Canonical reference: `five-experts.md`

## Getting Started

When given a plan path:
- Read the plan completely and check for any existing checkmarks (- [x])
- Read the original ticket and all files mentioned in the plan
- **Read files fully** - never use limit/offset parameters, you need complete context
- Think deeply about how the pieces fit together
- Create a todo list to track your progress
- Start implementing if you understand what needs to be done

If no plan path provided, ask for one.

## Implementation Philosophy

Plans are carefully designed, but reality can be messy. Your job is to:
- Follow the plan's intent while adapting to what you find
- Implement each phase fully before moving to the next
- Verify your work makes sense in the broader codebase context
- Update checkboxes in the plan as you complete sections

When things don't match the plan exactly, think about why and communicate clearly. The plan is your guide, but your judgment matters too.

If you encounter a mismatch:
- STOP and think deeply about why the plan can't be followed
- Present the issue clearly:
  ```
  Issue in Phase [N]:
  Expected: [what the plan says]
  Found: [actual situation]
  Why this matters: [explanation]

  How should I proceed?
  ```

## Verification Approach

After implementing a phase:
- Run the success criteria checks (usually `make check test` covers everything)
- Fix any issues before proceeding
- Update your progress in both the plan and your todos
- Check off completed items in the plan file itself using Edit
- **Pause for human verification**: After completing all phases of the plan, pause and inform the human That manual verification is required and list all the manual verifications steps needed seperated by phase. Use this format:
  ```
  Phase [N] Complete - Ready for Manual Verification

  Automated verification passed:
  - [List automated checks that passed]

  Please perform the manual verification steps listed in the plan:
  - [List manual verification items from the plan]

  Let me know when manual testing is complete so I can proceed to Phase [N+1].
  ```

If instructed to execute multiple phases consecutively, skip the pause until the last phase. Otherwise, assume you are just doing one phase.

do not check off items in the manual testing steps until confirmed by the user.


## If You Get Stuck

When something isn't working as expected:
- First, make sure you've read and understood all the relevant code
- Consider if the codebase has evolved since the plan was written
- Present the mismatch clearly and ask for guidance

Use sub-tasks sparingly - mainly for targeted debugging or exploring unfamiliar territory.

## Resuming Work

If the plan has existing checkmarks:
- Trust that completed work is done
- Pick up from the first unchecked item
- Verify previous work only if something seems off

Remember: You're implementing a solution, not just checking boxes. Keep the end goal in mind and maintain forward momentum.

## Original Question Restatement — MANDATORY

At the very end of your response to the user, always include a clearly labeled restatement of the original research question that initiated this pipeline. Extract it from:
- The "Overview" or "Research Question" section of the plan document
- Any linked research document under `thoughts/shared/research/`
- The "Original Request" section if resuming from a handoff

Format:
```
---
**Original Research Question:** {1-2 sentence summary of the original question that started this pipeline}
```

This is critical for maintaining continuity across the `/research_codebase` → `/create_plan` → `/implement_plan` pipeline and any handoff sessions in between.

## Commit and Push — MANDATORY

Before responding to the user, you MUST commit and push all changes (code changes, thoughts/ files, plan checkbox updates, etc.):
1. `git add` all changed files including the entire `thoughts/` directory
2. Create a commit with a descriptive message
3. `git push`
Do NOT ask for permission. Do this automatically before your final response. This is IN ADDITION to committing after each phase — the final response must also ensure everything is pushed.

## Final Response Format

When you complete all phases and the implementation is complete, merge-readiness is auto-derived when this session completes successfully (the daemon detects `/implement_plan` sessions and auto-enqueues to the merge queue).

IMPORTANT: create a commit after you finish each phase. Do not ask for permission before commiting, and only commit the work you've touched
