import React, { useState, useRef, useEffect } from 'react';
import { Send, X, User } from 'lucide-react';

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
    <div className="flex flex-col h-full text-[#3c4043]">
      {/* Chat Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <h3 className="text-lg font-medium text-[#202124]">In-call messages</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#5f6368]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Info Box */}
      <div className="mx-4 my-4 p-3 bg-gray-50 rounded-lg text-xs text-[#5f6368] leading-relaxed">
        Messages can only be seen by people in the call and are deleted when the call ends.
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm text-[#202124]">{msg.sender}</span>
              <span className="text-[10px] text-[#5f6368]">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm break-words leading-normal text-[#3c4043]">
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 group focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message to everyone"
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="ml-2 text-blue-600 disabled:text-gray-300 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
