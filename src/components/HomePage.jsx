import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines } from '../services/newsApiService';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        const news = await fetchTopHeadlines('us', 'technology');
        setArticles(news);
      } catch (err) {
        console.error("Failed to fetch news:", err); // Log the full error for debugging
        setError("Failed to fetch news.");
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, []); // The empty array ensures this effect runs only once on component mount

  if (isLoading) {
    return <div className="text-center mt-8">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Technology Headlines</h1>
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