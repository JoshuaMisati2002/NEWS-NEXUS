import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines, searchNews } from '../services/newsApiService';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  // State for the search functionality
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let news;
        if (searchQuery.trim() !== '') {
          // If there's a search query, search for it
          news = await searchNews(searchQuery);
        } else {
          // Otherwise, fetch top headlines by category
          news = await fetchTopHeadlines('us', activeCategory);
        }
        setArticles(news);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [activeCategory, searchQuery]); // Reruns the effect whenever the category or search query changes

  // Function to handle a category button click
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear the search query when a new category is selected
  };

  // Function to handle the search submission
  const handleSearchSubmit = () => {
    // The useEffect hook will automatically trigger the search when searchQuery changes
    // No need to do anything here
  };

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
        query={searchQuery}
        onSearchChange={setSearchQuery}
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
    </div>
  );
}

export default HomePage;
