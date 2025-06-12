import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';

function App() {
  const { messages, isLoading, error, sendMessage, clearChat, retryLastMessage } = useChat();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Filter messages based on search term
  const filteredMessages = searchTerm
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearChat();
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <ChatHeader
        messageCount={messages.length}
        onClearChat={handleClearChat}
        onToggleSearch={handleToggleSearch}
        showSearch={showSearch}
      />

      {/* Search Bar */}
      {showSearch && (
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClose={handleToggleSearch}
          resultCount={filteredMessages.length}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onStartChat={sendMessage} />
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">
            {filteredMessages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === filteredMessages.length - 1}
              />
            ))}
            
            {/* Typing Indicator */}
            {isLoading && <TypingIndicator />}
            
            {/* Error Message */}
            {error && (
              <ErrorMessage error={error} onRetry={retryLastMessage} />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        placeholder="Ask ChatGPT anything..."
      />
    </div>
  );
}

export default App;