"use client";
import { motion } from "framer-motion";
import { Brain, Code2, BarChart3, Sparkles, Plus, Zap } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { Agent } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  brain: Brain,
  code: Code2,
  chart: BarChart3,
  sparkles: Sparkles,
};

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  idle:   "#f59e0b",
  offline:"#ef4444",
};

interface AgentGridProps {
  agents: Agent[];
  activeId: string;
  onSelect: (agent: Agent) => void;
}

export default function AgentGrid({ agents, activeId, onSelect }: AgentGridProps) {
  return (
    <GlassPanel title="Agents" accent="#8b5cf6" delay={0.1}>
      <div className="p-3 grid grid-cols-2 gap-2">
        {agents.map((agent, i) => {
          const Icon = ICONS[agent.icon] || Sparkles;
          const isActive = agent.id === activeId;
          return (
            <motion.button
              key={agent.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(agent)}
              className={cn(
                "relative flex flex-col gap-2 p-3 rounded-xl text-left transition-all duration-200 glass-hover",
                isActive ? "border-glow" : ""
              )}
              style={{
                background: isActive ? `${agent.color}0d` : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? agent.color + "50" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {/* Active indicator strip */}
              {isActive && (
                <motion.div
                  layoutId="agent-active"
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)` }}
                />
              )}

              {/* Icon + status */}
              <div className="flex items-start justify-between">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}30` }}
                >
                  <Icon size={16} style={{ color: agent.color }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: STATUS_COLORS[agent.status] || "#475569" }}
                    animate={agent.status === "active" ? { opacity: [1, 0.4, 1], scale: [1, 0.8, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px]" style={{ color: STATUS_COLORS[agent.status] }}>
                    {agent.status}
                  </span>
                </div>
              </div>

              {/* Name + desc */}
              <div>
                <p className="text-xs font-semibold text-cyber-text leading-tight">{agent.name}</p>
                <p className="text-[10px] text-cyber-muted leading-snug mt-0.5 truncate">{agent.description}</p>
              </div>

              {/* Active chip */}
              {isActive && (
                <div
                  className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded w-fit"
                  style={{ background: `${agent.color}20`, color: agent.color }}
                >
                  <Zap size={9} />
                  Active
                </div>
              )}
            </motion.button>
          );
        })}

        {/* Add agent button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 group"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <Plus size={16} className="text-cyber-muted group-hover:text-cyber-text" />
          </div>
          <span className="text-[10px] text-cyber-muted group-hover:text-cyber-text transition-colors">New Agent</span>
        </motion.button>
      </div>
    </GlassPanel>
  );
}
