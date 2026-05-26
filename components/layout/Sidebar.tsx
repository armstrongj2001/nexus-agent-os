"use client";
import { motion } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  Bot,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "agents",    icon: Bot,             label: "Agents"    },
  { id: "messages",  icon: MessageSquare,   label: "Messages"  },
  { id: "analytics", icon: BarChart3,       label: "Analytics" },
];

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <div
      className="glass relative z-10 flex flex-col items-center py-4 gap-2"
      style={{ width: 64, borderRight: "1px solid rgba(0,212,255,0.1)", borderLeft: "none", borderTop: "none", borderBottom: "none" }}
    >
      {/* Logo */}
      <motion.div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 cursor-pointer"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(0,212,255,0.3)" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 0 10px rgba(0,212,255,0.2)", "0 0 20px rgba(0,212,255,0.5)", "0 0 10px rgba(0,212,255,0.2)"] }}
        transition={{ boxShadow: { duration: 3, repeat: Infinity } }}
        onClick={() => onSelect("dashboard")}
      >
        <Brain size={20} className="text-cyber-cyan" />
      </motion.div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group",
                isActive
                  ? "bg-cyber-cyan/10 text-cyber-cyan"
                  : "text-cyber-muted hover:text-cyber-text hover:bg-white/5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl border border-cyber-cyan/30"
                  style={{ background: "rgba(0,212,255,0.08)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: "#00d4ff", boxShadow: "0 0 8px rgba(0,212,255,0.8)", left: -1 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none glass" style={{ background: "rgba(13,13,26,0.95)" }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom: status dot + settings */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <motion.div
          className="w-2 h-2 rounded-full bg-cyber-green"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          title="API Connected"
        />
        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center text-cyber-muted hover:text-cyber-text hover:bg-white/5 transition-all"
          whileHover={{ scale: 1.05, rotate: 45 }}
          whileTap={{ scale: 0.95 }}
          title="Settings"
        >
          <Settings size={18} />
        </motion.button>
        <motion.button
          className="w-10 h-10 rounded-xl flex items-center justify-center text-cyber-amber hover:bg-cyber-amber/10 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Power"
        >
          <Zap size={18} />
        </motion.button>
      </div>
    </div>
  );
}
