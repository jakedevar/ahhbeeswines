#!/usr/bin/env node
// PostToolUse hook: Checks context window usage from the sidecar temp file.
// When usage >= THRESHOLD%, returns a system message instructing Claude
// to execute /rotate_context for automatic context rotation.
//
// Depends on: statusline_context_sidecar.sh writing to /tmp/claude-context-pct

import fs from "fs";

const CONTEXT_FILE = "/tmp/claude-context-pct";
const THRESHOLD = 65;
const COOLDOWN_FILE = "/tmp/claude-context-rotation-triggered";
const COOLDOWN_MS = 300_000; // 5 minutes — prevent nested rotations
const ROTATION_IN_PROGRESS = "/tmp/claude-context-rotation-in-progress";

function readStdinJSON() {
  try {
    if (process.stdin.isTTY) return {};
    const s = fs.readFileSync(0, "utf8");
    return s.trim() ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

// Read hook input (required by protocol)
readStdinJSON();

// Guard against nested rotations — if rotation already in progress, skip
try {
  fs.statSync(ROTATION_IN_PROGRESS);
  // File exists = rotation already in progress, don't trigger another
  console.log(JSON.stringify({}));
  process.exit(0);
} catch {
  // No rotation in progress, continue
}

// Check cooldown — avoid spamming rotation triggers
try {
  const stat = fs.statSync(COOLDOWN_FILE);
  if (Date.now() - stat.mtimeMs < COOLDOWN_MS) {
    // Recently triggered, skip
    console.log(JSON.stringify({}));
    process.exit(0);
  }
} catch {
  // No cooldown file = never triggered, continue
}

// Read current context percentage
let pct = 0;
try {
  const raw = fs.readFileSync(CONTEXT_FILE, "utf8").trim();
  pct = parseInt(raw, 10);
  if (isNaN(pct)) pct = 0;
} catch {
  // File doesn't exist yet (status line hasn't run), skip
  console.log(JSON.stringify({}));
  process.exit(0);
}

if (pct >= THRESHOLD) {
  // Write cooldown marker
  fs.writeFileSync(COOLDOWN_FILE, String(Date.now()));

  // Write rotation-in-progress guard to prevent nested rotations
  fs.writeFileSync(ROTATION_IN_PROGRESS, String(Date.now()));

  console.log(JSON.stringify({
    systemMessage: [
      `⚠️ CONTEXT ROTATION REQUIRED — Context usage is at ${pct}% (threshold: ${THRESHOLD}%).`,
      "",
      "You MUST immediately execute /rotate_context to preserve your work state.",
      "This will: create a handoff → compact context → resume from handoff.",
      "Do NOT ask for confirmation. Do NOT skip this. Execute /rotate_context NOW.",
    ].join("\n"),
  }));
} else {
  console.log(JSON.stringify({}));
}

process.exit(0);
