# NEXUS handoff

## Resume

```bash
cd /home/jobi/claude/claude-os
git fetch origin
git switch feature/nexus-control-plane
git pull
./scripts/verify.sh
```

## Current architecture

- Hermes is the execution authority.
- NEXUS is a native, read-only mission-control UX over Hermes.
- Unified LLM Memory Layer is a separate project, not a NEXUS component or dependency.
- The standalone Next.js app is retained only as a visual prototype.

Do not add a second chat/session engine, model router, Kanban database, transcript vault, generic command runner, or publishing endpoint.

## Working artifact

Plugin source:

```text
desktop-plugin/nexus-control/plugin.js
```

Installed Windows path:

```text
C:\Users\jobid\AppData\Local\hermes\desktop-plugins\nexus-control\plugin.js
```

Install or refresh from WSL:

```bash
./scripts/install-desktop-plugin.sh
```

Then use **Settings → Plugins → Rescan** in Hermes Desktop.

## Verified behavior

- NEXUS appears in the Hermes sidebar.
- `/nexus` renders DHC priorities and native navigation links.
- Runtime status reads native Hermes gateway, profile, model, session, and workspace state.
- Plugin contract tests pass.
- Production Next.js build passes.
- Installed plugin matches repository source by SHA-256.

## Separate Unified Memory project

Windows Hermes independently has an enabled MCP named `unified_memory` that launches `/home/jobi/unified-llm-router`. That MCP belongs to the Hermes profile, not to this repository.

The current NEXUS plugin does not call Unified Memory, require its service, store its transcripts, or visualize its status. Any future NEXUS integration requires a separate product decision and must remain optional.

## Next slice

Build a real handoff/event view over existing Hermes state:

1. Read current Kanban, session, and cron state through supported Hermes interfaces.
2. Represent `prepared → dispatched → observed → verified | blocked`.
3. Attach evidence to every transition.
4. Keep consequential actions behind native Hermes approvals.
5. Add no independent task state machine.

## Hard safety boundary

Never autonomously send, publish, purchase, change credentials or permissions, perform destructive work, or submit permit-portal actions.
