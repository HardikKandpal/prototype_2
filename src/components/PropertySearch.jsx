import { useState, useEffect } from 'react';
import { getPropertyRecommendations, getLocations, getPropertyTypes, getAmenities } from '../api';

const PropertySearch = () => {
  // Initialize with default values
  const [preferences, setPreferences] = useState({
    propertyType: 'Any',
    budget: 'Any',
    location: 'Any',
    bedrooms: 'Any',
    bathrooms: 'Any',
    squareFootage: 'Any',
    yearBuilt: 'Any',
    amenities: []
  });
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);

  // Fetch dropdown options on component mount
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
          
          // Fix: Use correct keys and fallback to empty array if undefined
          const locationsData = locationsRes.locations || locationsRes.data || [];
          if (locationsRes.success && locationsData.length > 0) {
            setLocations(['Any', ...locationsData]);
          }
          
          const propertyTypesData = propertyTypesRes.propertyTypes || propertyTypesRes.data || [];
          if (propertyTypesRes.success && propertyTypesData.length > 0) {
            setPropertyTypes(['Any', ...propertyTypesData]);
          }
          
          const amenitiesData = amenitiesRes.amenities || amenitiesRes.data || [];
          if (amenitiesRes.success && amenitiesData.length > 0) {
            setAmenitiesList(amenitiesData);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({ ...preferences, [name]: value });
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build preferences object with unified keys
      const preferencesPayload = {
        propertyType: preferences.propertyType,
        budget: preferences.budget,
        location: preferences.location,
        bedrooms: preferences.bedrooms,
        bathrooms: preferences.bathrooms,
        amenities: preferences.amenities,
      };

      const response = await getPropertyRecommendations(preferencesPayload);

      // Fix: Check for recommendations array instead of response.success
      if (response && Array.isArray(response.recommendations)) {
        setRecommendations(response.recommendations);
      } else if (response && response.recommendations) {
        setRecommendations(response.recommendations);
      } else if (response && response.detail) {
        setError(response.detail);
      } else {
        setError('Failed to get recommendations');
      }
    } catch (error) {
      setError('Failed to connect to recommendation service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Improved Indian currency format function
  const formatIndianPrice = (price) => {
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
  console.log("Recommendations:", recommendations);
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="glass-morphism rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <h2 className="text-4xl font-bold mb-8 text-gray-800 relative">
          Find Your Dream Property
          <span className="text-sm font-normal text-gray-500 block mt-2">
            Discover properties that match your preferences
          </span>
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Search Criteria */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={preferences.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  name="location"
                  value={preferences.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Budget</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                name="budget"
                value={preferences.budget}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              >
                <option value="Any">Any</option>
                <option value="0-5000000">Under ₹50 Lac</option>
                <option value="5000000-10000000">₹50 Lac - ₹1 Cr</option>
                <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                <option value="20000000-999999999">Above ₹2 Cr</option>
              </select>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Property Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={preferences.bedrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="Any">Any</option>
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Bedroom' : 'Bedrooms'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <select
                  name="bathrooms"
                  value={preferences.bathrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="Any">Any</option>
                  {[1,2,3,4].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Bathroom' : 'Bathrooms'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Area Details */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Area Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Square Footage</label>
              <select
                name="squareFootage"
                value={preferences.squareFootage}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              >
                <option value="Any">Any</option>
                <option value="0-1000">Under 1000 sq.ft</option>
                <option value="1000-2000">1000-2000 sq.ft</option>
                <option value="2000-3000">2000-3000 sq.ft</option>
                <option value="3000-4000">3000-4000 sq.ft</option>
                <option value="4000-999999">Above 4000 sq.ft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesList.map(amenity => (
              <div key={amenity} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  value={amenity}
                  checked={preferences.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : 'Find Properties'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </form>

      {/* Results Section */}
      {recommendations.length > 0 && (
        <div className="mt-12 space-y-8">
          <h3 className="text-2xl font-bold text-gray-800">
            Recommended Properties
            <span className="text-sm font-normal text-gray-500 block mt-2">
              Found {recommendations.length} properties matching your criteria
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(property => (
              <div key={property.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover-scale">
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h4>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">{formatIndianPrice(property.price)}</p>
                  
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {property.bedrooms} BHK
                    </span>
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      {property.squareFeet} sq.ft
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {property.location}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default PropertySearch;
