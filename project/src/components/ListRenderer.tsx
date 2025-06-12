import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ListRendererProps {
  content: string;
  type: 'numbered' | 'bullet';
}

const ListRenderer: React.FC<ListRendererProps> = ({ content, type }) => {
  const items = content.split('\n').filter(line => line.trim());

  return (
    <div className="my-3">
      {type === 'numbered' ? (
        <ol className="space-y-1">
          {items.map((item, index) => {
            const text = item.replace(/^\d+\.\s+/, '');
            return (
              <li key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{text}</span>
              </li>
            );
          })}
        </ol>
      ) : (
        <ul className="space-y-1">
          {items.map((item, index) => {
            const text = item.replace(/^[-*+]\s+/, '');
            const isChecked = text.startsWith('[x]') || text.startsWith('[X]');
            const isUnchecked = text.startsWith('[ ]');
            const displayText = isChecked || isUnchecked ? text.slice(3).trim() : text;

            return (
              <li key={index} className="flex items-start space-x-2">
                {isChecked || isUnchecked ? (
                  isChecked ? (
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  )
                ) : (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                )}
                <span className={`text-sm leading-relaxed ${isChecked ? 'line-through text-gray-500' : ''}`}>
                  {displayText}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListRenderer;