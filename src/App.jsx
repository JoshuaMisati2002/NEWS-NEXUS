import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
