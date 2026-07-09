import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const Chat = ({ messages, onSendMessage, onClose }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="w-96 bg-white text-black h-[calc(100vh-80px-2rem)] my-4 mr-4 rounded-xl flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium">In-call messages</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          Messages can only be seen by people in the call and are deleted when the call ends.
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{msg.sender}</span>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm break-words mt-1">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Send a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 bg-blue-600 disabled:bg-gray-200 text-white rounded-full transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
