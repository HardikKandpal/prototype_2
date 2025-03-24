import axios from 'axios';

// Define interfaces for API parameters
export interface PropertyPreferences {
  propertyType: string;  // Matches model's propertyType field
  budget: string;        // Matches model's budget range format (e.g. "0-5000000")
  location: string;      // Matches model's location field
  bedrooms: string;      // Matches model's bedrooms field
  amenities: string[];   // Matches model's amenities list
}

// Define the property recommendation response type
interface PropertyRecommendation {
  id: string | number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  squareFeet: number;
  amenities: string[];
  image?: string; // Added for UI display purposes
}

interface PropertyDetails {
  propertyType: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  lotSize: number;
  renovationStatus: string;
  renovationYear?: number;
}

interface PropertyValuation {
  estimatedValue: number;
  valueRange: {
    min: number;
    max: number;
  };
  confidence: number;
  comparableProperties?: PropertyRecommendation[];
}

interface MarketAnalysis {
  trendData: {
    date: string;
    averagePrice: number;
    volume: number;
  }[];
  forecast: {
    date: string;
    predictedPrice: number;
    confidence: number;
  }[];
  insights: string[];
}

interface MarketAnalysisParams {
  location: string;
  months: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Property recommendation API
export const getPropertyRecommendations = async (preferences: PropertyPreferences): Promise<ApiResponse<PropertyRecommendation[]>> => {
  console.log('API call: getPropertyRecommendations', preferences);
  
  try {
    // For demo purposes, we're simulating a response
    // In a real app, uncomment the axios call below
    // const response = await api.post('/recommend', preferences);
    // return {
    //   success: true,
    //   data: response.data.recommendations || [],
    //   message: response.data.message
    // };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data based on preferences
    const mockProperties: PropertyRecommendation[] = [];
    
    for (let i = 0; i < 6; i++) {
      const property: PropertyRecommendation = {
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
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    };
  }
};

// Property valuation API
export const getPropertyValuation = async (propertyDetails: PropertyDetails): Promise<ApiResponse<PropertyValuation>> => {
  try {
    const response = await api.post('/valuation', propertyDetails);
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error getting property valuation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {
        estimatedValue: 0,
        valueRange: { min: 0, max: 0 },
        confidence: 0
      }
    };
  }
};

// Market analysis API
export const getMarketAnalysis = async (params: MarketAnalysisParams): Promise<ApiResponse<MarketAnalysis>> => {
  try {
    const response = await api.post('/market-analysis', params);
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error getting market analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {
        trendData: [],
        forecast: [],
        insights: []
      }
    };
  }
};

// Get available locations
export const getLocations = async (): Promise<ApiResponse<string[]>> => {
  console.log('API call: getLocations');
  
  try {
    // For demo purposes, we're simulating a response
    // In a real app, uncomment the axios call below
    // const response = await api.get('/locations');
    // return {
    //   success: true,
    //   data: response.data.locations || [],
    //   message: response.data.message
    // };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi',
        'Gurgaon', 'Noida', 'Greater Noida', 'Faridabad', 'Ghaziabad'
      ]
    };
  } catch (error) {
    console.error('Error getting locations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    };
  }
};

// Get property types
export const getPropertyTypes = async (): Promise<ApiResponse<string[]>> => {
  console.log('API call: getPropertyTypes');
  
  try {
    // For demo purposes, we're simulating a response
    // In a real app, uncomment the axios call below
    // const response = await api.get('/property-types');
    // return {
    //   success: true,
    //   data: response.data.propertyTypes || [],
    //   message: response.data.message
    // };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        'Apartment', 'Builder Floor', 'Independent House', 'Villa', 
        'Penthouse', 'Studio Apartment', 'Farmhouse'
      ]
    };
  } catch (error) {
    console.error('Error getting property types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    };
  }
};

// Get available amenities
export const getAmenities = async (): Promise<ApiResponse<string[]>> => {
  console.log('API call: getAmenities');
  
  try {
    // For demo purposes, we're simulating a response
    // In a real app, uncomment the axios call below
    // const response = await api.get('/amenities');
    // return {
    //   success: true,
    //   data: response.data.amenities || [],
    //   message: response.data.message
    // };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: [
        'Power Backup', 'Lift', 'Car Parking', 'Swimming Pool', 
        'Gym', 'Club House', 'Security', 'Park', 'Gated Community'
      ]
    };
  } catch (error) {
    console.error('Error getting amenities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: []
    };
  }
};

// Get property details by ID
export const getPropertyDetails = async (id: string | number): Promise<ApiResponse<PropertyRecommendation>> => {
  try {
    const response = await api.get(`/properties/${id}`);
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Error getting property details for ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {
        id: '',
        title: '',
        price: 0,
        location: '',
        bedrooms: 0,
        squareFeet: 0,
        amenities: []
      }
    };
  }
};

export default api;