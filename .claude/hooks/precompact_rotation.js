#!/usr/bin/env node
// PreCompact hook: Last-resort context rotation trigger.
// Fires when Claude Code is about to auto-compact (~95% usage).
// Injects a system message to run /rotate_context INSTEAD of
// the default lossy auto-compact, preserving structured knowledge.

import fs from "fs";

function readStdinJSON() {
  try {
    if (process.stdin.isTTY) return {};
    const s = fs.readFileSync(0, "utf8");
    return s.trim() ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

const data = readStdinJSON();
const trigger = data.trigger || "unknown";

// Only intercept auto-compaction. Manual /compact should proceed normally
// (it may be Step 2 of /rotate_context itself).
if (trigger === "auto") {
  console.log(JSON.stringify({
    systemMessage: [
      "⚠️ AUTO-COMPACT INTERCEPTED — Context is critically full.",
      "",
      "Before compaction proceeds, you MUST run /rotate_context to create a structured",
      "handoff document. The default auto-compact is lossy and will destroy structured",
      "knowledge. /rotate_context preserves it in a handoff document first.",
      "",
      "Execute /rotate_context NOW. The compaction in Step 2 will replace this auto-compact.",
    ].join("\n"),
  }));
} else {
  // Manual compact — let it through (likely Step 2 of rotation)
  console.log(JSON.stringify({}));
}

process.exit(0);
