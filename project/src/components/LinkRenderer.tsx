import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkRendererProps {
  url: string;
  isUser: boolean;
}

const LinkRenderer: React.FC<LinkRendererProps> = ({ url, isUser }) => {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md transition-colors duration-200 ${
        isUser
          ? 'text-blue-200 hover:text-white hover:bg-blue-400 hover:bg-opacity-30'
          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
      }`}
    >
      <span className="text-sm underline">{getDomain(url)}</span>
      <ExternalLink size={12} />
    </a>
  );
};

export default LinkRenderer;