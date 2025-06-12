export const chatGPTAPI = async (query: string): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(
      `/api/chatgpt/?q=${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (response.status >= 500) {
        throw new Error('The ChatGPT service is temporarily unavailable. Please try again later.');
      } else if (response.status === 403) {
        throw new Error('Access denied. The API key may be invalid or expired.');
      } else {
        throw new Error(`API request failed with status ${response.status}. Please try again.`);
      }
    }
    
    const data = await response.json();
    
    // Extract the message from the JSON response
    if (data.success && data.result && data.result.message) {
      return data.result.message;
    } else {
      throw new Error('Invalid response format from ChatGPT API.');
    }
    
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to ChatGPT service. Please check your internet connection or try again later. The service may be temporarily unavailable.');
      } else if (error.message.includes('CORS')) {
        throw new Error('Connection blocked by browser security. The ChatGPT service may not be properly configured for web access.');
      } else {
        throw error; // Re-throw with the specific error message we set above
      }
    }
    
    throw new Error('An unexpected error occurred while connecting to ChatGPT. Please try again.');
  }
};