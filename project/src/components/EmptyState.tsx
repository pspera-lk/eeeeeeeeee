import React from 'react';
import { MessageSquare, Sparkles, Zap, Globe } from 'lucide-react';

interface EmptyStateProps {
  onStartChat: (message: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onStartChat }) => {
  const suggestions = [
    {
      icon: <Sparkles className="text-purple-600" size={20} />,
      title: "Creative Writing",
      prompt: "Help me write a creative story about space exploration"
    },
    {
      icon: <Zap className="text-yellow-600" size={20} />,
      title: "Problem Solving",
      prompt: "Explain quantum computing in simple terms"
    },
    {
      icon: <Globe className="text-blue-600" size={20} />,
      title: "Learning",
      prompt: "Teach me about sustainable energy sources"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to ChatGPT 4
        </h2>
        
        <p className="text-lg text-gray-600 mb-8">
          Start a conversation with advanced AI. Ask questions, get creative help, or explore new topics.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onStartChat(suggestion.prompt)}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3 mb-2">
                {suggestion.icon}
                <span className="font-medium text-gray-900">{suggestion.title}</span>
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-800">
                {suggestion.prompt}
              </p>
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          <p>Tips: Use Shift + Enter for new lines, or simply press Enter to send</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;