import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

const Chat = ({ messages, onSendMessage, onClose, isMobile }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-dark-bg text-white",
      !isMobile && "border-l border-white/5"
    )}>
      {/* Chat Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          {isMobile && <MessageSquare className="w-5 h-5 text-accent-purple" />}
          <h3 className="text-lg font-medium">In-call messages</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="mx-4 my-4 p-4 bg-white/5 rounded-2xl text-xs text-white/40 leading-relaxed border border-white/5">
        Messages can only be seen by people in the call and are deleted when the call ends.
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-white/90">{msg.sender}</span>
              <span className="text-[10px] text-white/40">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm break-words leading-normal text-white/80">
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="relative flex items-center bg-dark-surface border border-white/10 rounded-2xl px-4 py-3 group focus-within:border-accent-purple focus-within:ring-1 focus-within:ring-accent-purple transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message"
            className="flex-1 bg-transparent outline-none text-[16px] py-1 text-white placeholder-white/20"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="ml-2 text-accent-purple disabled:text-white/10 transition-colors p-1"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
