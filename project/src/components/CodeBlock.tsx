import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Simple syntax highlighting for common languages
  const getLanguageColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'text-yellow-600',
      js: 'text-yellow-600',
      typescript: 'text-blue-600',
      ts: 'text-blue-600',
      python: 'text-green-600',
      py: 'text-green-600',
      html: 'text-orange-600',
      css: 'text-purple-600',
      json: 'text-gray-600',
      bash: 'text-gray-800',
      shell: 'text-gray-800',
      sql: 'text-indigo-600',
      java: 'text-red-600',
      cpp: 'text-blue-800',
      'c++': 'text-blue-800',
      c: 'text-blue-700',
      php: 'text-purple-700',
      ruby: 'text-red-500',
      go: 'text-cyan-600',
      rust: 'text-orange-700',
      swift: 'text-orange-500',
      kotlin: 'text-purple-500',
    };
    return colors[lang.toLowerCase()] || 'text-gray-600';
  };

  return (
    <div className="my-4 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className={`text-sm font-medium ${getLanguageColor(language)}`}>
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200 border border-gray-600 hover:border-gray-500"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-gray-100 font-mono whitespace-pre">
            {code}
          </code>
        </pre>
        
        {/* Line numbers for better readability */}
        <div className="absolute left-0 top-0 p-4 text-gray-500 text-sm font-mono leading-relaxed select-none pointer-events-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="text-right pr-4 min-w-[2rem]">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Adjust code content to account for line numbers */}
        <style jsx>{`
          pre code {
            padding-left: 3rem;
            display: block;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CodeBlock;