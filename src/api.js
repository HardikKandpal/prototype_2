// API integration for the application

// Create a base URL that changes based on environment
// API configuration for connecting to the backend
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hardik8588-real-estate.hf.space' // Hugging Face Space URL
  : 'http://localhost:8000';

// Property Valuation API
export const getPropertyValuation = async (propertyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/valuation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting property valuation:', error);
    throw error;
  }
};

// Market Analysis API
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting market analysis:', error);
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting property recommendations:', error);
    throw error;
  }
};

// Get Available Locations
export const getLocations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
};

// Get Featured Properties
export const getFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/featured-properties`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting featured properties:', error);
    throw error;
  }
};

// Get Nearby Properties
export const getNearbyProperties = async (coordinates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nearby-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(coordinates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting nearby properties:', error);
    throw error;
  }
};

// Get Home Stats
export const getHomeStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home-stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting home stats:', error);
    throw error;
  }
};