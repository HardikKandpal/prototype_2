// API integration for the application

// Create a base URL that changes based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hardik8588-real-estate.hf.space' // Replace with your actual deployed backend URL
  : 'http://localhost:8000';

// Then use this base URL in all your fetch calls
export const getMarketAnalysis = async (location, months = 12) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/market-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location, months }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get market analysis');
    }

    return await response.json();
  } catch (error) {
    console.error('Market analysis request failed:', error);
    throw error;
  }
};

// Get available locations
export const getLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get locations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Locations request failed:', error);
    throw error;
  }
};

// Property Recommendations API
export const getPropertyRecommendations = async (criteria) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/property-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criteria),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get property recommendations');
    }

    return await response.json();
  } catch (error) {
    console.error('Recommendations request failed:', error);
    throw error;
  }
};

// Add these new API functions

// Get market stats for homepage
export const getHomePageStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home-stats`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get home stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Home stats request failed:', error);
    throw error;
  }
};

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/featured-properties`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get featured properties');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Featured properties request failed:', error);
    throw error;
  }
};

// Get nearby properties based on location
export const getNearbyProperties = async (lat, lng) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nearby-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get nearby properties');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Nearby properties request failed:', error);
    throw error;
  }
};