---
description: Debug issues by investigating logs, database state, and git history
---

# Debug

You are tasked with helping debug issues during manual testing or implementation. This command allows you to investigate problems by examining logs, database state, and git history without editing files. Think of this as a way to bootstrap a debugging session without using the primary window's context.

## Initial Response

When invoked WITH a plan/ticket file:
```
I'll help debug issues with [file name]. Let me understand the current state.

What specific problem are you encountering?
- What were you trying to test/implement?
- What went wrong?
- Any error messages?

I'll investigate the logs, database, and git state to help figure out what's happening.
```

When invoked WITHOUT parameters:
```
I'll help debug your current issue.

Please describe what's going wrong:
- What are you working on?
- What specific problem occurred?
- When did it last work?

I can investigate logs, database state, and recent changes to help identify the issue.
```

## Environment Information

Flywheel keeps all runtime artifacts in `~/.flywheel/` by default. Confirm each path exists before digging in.

| Resource | Default Location | Notes |
| --- | --- | --- |
| Flywheeld logs | `~/.flywheel/logs/flywheeld-*.log` | Created by `cargo run --bin flywheeld` or `./scripts/dev-daemon.sh` |
| Flywheel TUI logs | `~/.flywheel/logs/flywheel-*.log` | Created by `cargo run --bin flywheel` or `./scripts/dev-tui.sh` |
| SQLite database | `~/.flywheel/flywheel.db` | Stores sessions, events, approvals, turn metrics |
| Unix socket | `~/.flywheel/daemon.sock` | JSON-RPC endpoint between TUI and daemon |
| Persisted state | `~/.flywheel/tui-state.json` | Long-lived TUI state |
| Dev-only state | `~/.flywheel/dev-state.json` | Cleared on reload; scroll positions, drafts |

Preflight checklist:
1. `ls ~/.flywheel` → ensure directory exists
2. `ls ~/.flywheel/daemon.sock` → verify daemon is running
3. `ls ~/.flywheel/flywheel.db` → confirm DB present
4. `ls ~/.flywheel/logs` → ensure logs are being written

If any file is missing, restart the daemon (`cargo run --bin flywheeld` or `./scripts/dev-daemon.sh`) and TUI (`cargo run --bin flywheel` or `./scripts/dev-tui.sh`).

## Process Steps

### Step 1: Understand the Problem

After the user describes the issue:

1. **Read any provided context** (plan or ticket file):
   - Understand what they're implementing/testing
   - Note which phase or step they're on
   - Identify expected vs actual behavior

2. **Quick state check**:
   - Current git branch and recent commits
   - Any uncommitted changes
   - When the issue started occurring

### Step 2: Investigate the Issue

Spawn parallel Task agents for efficient investigation:

```
Task 1 - Check Recent Logs:
Find and analyze the most recent logs for errors:
1. Find latest daemon log: ls -t ~/.flywheel/logs/flywheeld-*.log | head -1
2. Find latest TUI log: ls -t ~/.flywheel/logs/flywheel-*.log | head -1
3. Search for errors, warnings, or issues around the problem timeframe
4. Note the working directory (first line of log)
5. Look for stack traces or repeated errors
Return: Key errors/warnings with timestamps
```

```
Task 2 - Database State:
Check the current database state:
1. Connect to database: sqlite3 ~/.flywheel/flywheel.db
2. Check schema: .tables and .schema for relevant tables
3. Query recent data:
   - SELECT * FROM sessions ORDER BY created_at DESC LIMIT 5;
   - SELECT * FROM conversation_events WHERE created_at > datetime('now', '-1 hour');
   - Other queries based on the issue
4. Look for stuck states or anomalies
Return: Relevant database findings
```

```
Task 3 - Git and File State:
Understand what changed recently:
1. Check git status and current branch
2. Look at recent commits: git log --oneline -10
3. Check uncommitted changes: git diff
4. Verify expected files exist
5. Look for any file permission issues
Return: Git state and any file issues
```

### Step 3: Present Findings

Based on the investigation, present a focused debug report. Use the following template (fill in each section with concrete findings):

````markdown
## Debug Report

### What's Wrong
[Clear statement of the issue based on evidence]

### Evidence Found

**From Logs** (`~/.flywheel/logs/`):
- [Error/warning with timestamp]
- [Pattern or repeated issue]

**From Database**:
```sql
-- Relevant query and result
[Finding from database]
```

**From Git/Files**:
- [Recent changes that might be related]
- [File state issues]

### Root Cause
[Most likely explanation based on evidence]

### Next Steps

1. **Try This First**:
   ```bash
   [Specific command or action]
   ```

2. **If That Doesn't Work**:
   - Restart services: `cargo run --bin flywheeld` and `cargo run --bin flywheel`
   - Check for stale sockets in `~/.flywheel/`
   - Run with verbose logging: `RUST_LOG=debug cargo run --bin flywheeld`

### Can't Access?
Some issues might be outside my reach:
- Browser console errors (if applicable)
- MCP server internal state
- System-level issues

Would you like me to investigate something specific further?
````

## Important Notes

- **Focus on manual testing scenarios** - This is for debugging during implementation
- **Always require problem description** - Can't debug without knowing what's wrong
- **Read files completely** - No limit/offset when reading context
- **Think like `commit` or `describe_pr`** - Understand git state and changes
- **Guide back to user** - Some issues (browser console, MCP internals) are outside reach
- **No file editing** - Pure investigation only

## Quick Reference

**Find Latest Logs**:
```bash
ls -t ~/.flywheel/logs/flywheeld-*.log | head -1
ls -t ~/.flywheel/logs/flywheel-*.log | head -1
```

**Database Queries**:
```bash
sqlite3 ~/.flywheel/flywheel.db ".tables"
sqlite3 ~/.flywheel/flywheel.db ".schema sessions"
sqlite3 ~/.flywheel/flywheel.db "SELECT * FROM sessions ORDER BY created_at DESC LIMIT 5;"
```

**Service Check**:
```bash
ps aux | grep flywheeld     # Is daemon running?
ps aux | grep flywheel      # Is TUI running?
```

**Git State**:
```bash
git status
git log --oneline -10
git diff
```

Remember: This command helps you investigate without burning the primary window's context. Perfect for when you hit an issue during manual testing and need to dig into logs, database, or git state.
