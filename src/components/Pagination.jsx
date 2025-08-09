import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Define how many page buttons to show around the current page
  const pageRange = 2;
  const pageNumbers = [];

  // Logic to generate a sensible list of page numbers to display
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always include the first page
      i === totalPages || // Always include the last page
      (i >= currentPage - pageRange && i <= currentPage + pageRange)
    ) {
      pageNumbers.push(i);
    }
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center my-8 space-x-2">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
      >
        Previous
      </button>

      {/* Render page number buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-4 py-2 rounded-lg transition-colors duration-200
            ${currentPage === page
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;