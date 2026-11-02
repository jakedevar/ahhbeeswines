---
description: Research ticket and launch planning session
---

1. use SlashCommand() to call /ralph_research with the given ticket number
2. launch a new session with `claude launch --model opus --dangerously-skip-permissions --dangerously-skip-permissions-timeout 14m --title "plan ENG-XXXX" "/oneshot_plan ENG-XXXX"`
3. when finished commit the changes to main, and then push
