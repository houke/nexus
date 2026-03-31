# AGENTS.md

**Nexus** is a multi-agent orchestration framework that coordinates specialized AI personas (architect, developer, QA, security, etc.) through structured workflows. It runs as a plugin in both **VS Code Copilot** and **GitHub Copilot CLI**.

If you encounter something surprising or confusing in this project, flag it as a comment.

## Environment Compatibility

Nexus agents run in **VS Code Copilot** and **Copilot CLI**. Each environment exposes different tool names for the same operations.

### Environment Detection

| Environment     | Indicator                                                  |
| --------------- | ---------------------------------------------------------- |
| VS Code Copilot | `runSubagent` tool is available                            |
| Copilot CLI     | `task` tool (with `nexus:*` custom agents) is available    |

Detect your environment at the start of any orchestration task and use the matching tool syntax throughout.

### Tool Mapping

| Purpose              | VS Code Copilot                               | Copilot CLI                                             |
| -------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Delegate to subagent | `runSubagent(agentName: "X", ...)`            | `task({ name: "X", agent_type: "nexus:X", ... })`       |
| Ask user a question  | `ask_questions({ questions: [{ ... }] })`     | `ask_user({ question: "...", choices: [...] })`          |

### Agent Name Mapping

| Agent Name         | Copilot CLI `agent_type`  |
| ------------------ | ------------------------- |
| architect          | `nexus:architect`         |
| software-developer | `nexus:software-developer`|
| tech-lead          | `nexus:tech-lead`         |
| qa-engineer        | `nexus:qa-engineer`       |
| product-manager    | `nexus:product-manager`   |
| business-analyst   | `nexus:business-analyst`  |
| ux-designer        | `nexus:ux-designer`       |
| visual-designer    | `nexus:visual-designer`   |
| security-agent     | `nexus:security`          |
| devops             | `nexus:devops`            |
| gamer              | `nexus:gamer`             |
| seo-specialist     | `nexus:seo-specialist`    |
