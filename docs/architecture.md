# NEXUS architecture

## Product rule

NEXUS is a control plane, not an agent runtime.

The test for every feature is simple: if Hermes or the Unified Memory Layer already owns the state or execution lifecycle, NEXUS observes or links to it instead of creating a competing implementation.

## Ownership

### Hermes

Authoritative for:

- agent loop and tool execution
- sessions and profiles
- approvals and safety policy
- delegation and subagents
- cron and recurring execution
- Kanban execution lifecycle
- skills, plugins, and MCP administration
- channels and message delivery

### Unified LLM Memory Layer

Authoritative for:

- cross-tool transcript ingestion
- normalized project history
- retrieval and surrounding context
- citations
- project ledgers and context packs

It remains provider- and tool-independent. NEXUS does not copy its transcripts into a local vault.

### NEXUS

Authoritative for:

- DHC mission priorities
- project/workspace lifecycle UX
- observed operational status
- prepared → observed → verified handoffs
- approval queues that dispatch through Hermes
- audit and exception views
- navigation across native Hermes surfaces

## Guardrails

The desktop plugin is read-only by construction. Contract tests reject:

- subprocess execution
- direct network calls
- generic gateway requests
- configuration writes
- mutation hooks
- `--yolo` and `--accept-hooks`
- external URL launching
- hardcoded color values outside the Hermes theme

When NEXUS eventually needs a mutation, it must call a bounded Hermes capability with an explicit approval record. No generic `/run`, `/send`, `/publish`, `/deploy`, `/install`, or `/tunnel` endpoints.

## Unified Memory integration

Windows Hermes launches the WSL memory server as a native stdio MCP:

```text
wsl.exe -d Ubuntu-22.04 --cd /home/jobi/unified-llm-router/backend .venv/bin/python -m app.mcp_server
```

This keeps retrieval in Hermes's tool layer rather than teaching the NEXUS UI to query Postgres or duplicate MCP behavior.

The currently exposed tools are:

- `list_projects`
- `search_memory`
- `list_conversations`
- `read_conversation`
- `save_transcript`

## Next implementation slice

Add a handoff/event view sourced from real Hermes Kanban, session, and cron state. Do not create another task state machine. The first state model should be:

```text
prepared → dispatched → observed → verified | blocked
```

Each transition must carry evidence: Hermes session ID, tool result, artifact, or explicit human approval.
