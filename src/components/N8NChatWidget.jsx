import React, { useEffect, useState } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * N8N Chat Widget — Floating AI assistant for SecureVault.
 * Connects to WF7 (AI Support Chatbot) via webhook.
 *
 * Usage: <N8NChatWidget webhookUrl="https://your-n8n.com/webhook/securevault/chat" />
 *
 * Falls back to VITE_N8N_CHAT_WEBHOOK env var if no prop is passed.
 */
const N8NChatWidget = ({ webhookUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm the **SecureVault Assistant** 🔐\n\nI can help with encryption, decryption, steganography, and security questions.\n\nHow can I assist you?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `sv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  const chatUrl = webhookUrl || import.meta.env.VITE_N8N_CHAT_WEBHOOK || '';

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      if (!chatUrl) {
        throw new Error('Chat webhook not configured');
      }

      const res = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: text, sessionId }),
      });

      const data = await res.json();
      const reply = data.output || data.response || "I couldn't process that. Please try again.";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Connection error. Please check your network and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const container = document.getElementById('sv-chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="sv-chat-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 24px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)',
            }}
            aria-label="Open chat assistant"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              width: '380px',
              maxHeight: '560px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.25)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.1)',
              background: '#0a0518',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={20} color="#fff" />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', letterSpacing: '0.02em' }}>
                    SecureVault Assistant
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
                    AI-powered security support
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              id="sv-chat-messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '300px',
                maxHeight: '400px',
                background: '#0a0518',
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'user'
                        ? 'none'
                        : '1px solid rgba(124,58,237,0.15)',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '14px 14px 14px 4px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(124,58,237,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#94a3b8',
                      fontSize: '13px',
                    }}
                  >
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Thinking...
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(124,58,237,0.15)',
                background: '#080314',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about encryption, security..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  border: 'none',
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
                    : 'rgba(255,255,255,0.05)',
                  color: input.trim() && !isLoading ? '#fff' : '#475569',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #sv-chat-messages::-webkit-scrollbar {
          width: 4px;
        }
        #sv-chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        #sv-chat-messages::-webkit-scrollbar-thumb {
          background: rgba(124,58,237,0.3);
          border-radius: 4px;
        }
        @media (max-width: 480px) {
          #sv-chat-toggle {
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default N8NChatWidget;
