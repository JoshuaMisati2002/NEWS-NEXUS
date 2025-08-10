import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Favorites from './components/Favorites';
import Profile from './components/Profile';
import Article from './components/Article';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

function App() {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: '', type: '' });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex flex-col font-inter text-gray-100">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage showToast={showToast} />} />
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/signup" element={<Signup showToast={showToast} />} />
          <Route path="/favorites" element={<Favorites showToast={showToast} />} />
          <Route path="/profile" element={<Profile showToast={showToast} />} />
          <Route path="/article/:url" element={<Article />} />
        </Routes>
      </main>
      <Footer />
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}

export default App;
