import React from 'react';
import { MessageSquare, Trash2, Search } from 'lucide-react';

interface ChatHeaderProps {
  messageCount: number;
  onClearChat: () => void;
  onToggleSearch: () => void;
  showSearch: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  messageCount, 
  onClearChat, 
  onToggleSearch, 
  showSearch 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">ChatGPT 4</h1>
            <p className="text-sm text-gray-500">
              {messageCount === 0 ? 'Start a conversation' : `${Math.floor(messageCount / 2)} messages`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSearch}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              showSearch 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Search messages"
          >
            <Search size={20} />
          </button>
          
          {messageCount > 0 && (
            <button
              onClick={onClearChat}
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
              title="Clear chat history"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;