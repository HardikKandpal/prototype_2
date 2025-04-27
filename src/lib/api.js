// JavaScript version of the API functions

// Create base URL that changes based on environment
const API_BASE_URL = 'https://hardik8588-real_estate.hf.space';

// Create axios instance with base URL
const api = {
  baseURL: `${API_BASE_URL}/api`,
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
    
    const response = await fetch(`${API_BASE_URL}/api/valuation`, {
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
export const getMarketAnalysis = async (location, months = 12) => {
  try {
    console.log('Sending market analysis request:', { location, months });
    
    // Ensure months is a valid number
    const parsedMonths = parseInt(months) || 12;
    
    const response = await fetch(`${API_BASE_URL}/api/market-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: location || null,
        months: parsedMonths
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Market analysis API error:', response.status, errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Market analysis response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching market analysis:', error);
    throw error;
  }
};

// Add the missing getHomePageStats function
export const getHomePageStats = async () => {
  try {
    console.log('API call: getHomePageStats');
    
    // Try to fetch from the backend first
    try {
      const response = await fetch(`${API_BASE_URL}/api/home-stats`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Home stats response:', data);
        return data;
      }
    } catch (fetchError) {
      console.warn('Could not fetch home stats from API, using fallback data', fetchError);
    }
    
    // Fallback data if API call fails
    return {
      success: true,
      stats: {
        totalProperties: 1250,
        newListings: 48,
        averagePrice: "₹1.2 Cr",
        marketTrend: "+5.2%"
      },
      featuredLocations: [
        { name: "South Delhi", growth: "+7.2%", avgPrice: "₹2.5 Cr" },
        { name: "Gurgaon", growth: "+4.8%", avgPrice: "₹1.8 Cr" },
        { name: "Noida", growth: "+3.5%", avgPrice: "₹1.1 Cr" }
      ]
    };
  } catch (error) {
    console.error('Error getting home page stats:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      stats: {
        totalProperties: 1000,
        newListings: 30,
        averagePrice: "₹1.0 Cr",
        marketTrend: "+3.0%"
      }
    };
  }
};

// Add these functions if they're not already defined

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    console.log('API call: getFeaturedProperties');
    
    // Try to fetch from the backend first
    try {
      const response = await fetch(`${API_BASE_URL}/api/featured-properties`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Featured properties response:', data);
        return data;
      }
    } catch (fetchError) {
      console.warn('Could not fetch featured properties from API, using fallback data', fetchError);
    }
    
    // Fallback data if API call fails
    return [
      {
        id: "PROP-0001",
        title: "Luxury Villa in Vasant Kunj",
        price: "2.5 Cr",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 4,
        baths: 3,
        area: 3500,
        tag: "Premium",
        amenities: ["Swimming Pool", "Gym", "Security"]
      },
      {
        id: "PROP-0002",
        title: "Modern Apartment in Saket",
        price: "1.8 Cr",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 3,
        baths: 2,
        area: 2200,
        tag: "New Launch",
        amenities: ["Power Backup", "Lift", "Parking"]
      },
      {
        id: "PROP-0003",
        title: "Penthouse in Greater Kailash",
        price: "3.2 Cr",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 5,
        baths: 4,
        area: 4100,
        tag: "Featured",
        amenities: ["Clubhouse", "Garden", "24/7 Water Supply"]
      }
    ];
  } catch (error) {
    console.error('Error getting featured properties:', error);
    return [];
  }
};

// Get nearby properties
export const getNearbyProperties = async (coordinates) => {
  try {
    console.log('API call: getNearbyProperties', coordinates);
    
    // Try to fetch from the backend first
    try {
      const response = await fetch(`${API_BASE_URL}/api/nearby-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coordinates),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Nearby properties response:', data);
        return data;
      }
    } catch (fetchError) {
      console.warn('Could not fetch nearby properties from API, using fallback data', fetchError);
    }
    
    // Fallback data if API call fails
    return [
      {
        id: 1,
        title: "3 BHK Apartment",
        location: "Sector 45, Noida",
        distance: "1.2 km away",
        price: "85 Lac",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "Apartment",
        possession: "Ready to Move"
      },
      {
        id: 2,
        title: "4 BHK Villa",
        location: "Vasant Kunj, Delhi",
        distance: "2.5 km away",
        price: "1.9 Cr",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "Villa",
        possession: "Ready to Move"
      },
      {
        id: 3,
        title: "2 BHK Apartment",
        location: "Sector 62, Noida",
        distance: "3.1 km away",
        price: "65 Lac",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        type: "Apartment",
        possession: "Under Construction"
      }
    ];
  } catch (error) {
    console.error('Error getting nearby properties:', error);
    return [];
  }
};

// Make sure getHomeStats is also exported (might be used elsewhere)
export const getHomeStats = getHomePageStats;

export default api;
