"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, ArrowRight, Wifi, AlertCircle } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { ActivityEvent } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

const EVENT_CONFIG = {
  message:  { icon: MessageSquare, color: "#8b5cf6", label: "Sent"     },
  response: { icon: Zap,           color: "#00d4ff", label: "Received" },
  switch:   { icon: ArrowRight,    color: "#f59e0b", label: "Switched" },
  connect:  { icon: Wifi,          color: "#10b981", label: "Connected"},
  error:    { icon: AlertCircle,   color: "#ef4444", label: "Error"    },
};

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <GlassPanel title="Activity" accent="#10b981" delay={0.2} titleRight={<span>{events.length} events</span>}>
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-1">
        <AnimatePresence initial={false}>
          {events.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-xs text-cyber-muted"
            >
              No activity yet
            </motion.div>
          )}
          {events.map((event) => {
            const cfg = EVENT_CONFIG[event.type] || EVENT_CONFIG.connect;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg group hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{ background: `${cfg.color}15` }}
                >
                  <Icon size={11} style={{ color: cfg.color }} />
                </div>
                <span className="flex-1 text-xs text-cyber-text truncate">{event.label}</span>
                <span className="text-[10px] text-cyber-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatRelative(event.timestamp)}
                </span>
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: cfg.color, opacity: 0.7 }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </GlassPanel>
  );
}
