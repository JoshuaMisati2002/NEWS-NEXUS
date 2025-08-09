import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines, searchNews } from '../services/newsApiService';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  // This state holds the value of the search input field as the user types
  const [searchInput, setSearchInput] = useState('');
  // This state will only change when the user submits the search
  const [searchQuery, setSearchQuery] = useState('');
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 20; // Number of articles to fetch per page

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (searchQuery.trim() !== '') {
          // If there's a search query, search for it
          response = await searchNews(searchQuery, currentPage, pageSize);
        } else {
          // Otherwise, fetch top headlines by category
          response = await fetchTopHeadlines('us', activeCategory, currentPage, pageSize);
        }
        setArticles(response.articles);
        setTotalResults(response.totalResults);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [activeCategory, searchQuery, currentPage]); // Reruns when category, query, or page changes

  // Function to handle a category button click
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear the search query to show headlines
    setSearchInput(''); // Also clear the text in the search bar
    setCurrentPage(1); // Reset page to 1 when category changes
  };

  // Function to handle the search submission
  const handleSearchSubmit = () => {
    // Only update the searchQuery state when the user submits the search
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset page to 1 on a new search
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of page on change
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  if (isLoading) {
    return <div className="text-center mt-8 text-xl text-gray-700">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500 font-bold">Error: {error}</div>;
  }
  
  // Conditionally render the title based on the search query
  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : `Top ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Headlines`;

  return (
    <div className="container mx-auto p-4">
      <SearchBar
        query={searchInput} // Use searchInput for the input's value
        onSearchChange={setSearchInput} // Update searchInput on every keystroke
        onSearchSubmit={handleSearchSubmit}
      />
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600">{article.source.name}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">No articles found. Try a different search.</div>
        )}
      </div>

      {/* Render pagination only if there are articles */}
      {articles.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default HomePage;