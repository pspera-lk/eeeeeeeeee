import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClose: () => void;
  resultCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onClose, 
  resultCount 
}) => {
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 animate-slideDown">
      <div className="flex items-center space-x-3">
        <Search size={20} className="text-blue-600" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search messages..."
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
          autoFocus
        />
        {searchTerm && (
          <span className="text-sm text-blue-600">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        )}
        <button
          onClick={onClose}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;