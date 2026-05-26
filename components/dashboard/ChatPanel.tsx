"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Sparkles, Copy, Check, Trash2 } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { Agent, Message } from "@/lib/types";
import { generateId, formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  agent: Agent;
  onActivity: (label: string, type?: "message" | "response" | "error") => void;
}

export default function ChatPanel({ agent, onActivity }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
      agentId: agent.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);
    setStreamingContent("");
    onActivity(`Sent to ${agent.name}`, "message");

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: agent.systemPrompt,
          model: agent.model,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingContent(full);
      }

      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: full,
        timestamp: new Date(),
        agentId: agent.id,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onActivity(`${agent.name} responded`, "response");
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        onActivity("Error receiving response", "error");
      }
    } finally {
      setStreaming(false);
      setStreamingContent("");
      abortRef.current = null;
    }
  }, [input, streaming, messages, agent, onActivity]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (streaming) abortRef.current?.abort();
    setMessages([]);
    setStreamingContent("");
    setStreaming(false);
  };

  return (
    <GlassPanel
      title={agent.name}
      accent={agent.color}
      className="h-full"
      titleRight={
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: agent.color }}>
            {agent.model.replace("claude-", "").replace("-4-6", " 4.6")}
          </span>
          <button
            onClick={clearChat}
            className="p-1 rounded hover:bg-white/10 transition-colors text-cyber-muted hover:text-cyber-red"
            title="Clear chat"
          >
            <Trash2 size={12} />
          </button>
        </div>
      }
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.length === 0 && !streaming && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 10px ${agent.color}20`, `0 0 25px ${agent.color}40`, `0 0 10px ${agent.color}20`] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles size={28} style={{ color: agent.color }} />
              </motion.div>
              <p className="text-cyber-muted text-sm">{agent.description}</p>
              <p className="text-cyber-muted/60 text-xs mt-1">Press Enter to send · Shift+Enter for newline</p>
            </motion.div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              agentColor={agent.color}
              copied={copiedId === msg.id}
              onCopy={() => copyMessage(msg.id, msg.content)}
            />
          ))}

          {/* Streaming bubble */}
          {streaming && (
            <motion.div
              key="streaming"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-start"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}40` }}
              >
                <Sparkles size={14} style={{ color: agent.color }} />
              </div>
              <div
                className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-cyber-text"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {streamingContent ? (
                  <span>
                    {streamingContent}
                    <span className="animate-blink ml-0.5" style={{ color: agent.color }}>▋</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2 text-cyber-muted">
                    <Loader2 size={14} className="animate-spin" style={{ color: agent.color }} />
                    <span>Thinking…</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 shrink-0"
        style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}
      >
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-3 transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${input ? `${agent.color}40` : "rgba(255,255,255,0.06)"}` }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agent.name}…`}
            rows={1}
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-cyber-text placeholder:text-cyber-muted resize-none outline-none min-h-[22px] max-h-32"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          />
          <motion.button
            onClick={send}
            disabled={!input.trim() || streaming}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0",
              input.trim() && !streaming
                ? "text-cyber-bg cursor-pointer"
                : "text-cyber-muted cursor-not-allowed opacity-50"
            )}
            style={input.trim() && !streaming ? { background: agent.color, boxShadow: `0 0 16px ${agent.color}60` } : { background: "rgba(255,255,255,0.06)" }}
            whileHover={input.trim() && !streaming ? { scale: 1.1 } : {}}
            whileTap={input.trim() && !streaming ? { scale: 0.9 } : {}}
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </GlassPanel>
  );
}

function ChatMessage({
  msg,
  agentColor,
  copied,
  onCopy,
}: {
  msg: Message;
  agentColor: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3 items-start group", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={
          isUser
            ? { background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }
            : { background: `${agentColor}20`, border: `1px solid ${agentColor}40` }
        }
      >
        {isUser ? (
          <User size={13} className="text-cyber-purple" />
        ) : (
          <Sparkles size={13} style={{ color: agentColor }} />
        )}
      </div>

      {/* Bubble */}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start", "max-w-[85%]")}>
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-cyber-text relative"
          style={
            isUser
              ? { background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderTopRightRadius: "4px" }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderTopLeftRadius: "4px" }
          }
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>
          {/* Copy button */}
          <button
            onClick={onCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
            title="Copy"
          >
            {copied ? <Check size={11} className="text-cyber-green" /> : <Copy size={11} className="text-cyber-muted" />}
          </button>
        </div>
        <span className="text-[10px] text-cyber-muted px-1">
          {formatRelative(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
