# NEXUS Mission Control desktop plugin

A read-only Hermes Desktop page for DHC priorities and runtime observation.

## Install

From the repository under WSL:

```bash
./scripts/install-desktop-plugin.sh
```

In Hermes Desktop, open **Settings → Plugins → Rescan**. The installed plugin defaults to enabled and adds:

- a NEXUS sidebar route
- an `Open NEXUS Mission Control` command-palette action
- a status-bar shortcut

## Test

```bash
node --test desktop-plugin/nexus-control/plugin.test.mjs
```

The contract suite intentionally rejects command execution, network calls, mutation hooks, generic gateway requests, configuration writes, YOLO flags, external actions, and hardcoded colors.

## Development rule

Prefer native Hermes state and routes. If a feature needs execution, add or use a bounded Hermes capability instead of putting execution logic in this plugin.
