import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';
import { chatGPTAPI } from '../utils/api';
import { saveMessages, loadMessages, clearMessages } from '../utils/storage';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = loadMessages();
    setState(prev => ({ ...prev, messages: savedMessages }));
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (state.messages.length > 0) {
      saveMessages(state.messages);
    }
  }, [state.messages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await chatGPTAPI(content.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }));
    }
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      error: null,
    }));
    clearMessages();
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...state.messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      // Remove any error messages and retry
      setState(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.role !== 'assistant' || msg.content !== prev.error),
        error: null,
      }));
      sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
    retryLastMessage,
  };
};