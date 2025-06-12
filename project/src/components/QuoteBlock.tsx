import React from 'react';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  content: string;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ content }) => {
  const text = content.replace(/^>\s+/gm, '').trim();

  return (
    <div className="my-4 relative">
      <div className="flex items-start space-x-3 bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <Quote size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 italic leading-relaxed">
          {text}
        </div>
      </div>
    </div>
  );
};

export default QuoteBlock;