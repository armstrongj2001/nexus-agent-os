# NEXUS agent instructions

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Mission

Build NEXUS as DHC's mission-control layer over Hermes Agent. Optimize for buying back Jobi's time at DHC, especially permitting and pricing workflows.

## Ownership boundaries

- Hermes owns execution, tools, sessions, profiles, approvals, delegation, cron, Kanban execution, skills, plugins, MCP, and channels.
- NEXUS owns priorities, observability, project/workspace UX, prepared/observed/verified handoffs, approval queues, and navigation into native Hermes surfaces.
- External projects—including Unified LLM Memory Layer—remain independent repositories and runtimes. NEXUS must not depend on or absorb them without an explicit product decision.

Do not add a second chat/session engine, model router, transcript store, generic command runner, MCP installer, or independent Kanban state machine.

## Current implementation

The production direction is the native desktop plugin at:

```text
desktop-plugin/nexus-control/plugin.js
```

The standalone Next.js dashboard is a retained visual prototype, not the runtime architecture.

## Verification

Run before committing:

```bash
./scripts/verify.sh
```

To refresh the Windows Hermes Desktop installation from WSL:

```bash
./scripts/install-desktop-plugin.sh
```

Then use **Settings → Plugins → Rescan** in Hermes Desktop.

## Safety

NEXUS may prepare and display consequential actions but must not autonomously send, publish, purchase, change credentials or permissions, perform destructive work, or submit permit-portal actions.

Keep secrets in `.env`; never commit them. Use supported Hermes interfaces rather than editing Hermes configuration files directly.

## Development priorities

1. Real Hermes state, not decorative status.
2. Prepared → dispatched → observed → verified or blocked handoffs with evidence.
3. Keep external projects optional and behind supported Hermes interfaces.
4. Small operational improvements that DHC actually uses.
5. Close the current slice before opening another subsystem.

See `NEXUS_HANDOFF.md` for current state and `docs/architecture.md` for the full ownership model.
