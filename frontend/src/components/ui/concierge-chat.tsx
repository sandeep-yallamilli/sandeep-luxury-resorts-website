import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowDown } from "lucide-react";
import { apiClient } from "@/lib/api";
import Logo from "./logo";

interface Message {
  id: string;
  sender: "user" | "concierge";
  text: string;
  displayText?: string; // used for streaming animation
  timestamp: Date;
  isStreaming?: boolean;
}

export default function ConciergeChat({ inline = false }: { inline?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "concierge",
      text: "Welcome to Sandeep Luxury Resorts. I am your dedicated AI Concierge — trained across every Sandeep sanctuary worldwide.\n\nI can coordinate villa bookings, plan customized itineraries, arrange wellness journeys, or reserve dining experiences.\n\nHow may I serve you today?",
      timestamp: new Date(),
    },
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isStreaming]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 100);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if ((isOpen || inline) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, inline]);

  // Cleanup streaming interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // ─── Typewriter streaming effect ───
  const streamResponse = useCallback((fullText: string, msgId: string) => {
    setIsStreaming(true);
    let charIndex = 0;

    // Add message with empty displayText
    const streamMsg: Message = {
      id: msgId,
      sender: "concierge",
      text: fullText,
      displayText: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, streamMsg]);

    // Stream characters with variable speed for natural feel
    const baseSpeed = 18; // ms per character

    const streamNext = () => {
      charIndex++;
      const currentText = fullText.slice(0, charIndex);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, displayText: currentText, isStreaming: charIndex < fullText.length }
            : m
        )
      );

      if (charIndex >= fullText.length) {
        // Streaming complete
        setIsStreaming(false);
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
        // Finalize the message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? { ...m, displayText: undefined, isStreaming: false }
              : m
          )
        );
      }
    };

    // Use variable-speed interval for natural typing feel
    const runStream = () => {
      const char = fullText[charIndex] || "";
      // Pause longer on punctuation/newlines for a natural feel
      let delay = baseSpeed;
      if (char === "." || char === "!" || char === "?") delay = baseSpeed * 8;
      else if (char === ",") delay = baseSpeed * 4;
      else if (char === "\n") delay = baseSpeed * 6;
      else if (char === " ") delay = baseSpeed * 1.2;
      else delay = baseSpeed + Math.random() * 10;

      streamIntervalRef.current = setTimeout(() => {
        streamNext();
        if (charIndex < fullText.length) {
          runStream();
        }
      }, delay);
    };

    runStream();
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await apiClient.sendConciergeMessage(textToSend);
      setIsLoading(false);
      // Stream the response character by character
      streamResponse(data.response, crypto.randomUUID());
    } catch {
      setIsLoading(false);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        sender: "concierge",
        text: "I apologize, but I encountered a momentary connection disturbance. Please try again shortly or contact our 24/7 global guest relations center directly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };


  const QUICK_QUESTIONS = [
    { label: "🏝️ Tropical Escape", query: "Recommend a tropical jungle escape" },
    { label: "🏖️ Maldives Villas", query: "Tell me about the Maldives villa" },
    { label: "🧘 Wellness Programs", query: "What are the wellness programs?" },
    { label: "👑 VIP Membership", query: "Explain the VIP membership benefits" },
    { label: "🍽️ Private Dining", query: "What private dining experiences do you offer?" },
    { label: "✈️ Transfer Options", query: "What are the private transfer options?" },
  ];

  // ─── Floating FAB (closed state, non-inline only) ───
  if (!isOpen && !inline) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group cursor-pointer"
        aria-label="Open AI Concierge Chat"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
        <div className="relative p-3.5 sm:p-4 bg-gold hover:bg-gold/90 text-background rounded-full shadow-[0_12px_40px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center gap-2 border border-gold/50 hover:scale-105">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-40 transition-all duration-500 ease-in-out text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap">
            AI Concierge
          </span>
        </div>
      </button>
    );
  }

  // ─── Render Message Paragraphs (split by newlines) ───
  const renderMessageText = (text: string) => {
    const paragraphs = text.split("\n").filter((line) => line.trim() !== "");
    if (paragraphs.length <= 1) return <span>{text}</span>;
    return (
      <div className="space-y-2">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    );
  };

  const ChatLayout = (
    <div
      className={`flex flex-col text-foreground overflow-hidden ${inline
        ? "w-full h-125 sm:h-150 md:h-170 rounded-2xl border border-gold/20 bg-background shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
        : "fixed bottom-3 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:w-105 h-[82dvh] sm:h-150 rounded-2xl border border-gold/25 bg-background shadow-[0_32px_80px_rgba(0,0,0,0.4)] animate-fade-in-up"
        }`}
    >
      {/* ─── Chat Header ─── */}
      <div className="relative px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gold/10 bg-background flex items-center justify-between shrink-0">
        {/* Subtle top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center p-1">
              <Logo showText={false} iconClassName="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <h4 className="font-editorial text-sm sm:text-base text-foreground leading-tight">AI Concierge</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] sm:text-[10px] text-emerald-500/90 tracking-wider uppercase font-medium">
                {isStreaming ? "Typing..." : "Online — Ready to Serve"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!inline && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 sm:p-2 hover:bg-gold/10 rounded-lg transition-colors text-foreground/50 hover:text-gold"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── Message List ─── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 relative bg-linear-to-b from-background/80 to-background font-sans"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const displayContent = msg.displayText !== undefined ? msg.displayText : msg.text;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              {/* Concierge Avatar */}
              {!isUser && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mb-4">
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                </div>
              )}

              <div className={`max-w-[86%] sm:max-w-[80%] space-y-1 ${isUser ? "items-end" : "items-start"}`}>
                {/* Sender label */}
                <span className={`text-[9px] uppercase tracking-[0.15em] font-medium block px-1 ${isUser ? "text-right text-foreground/40" : "text-gold/70"
                  }`}>
                  {isUser ? "You" : "Concierge"}
                </span>

                {/* Bubble */}
                <div
                  className={`px-3.5 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-[13px] leading-relaxed font-sans ${isUser
                    ? "bg-linear-to-br from-gold via-gold/95 to-amber-600 text-background font-medium rounded-2xl rounded-br-sm shadow-lg"
                    : "bg-foreground/4 border border-gold/10 text-foreground/85 rounded-2xl rounded-bl-sm"
                    }`}
                >
                  {renderMessageText(displayContent)}
                  {/* Blinking cursor during streaming */}
                  {msg.isStreaming && (
                    <span className="inline-block w-0.5 h-4 bg-gold/80 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </div>

                {/* Timestamp */}
                <span className={`text-[9px] block px-1 ${isUser ? "text-right text-foreground/30" : "text-foreground/30"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center shrink-0 mb-4">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading indicator — shown while waiting for API response */}
        {isLoading && (
          <div className="flex items-end gap-2.5 justify-start animate-fade-in-up">
            <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-gold" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.15em] font-medium text-gold/70 block px-1">
                Concierge
              </span>
              <div className="px-5 py-4 rounded-2xl rounded-bl-sm bg-foreground/4 border border-gold/10 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gold/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 z-10 p-2 bg-background border border-gold/30 rounded-full shadow-lg hover:bg-gold/10 transition-all"
            aria-label="Scroll to latest"
          >
            <ArrowDown className="w-4 h-4 text-gold" />
          </button>
        )}
      </div>

      {/* ─── Quick Suggestions (shown only at start) ─── */}
      {messages.length === 1 && (
        <div className="px-4 py-3 border-t border-gold/8 shrink-0">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3 h-3 text-gold/60" />
            <span className="text-[9px] text-foreground/40 uppercase tracking-[0.2em] font-medium">
              Quick Actions
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.query}
                onClick={() => handleSend(q.query)}
                className="text-[11px] text-foreground/70 bg-foreground/4 hover:bg-gold/10 hover:text-gold hover:border-gold/40 border border-gold/10 rounded-full px-3.5 py-2 whitespace-nowrap transition-all duration-300 shrink-0 font-sans cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Input Form ─── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="px-4 py-3 border-t border-gold/10 bg-background flex gap-2.5 items-center shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about resorts, villas, wellness, dining..."
          className="flex-1 bg-foreground/3 border border-gold/12 rounded-xl px-4 py-3 text-[13px] text-foreground focus:outline-none focus:border-gold/50 focus:bg-foreground/5 placeholder:text-foreground/25 transition-all duration-300 font-sans"
          disabled={isLoading || isStreaming}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || isStreaming}
          className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${input.trim() && !isLoading && !isStreaming
            ? "bg-linear-to-br from-gold via-gold/95 to-amber-600 text-background hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] hover:scale-105 cursor-pointer"
            : "bg-gold/10 text-foreground/25 cursor-not-allowed"
            }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Bottom shimmer line */}
      <div className="h-px bg-linear-to-r from-transparent via-gold/20 to-transparent shrink-0" />
    </div>
  );

  return ChatLayout;
}
