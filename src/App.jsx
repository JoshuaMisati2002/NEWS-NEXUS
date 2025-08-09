import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import Navbar  from './components/NavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import Favorites from './components/Favorites';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{/* added a new main tag with flex-grow to ensure the Footer stays at the bottom of the page, even if the content is short. */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
