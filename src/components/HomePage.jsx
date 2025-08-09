import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines } from '../services/newsApiService';
import CategoryFilter from './CategoryFilter';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to track the active news category. Default is 'general'.
  const [activeCategory, setActiveCategory] = useState('general');

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        // Pass the active category to the API call
        const news = await fetchTopHeadlines('us', activeCategory);
        setArticles(news);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news.");
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [activeCategory]); // Reruns the effect whenever the category changes

  // Function to handle a category button click
  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  if (isLoading) {
    return <div className="text-center mt-8 text-xl text-gray-700">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500 font-bold">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Pass the state and the handler to the CategoryFilter component */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Headlines
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-600">{article.source.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
