import React from 'react';

interface TableRendererProps {
  content: string;
}

const TableRenderer: React.FC<TableRendererProps> = ({ content }) => {
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  if (lines.length < 2) return <span>{content}</span>;

  const parseRow = (row: string) => {
    return row.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
  };

  const headers = parseRow(lines[0]);
  const separatorLine = lines[1];
  const dataRows = lines.slice(2).map(parseRow);

  // Check if it's a valid table
  if (!separatorLine.includes('-')) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRenderer;