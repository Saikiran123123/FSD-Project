import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../services';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Hi! I'm **CineBot**, your intelligent cinema concierge. How can I help with your movie plans today?",
      quickReplies: ['Now Showing Movies', 'Active Offers', 'Smart Seat Pick', 'How to Book'],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenCinebot = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        handleSend(e.detail.prompt);
      }
    };
    window.addEventListener('open-cinebot', handleOpenCinebot);
    return () => window.removeEventListener('open-cinebot', handleOpenCinebot);
  }, []);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotService.sendMessage(textToSend);
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.reply,
            quickReplies: res.quickReplies || [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "🎬 You can browse blockbuster movies, reserve your preferred seats with instant atomic lock, and claim exclusive discounts!",
          quickReplies: ['Now Showing Movies', 'Active Offers'],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[390px] h-[520px] bg-[#0c0d16]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#e50914] to-[#990000] text-white flex items-center justify-between shadow-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-sm font-bold shadow-inner">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  CineBot Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-white/80">Intelligent Cinema Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-xs text-white cursor-pointer transition-colors"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#e50914] text-white rounded-br-none shadow-lg'
                      : 'bg-white/[0.06] text-zinc-200 border border-white/10 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1 font-mono">{msg.time}</span>

                {/* Quick Reply Chips */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qr)}
                        className="bg-white/5 hover:bg-[#e50914]/20 border border-white/10 hover:border-[#e50914]/40 text-[#ffb703] hover:text-white px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs py-2">
                <span className="w-2 h-2 bg-[#e50914] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#e50914] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-[#e50914] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-white/10 bg-[#090a12] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about movies, seats, offers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-cinema w-9 h-9 p-0 rounded-xl text-xs font-bold disabled:opacity-40"
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* 58px Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[58px] h-[58px] rounded-full bg-gradient-to-tr from-[#e50914] to-[#b80610] border border-white/20 flex items-center justify-center text-white text-xl shadow-[0_10px_30px_rgba(229,9,20,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
        title="Open CineBot AI Assistant"
        aria-label="Open CineBot AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default ChatBot;
