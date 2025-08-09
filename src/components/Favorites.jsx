import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

    // Reference to the favorites collection for the current user
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
            <div key={article.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-600">{article.sourceName}</p>
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