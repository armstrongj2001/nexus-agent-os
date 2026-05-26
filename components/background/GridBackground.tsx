"use client";
import { motion } from "framer-motion";

export default function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base dark */}
      <div className="absolute inset-0" style={{ background: "#050508" }} />

      {/* Grid lines */}
      <div className="absolute inset-0 grid-bg" />

      {/* Radial glow center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Corner glows */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)" }}
        animate={{ y: ["-5vh", "105vh"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
      />

      {/* Floating orbs */}
      {[
        { x: "20%", y: "30%", color: "rgba(0,212,255,0.04)", size: 300 },
        { x: "75%", y: "60%", color: "rgba(139,92,246,0.04)", size: 250 },
        { x: "50%", y: "80%", color: "rgba(16,185,129,0.03)", size: 200 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(30px)",
            transform: "translate(-50%,-50%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
