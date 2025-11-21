import React, { useState, useEffect } from 'react';
import { ChatBotAPI } from '../services/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ChatBotAPI.chatbotItem({}, input);

      const botMessage = { sender: 'bot', text: response.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const inputField = document.getElementById('chat-input');
    if (inputField) {
      inputField.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (inputField) {
        inputField.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-[1000px] max-w-full bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-200 mb-4">NourishBot</h1>
        <div className="h-[600px] overflow-y-auto border border-slate-700 rounded-lg p-4 mb-4 bg-slate-900/40">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-green-500/20 text-green-300'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-slate-400">NourishBot is typing...</div>}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-700/60 border border-slate-600 rounded-lg p-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;