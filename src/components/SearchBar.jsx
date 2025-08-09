import React from 'react';

function SearchBar({ query, onSearchChange, onSearchSubmit }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search for news..."
        value={query}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg px-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <button
        onClick={onSearchSubmit}
        className="ml-2 px-6 py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;