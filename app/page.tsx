'use client';

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-background shadow-lg">
      {/* Chat header */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-(--assistant-bubble-border) bg-(--chat-header)">
        <div className="w-9 h-9 rounded-full bg-(--user-bubble) flex items-center justify-center text-white text-sm font-medium">
          AI
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Assistant</h1>
          <p className="text-xs text-(--input-placeholder)">Ask me anything</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-(--input-placeholder)">
            <div className="w-14 h-14 rounded-full bg-(--assistant-bubble) border border-(--assistant-bubble-border) flex items-center justify-center mb-3 text-2xl">
              AI
            </div>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                message.role === 'user'
                  ? 'bg-(--user-bubble) text-(--user-bubble-text) rounded-br-md'
                  : 'bg-(--assistant-bubble) border border-(--assistant-bubble-border) text-foreground rounded-bl-md'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <span key={`${message.id}-${i}`}>{part.text}</span>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 p-4 border-t border-(--assistant-bubble-border) bg-(--chat-header)">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
          className="flex gap-2 items-center bg-(--input-bg) border border-(--input-border) rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-(--user-bubble) focus-within:ring-offset-2 focus-within:ring-offset-(--chat-header) transition-shadow"
        >
          <input
            className="flex-1 min-w-0 py-2.5 bg-transparent text-foreground placeholder-(--input-placeholder) text-sm outline-none"
            value={input}
            placeholder="Type your message..."
            onChange={e => setInput(e.currentTarget.value)}
          />
          <button
            type="submit"
            aria-label="Send"
            className="shrink-0 w-9 h-9 rounded-lg bg-(--user-bubble) text-(--user-bubble-text) flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}