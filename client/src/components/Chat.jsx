import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

const Chat = ({ messages, onSendMessage, onClose }) => {
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
    <div className="flex flex-col h-full bg-dark-bg text-white border-l border-white/5">
      {/* Chat Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h3 className="text-lg font-medium">In-call messages</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="mx-4 my-4 p-3 bg-white/5 rounded-lg text-xs text-white/40 leading-relaxed">
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
      <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center bg-black border border-white/20 rounded-full px-4 py-2 group focus-within:border-accent-purple focus-within:ring-1 focus-within:ring-accent-purple transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message to everyone"
            className="flex-1 bg-transparent outline-none text-sm py-1 text-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="ml-2 text-accent-purple disabled:text-white/20 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
