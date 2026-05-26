"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import GridBackground from "@/components/background/GridBackground";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ChatPanel from "@/components/dashboard/ChatPanel";
import AgentGrid from "@/components/dashboard/AgentGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Agent, ActivityEvent } from "@/lib/types";
import { defaultAgents } from "@/lib/agents";
import { generateId } from "@/lib/utils";

export default function Dashboard() {
  const [nav, setNav] = useState("dashboard");
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [activeAgent, setActiveAgent] = useState<Agent>(defaultAgents[0]);
  const [events, setEvents] = useState<ActivityEvent[]>([
    { id: generateId(), type: "connect", label: "System online — API connected", timestamp: new Date() },
  ]);
  const [totalMessages, setTotalMessages] = useState(0);

  const addActivity = useCallback(
    (label: string, type: ActivityEvent["type"] = "connect") => {
      setEvents((prev) => [
        ...prev.slice(-99),
        { id: generateId(), type, label, timestamp: new Date() },
      ]);
      if (type === "message") setTotalMessages((n) => n + 1);
    },
    []
  );

  const selectAgent = (agent: Agent) => {
    setActiveAgent(agent);
    setAgents((prev) =>
      prev.map((a) => ({ ...a, status: a.id === agent.id ? "active" : "idle" }))
    );
    addActivity(`Switched to ${agent.name}`, "switch");
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <GridBackground />

      {/* Sidebar */}
      <Sidebar active={nav} onSelect={setNav} />

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <TopBar activeModel={activeAgent.model} messageCount={totalMessages} />

        {/* Content */}
        <div className="flex-1 overflow-hidden p-3 gap-3 flex">
          {/* Left: Chat (main) */}
          <motion.div
            className="flex-1 min-w-0 min-h-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <ChatPanel
              key={activeAgent.id}
              agent={activeAgent}
              onActivity={addActivity}
            />
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-3" style={{ width: 320 }}>
            <div className="flex-none" style={{ height: 280 }}>
              <AgentGrid agents={agents} activeId={activeAgent.id} onSelect={selectAgent} />
            </div>
            <div className="flex-1 min-h-0">
              <ActivityFeed events={events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
