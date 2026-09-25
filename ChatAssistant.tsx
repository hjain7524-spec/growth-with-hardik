import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Send, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { trackGrowthAuditClick } from './analytics';

// Original Custom Abstract Growth Assistant Mascot Icon:
// A stylized isometric Growth Apex character with expressive twin digital eyes
// and a radiant primary red crown signal — 100% original agency creation.
export const AbstractGrowthMascot = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Body: Rounded Hexagonal Growth Prism */}
    <rect x="6" y="8" width="28" height="26" rx="8" fill="#0B0B0B" />
    
    {/* Upper Apex Primary Red Signal Accent */}
    <path
      d="M20 3L23.5 7.5H16.5L20 3Z"
      fill="#E50914"
    />
    
    {/* Inner Digital Face Screen */}
    <rect x="9" y="11" width="22" height="15" rx="5" fill="#18181B" />
    
    {/* Left Digital Eye */}
    <rect x="13.5" y="16" width="3" height="5" rx="1.5" fill="#E50914" />
    
    {/* Right Digital Eye */}
    <rect x="23.5" y="16" width="3" height="5" rx="1.5" fill="#E50914" />
    
    {/* Cheerful Growth Upward Arch */}
    <path
      d="M17 22.5C18.5 23.5 21.5 23.5 23 22.5"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Subtle Energy Sparkle at Corner */}
    <circle cx="31" cy="9" r="2.5" fill="#E50914" />
  </svg>
);

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  actionText?: string;
  actionType?: 'audit' | 'pricing';
}

const PRESET_RESPONSES: Record<string, { answer: string; actionText?: string; actionType?: 'audit' | 'pricing' }> = {
  'Which plan should I choose?': {
    answer: "If you're establishing consistency, Creator Launch is ideal. If you want aggressive reach and inbound client deals, Growth System is our recommended plan!",
    actionText: "Compare Growth Plans",
    actionType: "pricing"
  },
  'How fast do I get results?': {
    answer: "Most creators see accelerated reach and watch time within the first 30 to 60 days once the storytelling and profile conversion system are in place.",
    actionText: "Request Free Audit",
    actionType: "audit"
  },
  'What is in a growth audit?': {
    answer: "We analyze your profile conversion funnel, your hook retention drop-offs, and deliver a personalized 30-day growth roadmap.",
    actionText: "Get My Free Audit",
    actionType: "audit"
  },
  'Do you edit my videos?': {
    answer: "Yes! In both Growth System and Scale plans, our team handles professional editing, sound design, hooks, and thumbnail strategy.",
    actionText: "View How We Work",
    actionType: "pricing"
  }
};

interface ChatAssistantProps {
  onRequestAudit?: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onRequestAudit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hey there! 👋 I'm your Growth Assistant. Want to see which content plan or growth roadmap fits your goals?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendPrompt = (question: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: question
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const match = PRESET_RESPONSES[question];
      const botResponse: ChatMessage = match
        ? {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: match.answer,
            actionText: match.actionText,
            actionType: match.actionType
          }
        : {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: "Great question! Every creator's roadmap is custom-tailored. Let's do a quick free audit of your profile so we can give you exact metrics.",
            actionText: "Start Free Growth Audit",
            actionType: "audit"
          };

      setMessages(prev => [...prev, botResponse]);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const query = inputValue.trim();
    setInputValue('');
    handleSendPrompt(query);
  };

  const handleActionClick = (type?: 'audit' | 'pricing') => {
    if (type === 'pricing') {
      const el = document.getElementById('pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
        return;
      }
    }
    
    // Default to audit
    trackGrowthAuditClick('chat_assistant', 'Audit Request');
    if (onRequestAudit) {
      onRequestAudit();
    } else {
      window.dispatchEvent(new CustomEvent('open_growth_audit_modal'));
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      <AnimatePresence>
        {isOpen ? (
          /* EXPANDED CHAT CARD: White/Off-white, rounded corners, subtle border, small shadow */
          <motion.div
            key="chat-card"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-32px)] sm:w-[350px] max-w-[360px] bg-[#FAFAFA] border border-black/[0.08] rounded-2xl shadow-xl shadow-black/10 overflow-hidden flex flex-col max-h-[480px]"
          >
            {/* Header: Small green online indicator, "Ask GrowthWithHardik", Minimize button */}
            <div className="bg-white px-4 py-3.5 border-b border-black/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <AbstractGrowthMascot className="w-8 h-8 shrink-0" />
                  {/* Small Green Online Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                    Ask GrowthWithHardik
                  </h3>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • AI Growth Guide
                  </p>
                </div>
              </div>

              {/* Minimize button on top-right */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-zinc-100 active:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Minimize Chat Assistant"
              >
                <Minus className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Chat Body & Messages */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] overscroll-contain">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-black text-white rounded-br-xs'
                        : 'bg-white text-zinc-800 border border-zinc-200/80 shadow-xs rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.actionText && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.actionType)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#E50914] hover:underline cursor-pointer"
                      >
                        <span>{msg.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-2 bg-white/70 border-t border-black/[0.04] flex flex-wrap gap-1.5">
              {['Which plan should I choose?', 'How fast do I get results?', 'What is in a growth audit?'].map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendPrompt(prompt)}
                  className="text-[11px] bg-white hover:bg-zinc-100 text-zinc-700 font-medium px-2.5 py-1 rounded-full border border-zinc-200 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleCustomSubmit} className="p-2.5 bg-white border-t border-black/[0.06] flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about strategy, plans, or reach..."
                className="flex-1 bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 text-xs sm:text-[13px] px-3 py-2 rounded-xl border border-transparent focus:border-[#E50914] focus:outline-none transition-all placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-xl bg-black hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-all cursor-pointer"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        ) : (
          /* MINIMIZED FLOATING BADGE: White/Off-white, rounded corners, subtle border, small shadow */
          <motion.button
            key="chat-badge"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 bg-white hover:bg-[#FAFAFA] text-zinc-900 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full border border-black/[0.08] shadow-lg shadow-black/10 transition-all duration-200 cursor-pointer touch-manipulation"
            aria-label="Open Ask GrowthWithHardik chat assistant"
          >
            <div className="relative">
              <AbstractGrowthMascot className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
              {/* Green online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900">
              Ask GrowthWithHardik
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
