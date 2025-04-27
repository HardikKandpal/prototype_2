// Unified API utility for AI RealEstate frontend

// Use Vite env or fallback to production URL
const API_BASE_URL = "https://hardik8588-real-estate.hf.space";

console.log("[API] Using API_BASE_URL:", API_BASE_URL);

// Helper: Normalize API responses for frontend
const normalize = (res, keys = []) => {
  if (!res) return {};
  for (const key of keys) {
    if (res[key]) return res[key];
  }
  if (res.data) return res.data;
  if (res.locations) return res.locations;
  if (res.recommendations) return res.recommendations;
  return res;
};

// --- Property Valuation ---
export const getPropertyValuation = async (property) => {
  console.log("[API] getPropertyValuation called with:", property);
  try {
    const response = await fetch(`${API_BASE_URL}/api/valuation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(property),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return {
      predicted_price: data.predicted_price ?? data.estimated_value ?? null,
      status: data.status ?? (data.predicted_price ? "success" : "error"),
      ...data,
    };
  } catch (error) {
    return {
      predicted_price: property.square_footage
        ? property.square_footage * 10000
        : null,
      status: "error",
      error: error.message,
      note: "Fallback estimate due to error",
    };
  }
};

// --- Market Analysis ---
export const getMarketAnalysis = async (location, months = 12) => {
  console.log("[API] getMarketAnalysis called with:", location, months);
  try {
    const response = await fetch(`${API_BASE_URL}/api/market-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, months }),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return {
      status: data.status ?? "success",
      data: data.data ?? data,
      error: data.error,
    };
  } catch (error) {
    // Fallback: hardcoded data
    return {
      status: "error",
      error: error.message,
      data: {
        marketTrends: [
          { metric: "Median Home Price", value: 12500000, change: "5.2%", isPositive: true },
          { metric: "Number of Sales", value: 245, change: "-2.8%", isPositive: false },
          { metric: "Days on Market", value: 32, change: "-15.8%", isPositive: true },
          { metric: "Price per Square Foot", value: 9800, change: "3.5%", isPositive: true },
          { metric: "Inventory Levels", value: 320, change: "8.2%", isPositive: false },
          { metric: "Year-over-Year Price Change", value: 5.2, change: "5.2%", isPositive: true }
        ],
        hotNeighborhoods: [
          { name: "Vasant Kunj", growth: "8.5%", medianPrice: 15800000, pricePerSqFt: 12500 },
          { name: "Greater Kailash", growth: "7.2%", medianPrice: 18500000, pricePerSqFt: 14200 },
          { name: "Dwarka", growth: "6.8%", medianPrice: 9800000, pricePerSqFt: 8500 }
        ],
        insights: [
          "The Delhi real estate market has shown strong resilience with a 5.2% increase in median home prices.",
          "Luxury properties in Delhi continue to appreciate faster than other segments.",
          "Inventory levels in Delhi have increased by 8.2%, indicating a potential shift towards a buyer's market.",
          "Properties in Delhi are selling 15% faster than the market average."
        ],
        charts: {}
      }
    };
  }
};

// --- Property Recommendations ---
export const getPropertyRecommendations = async (criteria) => {
  console.log("[API] getPropertyRecommendations called with:", criteria);
  try {
    const response = await fetch(`${API_BASE_URL}/api/property-recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteria),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return { recommendations: data.recommendations ?? data.data ?? [], ...data };
  } catch (error) {
    return {
      recommendations: [],
      error: error.message,
      status: "error"
    };
  }
};

// --- Get Available Locations ---
export const getLocations = async () => {
  console.log("[API] getLocations called");
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return {
      locations: data.locations ?? data.data ?? [],
      status: data.status ?? "success",
      ...data
    };
  } catch (error) {
    return {
      locations: [
        "Connaught Place", "Vasant Kunj", "Greater Kailash", "Dwarka",
        "Nehru Place", "Pitampura", "Rajouri Garden", "Chattarpur"
      ],
      status: "error",
      error: error.message
    };
  }
};

// --- Home Stats ---
export const getHomePageStats = async () => {
  console.log("[API] getHomePageStats called");
  try {
    const response = await fetch(`${API_BASE_URL}/api/home-stats`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return {
      total_properties: 1000,
      avg_price: 12500000,
      price_growth: 5.2,
      popular_locations: [
        { name: "Vasant Kunj", growth: "8.5%" },
        { name: "Greater Kailash", growth: "7.2%" },
        { name: "Dwarka", growth: "6.8%" },
        { name: "Connaught Place", growth: "5.9%" },
        { name: "Saket", growth: "5.5%" }
      ],
      price_trend_chart: ""
    };
  }
};

// --- Featured Properties ---
export const getFeaturedProperties = async () => {
  try {
    // Backend endpoint is /featured-properties (not /api/featured-properties)
    const response = await fetch(`${API_BASE_URL}/api/featured-properties`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    // Fallback data
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
  }
};

// --- Nearby Properties ---
export const getNearbyProperties = async (coordinates) => {
  console.log("[API] getNearbyProperties called with:", coordinates);
  try {
    const response = await fetch(`${API_BASE_URL}/api/nearby-properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coordinates),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    // Fallback data
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
  }
};

// --- Property Types (frontend fallback only) ---
export const getPropertyTypes = async () => {
  console.log("[API] getPropertyTypes called");
  return {
    success: true,
    propertyTypes: [
      "Apartment", "House", "Villa", "Condo", "Penthouse", "Builder Floor"
    ]
  };
};

// --- Amenities (frontend fallback only) ---
export const getAmenities = async () => {
  console.log("[API] getAmenities called");
  return {
    success: true,
    amenities: [
      "Power Backup", "Gym", "Security", "Swimming Pool",
      "Clubhouse", "24/7 Water Supply", "Lift", "Garden", "Parking"
    ]
  };
};

// --- Test endpoint ---
export const testAPI = async () => {
  console.log("[API] testAPI called");
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

// --- Ping/health endpoint ---
export const pingAPI = async () => {
  console.log("[API] pingAPI called");
  try {
    // Backend ping endpoint is //ping (double slash, as in backend)
    const response = await fetch(`${API_BASE_URL}//ping`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    return { status: "error", message: error.message };
  }
};
