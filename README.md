News Nexus
A modern, responsive web application that aggregates top headlines from various sources and allows users to search, filter by category, and save their favorite articles. This project was built to demonstrate proficiency with React, Tailwind CSS, and Firebase.

Key Features
Customizable News Feed: Fetches top headlines from a specific country   and allows users to filter by category.

Article Search: Provides a search bar to find articles by keyword.

User Authentication: Secure user signup and login using Firebase Authentication.

Favorites List: Users can save articles to a personal favorites list, which is stored in a Firestore NoSQL database.

Real-time Updates: The favorites list updates in real time as articles are added or removed.

Modern UI: A clean, dark-themed user interface with subtle gradients, shadows, and hover effects, built with Tailwind CSS.

Responsive Design: Optimized for a seamless experience on both desktop and mobile devices.

Technology Stack
Frontend: React.js

Styling: Tailwind CSS

State Management: React Hooks (useState, useEffect)

Authentication & Database: Firebase Authentication and Cloud Firestore

News API: An external API to fetch news data

How to Run Locally
Follow these steps to get a copy of the project up and running on your local machine.

Prerequisites
You will need the following software installed:

Node.js (LTS version recommended)

npm (comes with Node.js)

Installation
Clone the repository to your local machine: 

Install the required dependencies:

Configure API Key:
Create a new file named .env in the root of the project.
Add your News API key to this file:

Running the App
Start the development server and open the app in your browser 



Usage
Homepage: Browse top headlines and filter by categories like 'technology' or 'sports'.

Search: Use the search bar to find articles on any topic.

Authentication: Use the navigation bar to log in or create a new account to save articles.

Favorites: Click the heart icon on any article to add it to your favorites list.
