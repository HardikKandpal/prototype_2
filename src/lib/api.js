// JavaScript version of the API functions

// Create axios instance with base URL
const api = {
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Property recommendation API
export const getPropertyRecommendations = async (preferences) => {
  console.log('API call: getPropertyRecommendations', preferences);
  
  try {
    // For demo purposes, we're simulating a response
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data based on preferences
    const mockProperties = [];
    
    for (let i = 0; i < 6; i++) {
      const property = {
        id: `prop-${i + 1}`,
        title: `${preferences.propertyType !== 'any' ? preferences.propertyType : 'Luxury'} Property in ${preferences.location !== 'any' ? preferences.location : 'Delhi NCR'}`,
        price: 5000000 + Math.floor(Math.random() * 20000000),
        bedrooms: preferences.bedrooms !== 'any' ? parseInt(preferences.bedrooms) : Math.floor(Math.random() * 4) + 1,
        squareFeet: 800 + Math.floor(Math.random() * 3000),
        location: preferences.location !== 'any' ? preferences.location : ['South Delhi', 'Gurgaon', 'Noida'][Math.floor(Math.random() * 3)],
        amenities: preferences.amenities.length > 0 ? 
          preferences.amenities : 
          ['Power Backup', 'Lift', 'Car Parking', 'Swimming Pool'].slice(0, Math.floor(Math.random() * 4) + 1),
        image: `https://source.unsplash.com/random/800x600/?apartment,${i}`
      };
      
      mockProperties.push(property);
    }
    
    return {
      success: true,
      data: mockProperties
    };
  } catch (error) {
    console.error('Error getting property recommendations:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      data: []
    };
  }
};

// Property valuation API
export const getPropertyValuation = async (propertyDetails) => {
  try {
    console.log("Sending data to API:", propertyDetails);
    
    const response = await fetch('http://localhost:8000/api/valuation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(propertyDetails),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("API response:", data);
    
    return {
      success: true,
      predicted_price: data.predicted_price || data.estimated_value
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get property valuation'
    };
  }
};

// Get available locations
export const getLocations = async () => {
  console.log('API call: getLocations');
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      locations: [
        'South Extension', 'Dwarka', 'Karol Bagh', 'Lajpat Nagar',
        'Rohini', 'Preet Vihar', 'Greater Kailash', 'Vasant Kunj', 
        'Chattarpur', 'Saket', 'Connaught Place', 'Pitampura'
      ]
    };
  } catch (error) {
    console.error('Error getting locations:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      locations: []
    };
  }
};

// Get property types
export const getPropertyTypes = async () => {
  console.log('API call: getPropertyTypes');
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      propertyTypes: ['Apartment', 'House', 'Villa', 'Condo']
    };
  } catch (error) {
    console.error('Error getting property types:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      propertyTypes: []
    };
  }
};

// Get available amenities
export const getAmenities = async () => {
  console.log('API call: getAmenities');
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      amenities: [
        'Power Backup', 'Gym', 'Security', 'Swimming Pool', 
        'Clubhouse', '24/7 Water Supply', 'Lift', 'Garden', 'Parking'
      ]
    };
  } catch (error) {
    console.error('Error getting amenities:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      amenities: []
    };
  }
};

// Add this function to your existing api.js file
// Add or update the getMarketAnalysis function
// Update the getMarketAnalysis function to use the actual API
export const getMarketAnalysis = async (params) => {
  try {
    console.log('Sending market analysis request:', params);
    
    const response = await fetch('http://localhost:8000/api/market-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Market analysis API error:', errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Market analysis response:', data);
    
    // Check if the data has the expected structure
    if (!data.success || !data.data || !data.data.summary) {
      console.error('Unexpected API response structure:', data);
      return {
        success: false,
        error: 'Invalid response format from server',
        data: null
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching market analysis:', error);
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
      data: null
    };
  }
};

export default api;