import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          News Nexus
        </div>
        {/* i will add navigation links and other elements here later */}
        <div className="flex space-x-4">
        </div>
      </div>
    </nav>
  );
}

export default Navbar;