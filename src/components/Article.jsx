import React from 'react';
import { useParams, Link } from 'react-router-dom';

function Article() {
  // useParams to get the article URL from the route
  
  const { url: encodedUrl } = useParams();
  const articleUrl = decodeURIComponent(encodedUrl);

  
  
  const title = "Article Details Page"; // This would be fetched dynamically
  
  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mt-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h1>
        <p className="text-gray-700 text-lg mb-6 text-center">
          For full article content, please visit the original source.
        </p>
        <div className="text-center">
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors"
          >
            Read Full Article at Source
          </a>
        </div>
        <div className="text-center mt-6">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Article;