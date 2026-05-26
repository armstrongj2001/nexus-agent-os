"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleRight?: React.ReactNode;
  accent?: string;
  animate?: boolean;
  delay?: number;
}

export default function GlassPanel({
  children,
  className,
  title,
  titleRight,
  accent = "#00d4ff",
  animate = true,
  delay = 0,
}: GlassPanelProps) {
  const Wrapper = animate ? motion.div : "div";
  const motionProps = animate
    ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] } }
    : {};

  return (
    <Wrapper
      className={cn("glass rounded-2xl overflow-hidden flex flex-col", className)}
      {...(motionProps as object)}
    >
      {title && (
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-4 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: accent }}>
              {title}
            </span>
          </div>
          {titleRight && <div className="text-xs text-cyber-muted">{titleRight}</div>}
        </div>
      )}
      {children}
    </Wrapper>
  );
}
