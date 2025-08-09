import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Reference to the 'favorites' collection for the current user
    const favoritesCollectionRef = collection(db, 'favorites');
    const q = query(favoritesCollectionRef, where('userId', '==', currentUser.uid));

    // Set up a real-time listener with onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(articles);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites: ", error);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUser]); // Re-run effect when currentUser changes

  // Function to remove a favorite article
  const handleRemoveFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, 'favorites', id));
    } catch (err) {
      console.error("Error removing article:", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-xl text-gray-700">Loading your favorites...</div>;
  }

  if (!currentUser) {
    return (
      <div className="text-center mt-8 text-xl text-gray-700 p-6">
        <p className="mb-4">Please log in to view your favorite articles.</p>
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Favorite Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.length > 0 ? (
          favorites.map((article) => (
            <div key={article.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{article.sourceName}</p>
              <button
                onClick={() => handleRemoveFavorite(article.id)}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            You haven't added any favorite articles yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;