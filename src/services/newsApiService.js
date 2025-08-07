import axios from 'axios';

// Get the API key from your environment variables
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Create an Axios instance with a base URL
const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
});

/**
 * Fetches top headlines from the News API.
 * @param {string} country The country to get headlines from (e.g., 'us', 'gb').
 * @param {string} category The category to filter by (e.g., 'technology', 'sports').
 * @returns {Promise<object[]>} A promise that resolves to an array of article objects.
 */
export const fetchTopHeadlines = async (country = 'us', category = '') => {
  if (!API_KEY) {
    console.error("VITE_NEWS_API_KEY is not set in the environment variables.");
    return [];
  }

  try {
    const response = await newsApi.get('/top-headlines', {
      params: {
        apiKey: API_KEY,
        country: country,
        category: category,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};