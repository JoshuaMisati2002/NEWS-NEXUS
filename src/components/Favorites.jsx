import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Favorites({ showToast }) {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, 'favorites'), where('userId', '==', currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favoriteArticles = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      }));
      setFavorites(favoriteArticles);
      setIsLoading(false);
    }, (err) => {
      setError("Failed to load favorites. Please try again.");
      console.error("Error fetching favorites: ", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleRemoveFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, 'favorites', id));
      showToast('Article removed from favorites.', 'success');
    } catch (err) {
      console.error("Error removing article: ", err);
      showToast('Failed to remove article.', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8 text-xl text-gray-400">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500 font-bold">Error: {error}</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Your Favorite Articles</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((article) => (
            //  hover effects
            <div key={article.id} className="block transform transition-transform duration-300 hover:scale-[1.02]">
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative">
                
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
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{article.sourceName}</p>
                <button
                  onClick={() => handleRemoveFavorite(article.id)}
                  className="absolute top-4 right-4 p-2 text-red-500 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.84-1.84C5.46 15.35 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.46 6.85-8.16 11.01L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-8">
          You haven't added any favorite articles yet.
        </div>
      )}
    </div>
  );
}

export default Favorites;