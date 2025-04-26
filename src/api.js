// API integration for the application

// API configuration for connecting to the backend
const API_BASE_URL = 'https://hardik8588-real_estate.hf.space';

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

// Get Home Stats for the homepage
export const getHomePageStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/home-stats`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Home stats request failed:', error);
    throw error;
  }
};

// Get Featured Properties
export const getFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/featured-properties`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Featured properties request failed:', error);
    throw error;
  }
};

// Get Nearby Properties - supports both coordinate object and separate lat/lng parameters
export const getNearbyProperties = async (coordinates) => {
  try {
    // Handle both formats: {lat, lng} object or separate lat, lng parameters
    let requestBody;
    
    if (typeof coordinates === 'object' && coordinates !== null) {
      requestBody = coordinates;
    } else if (arguments.length === 2) {
      // Handle the case where lat and lng are passed as separate arguments
      const [lat, lng] = arguments;
      requestBody = { lat, lng };
    } else {
      throw new Error('Invalid coordinates format');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/nearby-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Nearby properties request failed:', error);
    throw error;
  }
};

// Get property types
export const getPropertyTypes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/property-types`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting property types:', error);
    // Fallback data
    return {
      success: true,
      propertyTypes: ['Apartment', 'House', 'Villa', 'Condo']
    };
  }
};

// Get available amenities
export const getAmenities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/amenities`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting amenities:', error);
    // Fallback data
    return {
      success: true,
      amenities: [
        'Power Backup', 'Gym', 'Security', 'Swimming Pool', 
        'Clubhouse', '24/7 Water Supply', 'Lift', 'Garden', 'Parking'
      ]
    };
  }
};
