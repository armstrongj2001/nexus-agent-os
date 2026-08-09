# NEXUS architecture

## Product rule

NEXUS is a control plane, not an agent runtime.

The test for every feature is simple: if Hermes already owns the state or execution lifecycle, NEXUS observes or links to it instead of creating a competing implementation. External projects stay separate unless an explicit product decision adds an optional integration.

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

### External projects

Unified LLM Memory Layer and other services are outside the NEXUS product boundary. They retain their own repositories, runtimes, storage, and roadmaps. NEXUS has no default dependency on them.

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

## Independent Hermes MCP services

The Windows Hermes profile may run external MCP services such as `unified_memory`. Those services belong to Hermes configuration and remain independent of NEXUS.

The current NEXUS plugin does not call Unified Memory, query its database, display its status, or require it to function. A future integration must be explicitly approved, optional, read-only at first, and routed through supported Hermes interfaces.

## Next implementation slice

Add a handoff/event view sourced from real Hermes Kanban, session, and cron state. Do not create another task state machine. The first state model should be:

```text
prepared → dispatched → observed → verified | blocked
```

Each transition must carry evidence: Hermes session ID, tool result, artifact, or explicit human approval.
