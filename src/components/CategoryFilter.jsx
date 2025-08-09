import React from 'react';

// A simple array of available news categories
const categories = ['general', 'business', 'technology', 'entertainment', 'health', 'science', 'sports'];

function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap justify-center my-6 space-x-2 sm:space-x-4">
      {categories.map((category) => (
        <button
          key={category}
          // The base styles for the button
          className={`py-2 px-4 rounded-full transition-colors duration-300 mb-2
            ${activeCategory === category
              // Styles for the active (selected) category
              ? 'bg-blue-600 text-white shadow-lg'
              // Styles for inactive categories
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          onClick={() => onSelectCategory(category)}
        >
          {/* Capitalize the first letter for display */}
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;