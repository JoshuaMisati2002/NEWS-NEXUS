import React, { useState, useEffect } from 'react';
import { fetchTopHeadlines, searchNews } from '../services/newsApiService';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function HomePage({ showToast }) {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 20;
  const [favoriteArticleIds, setFavoriteArticleIds] = useState(new Set());

  // Listen for user's favorite articles in real-time
  useEffect(() => {
    if (!currentUser) {
      setFavoriteArticleIds(new Set());
      return;
    }

    const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = new Set(snapshot.docs.map(doc => doc.data().url));
      setFavoriteArticleIds(ids);
    }, (error) => {
      console.error("Error listening to favorites: ", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (searchQuery.trim() !== '') {
          response = await searchNews(searchQuery, currentPage, pageSize);
        } else {
          response = await fetchTopHeadlines('us', activeCategory, currentPage, pageSize);
        }
        // Filter out articles that are missing critical information, including an image URL
        const validArticles = response.articles.filter(article => 
          article && article.title && article.source && article.source.name && article.urlToImage
        );
        setArticles(validArticles);
        setTotalResults(response.totalResults);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [activeCategory, searchQuery, currentPage]);

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleToggleFavorite = async (article) => {
    if (!currentUser) {
      showToast("Please log in to save articles to your favorites.", 'error');
      return;
    }

    const isFavorited = favoriteArticleIds.has(article.url);
    if (isFavorited) {
      try {
        // Find the document to delete
        const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid), where('url', '==', article.url));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, 'favorites', document.id));
        });
        showToast("Article removed from favorites.", 'success');
      } catch (err) {
        console.error("Error removing article: ", err);
        showToast("Failed to remove article from favorites.", 'error');
      }
    } else {
      // Add the article to favorites
      try {
        await addDoc(collection(db, 'favorites'), {
          userId: currentUser.uid,
          title: article.title,
          url: article.url,
          sourceName: article.source.name,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage, // This is the new field we're adding
        });
        showToast("Article added to favorites!", 'success');
      } catch (err) {
        console.error("Error adding article to favorites:", err);
        showToast("Failed to add article to favorites.", 'error');
      }
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  if (isLoading) {
    return <div className="text-center mt-8 text-xl text-gray-700">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500 font-bold">Error: {error}</div>;
  }
  
  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : `Top ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Headlines`;

  return (
    <div className="container mx-auto p-4">
      <SearchBar
        query={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link key={article.url} to={`/article/${encodeURIComponent(article.url)}`} className="block">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative">
                {/* Image element added here */}
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Not+Found";
                  }}
                />
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{article.source.name}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevents navigation when clicking the button
                    handleToggleFavorite(article);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                    favoriteArticleIds.has(article.url) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.84-1.84C5.46 15.35 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.46 6.85-8.16 11.01L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">No articles found. Try a different search.</div>
        )}
      </div>

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