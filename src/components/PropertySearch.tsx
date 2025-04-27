import React, { useState, useEffect } from 'react';
import { getPropertyRecommendations, getLocations, getPropertyTypes, getAmenities } from '../api';

// Update the preferences interface to match the CSV structure
interface PropertyPreferences {
  propertyType: string;
  budget: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  amenities: string[];
  yearBuilt: string;
}

interface Property {
  id: string | number;
  title: string;
  price: number;
  bedrooms: number;
  squareFeet: number;
  location: string;
  amenities: string[];
  image?: string;
}

const PropertySearch: React.FC = () => {
  // Initialize with default values
  const [preferences, setPreferences] = useState<PropertyPreferences>({
    propertyType: 'Any',
    budget: 'Any',
    location: 'Any',
    bedrooms: 'Any',
    bathrooms: 'Any',
    squareFootage: 'Any',
    amenities: [],
    yearBuilt: 'Any'
  });
  
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<string[]>([]);

  // Fetch dropdown options on component mount
  // Update the useEffect that fetches options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        
        // Set default values immediately based on CSV data
        setLocations([
          'Any', 'South Extension', 'Dwarka', 'Karol Bagh', 'Lajpat Nagar',
          'Rohini', 'Preet Vihar', 'Greater Kailash', 'Vasant Kunj', 
          'Chattarpur', 'Saket', 'Connaught Place', 'Pitampura'
        ]);
        
        setPropertyTypes([
          'Any', 'Apartment', 'House', 'Villa', 'Condo'
        ]);
        
        setAmenitiesList([
          'Power Backup', 'Gym', 'Security', 'Swimming Pool', 
          'Clubhouse', '24/7 Water Supply', 'Lift', 'Garden', 'Parking'
        ]);
        
        // Try to fetch from API if available
        try {
          const [locationsRes, propertyTypesRes, amenitiesRes] = await Promise.all([
            getLocations(),
            getPropertyTypes(),
            getAmenities()
          ]);
          
          if (locationsRes.success && locationsRes.data.length > 0) {
            setLocations(['Any', ...locationsRes.data]);
          }
          
          if (propertyTypesRes.success && propertyTypesRes.data.length > 0) {
            setPropertyTypes(['Any', ...propertyTypesRes.data]);
          }
          
          if (amenitiesRes.success && amenitiesRes.data.length > 0) {
            setAmenitiesList(amenitiesRes.data);
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // We already have fallback data, so no need to set error
        }
      } catch (error) {
        console.error('Error in fetchOptions:', error);
        setError('Failed to load options. Using default values.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Select changed: ${name} = ${value}`);
    setPreferences({ ...preferences, [name]: value });
  };
  
  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log(`Amenity changed: ${value} = ${checked}`);
    
    if (checked) {
      setPreferences({ 
        ...preferences, 
        amenities: [...preferences.amenities, value] 
      });
    } else {
      setPreferences({
        ...preferences,
        amenities: preferences.amenities.filter(amenity => amenity !== value)
      });
    }
  };

  // Add a useEffect to monitor preferences changes
  useEffect(() => {
    console.log('Current preferences:', preferences);
  }, [preferences]);

  // Submit preferences to backend and get recommendations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format data to match the recommender model's expected input format
      const formattedPreferences = {
        propertyType: preferences.propertyType === 'Any' ? '' : preferences.propertyType,
        // Format budget as a range string (e.g. "0-5000000")
        budget: preferences.budget === 'Any' ? '0-999999999' : preferences.budget,
        location: preferences.location === 'Any' ? '' : preferences.location,
        // Convert bedrooms to the format expected by the model
        bedrooms: preferences.bedrooms === 'Any' ? '' : preferences.bedrooms,
        // Add the new fields
        bathrooms: preferences.bathrooms === 'Any' ? '' : preferences.bathrooms,
        squareFootage: preferences.squareFootage === 'Any' ? '' : preferences.squareFootage,
        yearBuilt: preferences.yearBuilt === 'Any' ? '' : preferences.yearBuilt,
        // Pass amenities as an array of strings
        amenities: preferences.amenities
      };
      
      const response = await getPropertyRecommendations(formattedPreferences);
      
      if (response.success) {
        setRecommendations(response.data);
      } else {
        setError(response.error || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setError('Failed to connect to recommendation service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Improved Indian currency format function
  const formatIndianPrice = (price: number): string => {
    if (price >= 10000000) {
      const crores = price / 10000000;
      return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2)} Cr`;
    } else if (price >= 100000) {
      const lakhs = price / 100000;
      return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)} Lac`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Find Your Dream Property</h1>
      
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Update the form to include the new fields */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Property Type</label>
            <select
              name="propertyType"
              value={preferences.propertyType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Budget</label>
            <select
              name="budget"
              value={preferences.budget}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="0-5000000">Under ₹50 Lac</option>
              <option value="5000000-10000000">₹50 Lac - ₹1 Cr</option>
              <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
              <option value="20000000-999999999">Above ₹2 Cr</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            {/* In the Location select element */}
            <select
              name="location"
              value={preferences.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bedrooms</label>
            <select
              name="bedrooms"
              value={preferences.bedrooms}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5 Bedrooms</option>
              <option value="6">6+ Bedrooms</option>
            </select>
          </div>
          
          {/* Add Bathrooms field */}
          <div>
            <label className="block text-gray-700 mb-2">Bathrooms</label>
            <select
              name="bathrooms"
              value={preferences.bathrooms}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="4">4+ Bathrooms</option>
            </select>
          </div>
          
          {/* Add Square Footage field */}
          <div>
            <label className="block text-gray-700 mb-2">Square Footage</label>
            <select
              name="squareFootage"
              value={preferences.squareFootage}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="0-1000">Under 1000 sq.ft</option>
              <option value="1000-2000">1000-2000 sq.ft</option>
              <option value="2000-3000">2000-3000 sq.ft</option>
              <option value="3000-4000">3000-4000 sq.ft</option>
              <option value="4000-999999">Above 4000 sq.ft</option>
            </select>
          </div>
          
          {/* Add Year Built field */}
          <div>
            <label className="block text-gray-700 mb-2">Year Built</label>
            <select
              name="yearBuilt"
              value={preferences.yearBuilt}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="Any">Any</option>
              <option value="1980-1990">1980-1990</option>
              <option value="1991-2000">1991-2000</option>
              <option value="2001-2010">2001-2010</option>
              <option value="2011-2020">2011-2020</option>
              <option value="2021-2023">2021 and newer</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            {amenitiesList.map(amenity => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  value={amenity}
                  checked={preferences.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Find Properties'}
        </button>
      </form>
      
      {/* Results Section */}
      {recommendations && recommendations.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Recommended Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((property) => (
              <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {property.image ? (
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <p className="text-white font-bold text-xl">{formatIndianPrice(property.price)}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                    <span>{property.squareFeet} sq.ft</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && recommendations.length === 0 && error === null && (
          <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">Search for properties using the form above.</p>
          </div>
        )
      )}
    </div>
  );
};

export default PropertySearch;
