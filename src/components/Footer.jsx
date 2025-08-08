import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} News Nexus Dashboard</p>
      </div>
    </footer>
  );
}

export default Footer;