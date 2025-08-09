import axios from 'axios';

// Get the API key from your environment variables
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Create an Axios instance with a base URL
const newsApi = axios.create({
  baseURL: 'https://newsapi.org/v2',
});

/**
 * Fetches top headlines from the News API.
 * @param {string} country The country to get headlines from 
 * @param {string} category The category to filter by (e.g., 'technology', 'sports').
 * @returns {Promise<object[]>} A promise that resolves to an array of article objects.
 */

export const fetchTopHeadlines = async (country = 'us', category = '', page = 1, pageSize = 20) => {
  if (!API_KEY) {
    console.error("VITE_NEWS_API_KEY is not set in the environment variables.");
    return { articles: [], totalResults: 0 };
  }

  try {
    const response = await newsApi.get('/top-headlines', {
      params: {
        apiKey: API_KEY,
        country: country,
        category: category,
        page: page,
        pageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return { articles: [], totalResults: 0 };
  }
};

/**
 * Searches for news articles by keyword.
 * @param {string} query The search query string.
 * @returns {Promise<object[]>} A promise that resolves to an array of article objects.
 */
export const searchNews = async (query, page = 1, pageSize = 20) => {
  if (!API_KEY) {
    console.error("VITE_NEWS_API_KEY is not set in the environment variables.");
    return { articles: [], totalResults: 0 };
  }

  if (!query) {
    return { articles: [], totalResults: 0 };
  }

  try {
    const response = await newsApi.get('/everything', {
      params: {
        apiKey: API_KEY,
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        page: page,
        pageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching news:", error);
    return { articles: [], totalResults: 0 };
  }
};
