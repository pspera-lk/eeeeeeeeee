import React, { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import { Message } from '../types/chat';
import MessageRenderer from './MessageRenderer';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  showTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest = false, showTyping = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[90%] gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
            : 'bg-gradient-to-r from-green-500 to-teal-600'
        }`}>
          {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
        </div>

        {/* Message Content */}
        <div className={`relative group ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        } rounded-2xl px-4 py-3 shadow-lg max-w-full overflow-hidden`}>
          
          {/* Message Text - Now displays instantly */}
          <div className="text-sm leading-relaxed break-words">
            <MessageRenderer content={message.content} isUser={isUser} />
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-3 ${
            isUser ? 'text-blue-200' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Copy Button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-md"
              title="Copy message"
            >
              {copied ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className="text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;