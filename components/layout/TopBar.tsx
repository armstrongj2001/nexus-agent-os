"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Signal, Cpu, Clock, ChevronRight } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface TopBarProps {
  activeModel: string;
  messageCount: number;
}

export default function TopBar({ activeModel, messageCount }: TopBarProps) {
  const [time, setTime] = useState(new Date());
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
      setTick((t) => !t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="glass relative z-10 flex items-center px-5 gap-4 shrink-0"
      style={{ height: 56, borderBottom: "1px solid rgba(0,212,255,0.1)", borderTop: "none", borderLeft: "none", borderRight: "none" }}
    >
      {/* Logo / breadcrumb */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm font-bold tracking-widest gradient-text select-none">NEXUS</span>
        <ChevronRight size={14} className="text-cyber-muted" />
        <span className="text-sm text-cyber-muted font-medium">Command Center</span>
      </div>

      <div className="flex-1" />

      {/* Pills */}
      <StatusPill
        icon={<Signal size={12} />}
        label="API"
        value="Connected"
        color="#10b981"
        pulse
      />
      <StatusPill
        icon={<Cpu size={12} />}
        label="Model"
        value={activeModel.replace("claude-", "").replace("-4-6", " 4.6")}
        color="#00d4ff"
      />
      <StatusPill
        icon={null}
        label="Messages"
        value={String(messageCount)}
        color="#8b5cf6"
      />

      {/* Clock */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}
      >
        <Clock size={12} className="text-cyber-cyan" />
        <span
          className="text-xs font-mono text-cyber-text tabular-nums"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {formatTime(time)}
        </span>
      </div>

      {/* Scan accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)" }}
        animate={{ width: ["0%", "100%", "0%"], left: ["0%", "0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function StatusPill({
  icon, label, value, color, pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
      style={{ background: `${color}0d`, border: `1px solid ${color}30` }}
    >
      {pulse && (
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ opacity: [1, 0.4, 1], scale: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {icon && <span style={{ color }}>{icon}</span>}
      <span className="text-cyber-muted">{label}:</span>
      <span className="font-medium" style={{ color }}>{value}</span>
    </div>
  );
}
