# NEXUS

NEXUS is DHC's mission-control layer over Hermes Agent.

It does not run a second agent loop. Hermes owns execution, tools, profiles, sessions, approvals, delegation, scheduling, and channels. NEXUS owns operational focus, observability, handoffs, and navigation into Hermes's native control surfaces.

Unified LLM Memory Layer is a separate project and is not a NEXUS component or dependency. Hermes may expose it globally through MCP, but the current NEXUS plugin does not call it, store its data, or display its state.

## Current build

The first working vertical slice is a native Hermes Desktop plugin:

- DHC mission priorities
- Live read-only Hermes runtime state
- Links to native Kanban, cron, capabilities, artifacts, and settings
- Command-palette and status-bar entry points
- Contract tests that reject command execution, configuration writes, network calls, YOLO flags, and external actions

Source:

```text
desktop-plugin/nexus-control/plugin.js
```

Install from WSL:

```bash
./scripts/install-desktop-plugin.sh
```

Then open **Settings → Plugins → Rescan** in Hermes Desktop. NEXUS appears in the left sidebar.

Verify the repository:

```bash
./scripts/verify.sh
```

## Architecture

```text
NEXUS mission-control UI
    ├── priorities, observed status, queues, approvals, handoffs
    └── native Hermes surfaces
            └── execution, sessions, profiles, tools, cron, Kanban
```

See [docs/architecture.md](docs/architecture.md) for ownership rules and [NEXUS_HANDOFF.md](NEXUS_HANDOFF.md) for the current development handoff.

## Legacy prototype

The original standalone Next.js Claude dashboard remains in this repository as a visual prototype. Its original README is preserved at [docs/legacy-prototype.md](docs/legacy-prototype.md). It is not the production architecture and should not gain another chat runtime, session store, model router, or memory database.

## Safety boundary

NEXUS may prepare and display consequential actions, but it does not autonomously:

- send messages
- publish or deploy
- purchase anything
- change credentials or permissions
- perform destructive work
- submit permit-portal actions

Those actions stay behind Hermes's native approvals and Jobi's explicit authorization.
