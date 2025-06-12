import React from 'react';
import CodeBlock from './CodeBlock';
import ListRenderer from './ListRenderer';
import TableRenderer from './TableRenderer';
import QuoteBlock from './QuoteBlock';
import LinkRenderer from './LinkRenderer';

interface MessageRendererProps {
  content: string;
  isUser: boolean;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ content, isUser }) => {
  const parseContent = (text: string) => {
    const elements: JSX.Element[] = [];
    let currentIndex = 0;

    // Enhanced patterns for better code block detection
    const patterns = [
      // Code blocks with language (triple backticks)
      { regex: /```(\w+)?\s*\n?([\s\S]*?)```/g, type: 'codeblock' },
      // Single line code blocks
      { regex: /```([^`\n]+)```/g, type: 'inlinecodeblock' },
      // Tables
      { regex: /(\|.*\|[\r\n]+)+/g, type: 'table' },
      // Numbered lists (improved pattern)
      { regex: /(?:^|\n)(\d+\.\s+.+(?:\n\d+\.\s+.+)*)/gm, type: 'numberedlist' },
      // Bullet lists (improved pattern)
      { regex: /(?:^|\n)([-*+]\s+.+(?:\n[-*+]\s+.+)*)/gm, type: 'bulletlist' },
      // Block quotes
      { regex: /^>\s+.+(?:\n>\s+.+)*/gm, type: 'quote' },
      // Headers
      { regex: /^#{1,6}\s+.+$/gm, type: 'header' },
      // Bold text
      { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
      // Italic text
      { regex: /(?<!\*)\*([^*\n]+)\*(?!\*)/g, type: 'italic' },
      // Inline code (single backticks)
      { regex: /`([^`\n]+)`/g, type: 'inlinecode' },
      // URLs
      { regex: /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g, type: 'link' },
    ];

    // Find all matches and their positions
    const matches: Array<{
      match: RegExpMatchArray;
      type: string;
      start: number;
      end: number;
    }> = [];

    patterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match,
          type: pattern.type,
          start: match.index!,
          end: match.index! + match[0].length,
        });
      }
    });

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (prioritize longer matches)
    const filteredMatches = matches.filter((match, index) => {
      for (let i = 0; i < matches.length; i++) {
        if (i === index) continue;
        const otherMatch = matches[i];
        
        // Check for overlap
        if (match.start < otherMatch.end && match.end > otherMatch.start) {
          // Keep the longer match, or the first one if same length
          if (otherMatch.match[0].length > match.match[0].length || 
              (otherMatch.match[0].length === match.match[0].length && i < index)) {
            return false;
          }
        }
      }
      return true;
    });

    // Sort filtered matches by position again
    filteredMatches.sort((a, b) => a.start - b.start);

    filteredMatches.forEach((matchInfo, index) => {
      const { match, type, start, end } = matchInfo;

      // Add text before this match
      if (start > currentIndex) {
        const textBefore = text.slice(currentIndex, start);
        if (textBefore.trim()) {
          elements.push(
            <span key={`text-${index}-before`} className="whitespace-pre-wrap">
              {textBefore}
            </span>
          );
        }
      }

      // Add the matched element
      elements.push(renderElement(match, type, index, isUser));
      currentIndex = end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText.trim()) {
        elements.push(
          <span key="text-remaining" className="whitespace-pre-wrap">
            {remainingText}
          </span>
        );
      }
    }

    return elements.length > 0 ? elements : [
      <span key="default" className="whitespace-pre-wrap">{text}</span>
    ];
  };

  const renderElement = (match: RegExpMatchArray, type: string, index: number, isUser: boolean): JSX.Element => {
    switch (type) {
      case 'codeblock':
        const language = match[1] || 'text';
        const code = match[2] || match[0].replace(/```[\w]*\s*\n?/, '').replace(/```$/, '');
        return <CodeBlock key={`code-${index}`} code={code.trim()} language={language} />;

      case 'inlinecodeblock':
        // Handle single line code blocks without language
        const singleLineCode = match[1] || match[0].replace(/```/g, '');
        return <CodeBlock key={`code-${index}`} code={singleLineCode.trim()} language="text" />;

      case 'table':
        return <TableRenderer key={`table-${index}`} content={match[0]} />;

      case 'numberedlist':
        return <ListRenderer key={`numlist-${index}`} content={match[1] || match[0]} type="numbered" />;

      case 'bulletlist':
        return <ListRenderer key={`bulletlist-${index}`} content={match[1] || match[0]} type="bullet" />;

      case 'quote':
        return <QuoteBlock key={`quote-${index}`} content={match[0]} />;

      case 'header':
        const level = match[0].match(/^#+/)?.[0].length || 1;
        const headerText = match[0].replace(/^#+\s+/, '');
        const HeaderTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag
            key={`header-${index}`}
            className={`font-bold my-3 ${
              level === 1 ? 'text-2xl' : 
              level === 2 ? 'text-xl' : 
              level === 3 ? 'text-lg' : 
              level === 4 ? 'text-base' : 'text-sm'
            } ${isUser ? 'text-blue-100' : 'text-gray-800'}`}
          >
            {headerText}
          </HeaderTag>
        );

      case 'bold':
        return (
          <strong key={`bold-${index}`} className="font-bold">
            {match[1]}
          </strong>
        );

      case 'italic':
        return (
          <em key={`italic-${index}`} className="italic">
            {match[1]}
          </em>
        );

      case 'inlinecode':
        return (
          <code
            key={`inline-${index}`}
            className={`px-2 py-1 rounded-md text-sm font-mono ${
              isUser 
                ? 'bg-blue-400 bg-opacity-30 text-blue-100' 
                : 'bg-gray-800 text-green-400 border border-gray-700'
            }`}
          >
            {match[1]}
          </code>
        );

      case 'link':
        return <LinkRenderer key={`link-${index}`} url={match[0]} isUser={isUser} />;

      default:
        return <span key={`default-${index}`}>{match[0]}</span>;
    }
  };

  return (
    <div className="space-y-2">
      {parseContent(content)}
    </div>
  );
};

export default MessageRenderer;