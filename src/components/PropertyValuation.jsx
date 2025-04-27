import React, { useState } from 'react';
import { getPropertyValuation } from '../api';
useEffect(() => {
  console.log("[PropertyValuation.jsx] Component mounted");
}, []);
const PropertyValuation = () => {
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: '',
    neighborhood: '',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    renovationStatus: 'Not Renovated',
    renovationYear: '',
    amenities: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [valuation, setValuation] = useState(null);

  const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Builder Floor'];
  const locations = ['Saket', 'Vasant Kunj', 'Greater Kailash', 'Dwarka', 'Rohini'];
  const amenitiesList = ['Parking', 'Garden', 'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Club House', 'Park'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (e) => {
    const amenity = e.target.value;
    setPropertyDetails(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedDetails = {
        property_type: propertyDetails.propertyType,
        neighborhood: propertyDetails.neighborhood,
        bedrooms: Number(propertyDetails.bedrooms),
        bathrooms: Number(propertyDetails.bathrooms),
        square_footage: Number(propertyDetails.squareFeet),
        lot_size: Number(propertyDetails.lotSize),
        year_built: Number(propertyDetails.yearBuilt),
        renovation_status: propertyDetails.renovationStatus,
        renovation_year: propertyDetails.renovationYear ? Number(propertyDetails.renovationYear) : null,
        property_features: propertyDetails.amenities.join(', ')
      };

      console.log("Sending property details:", formattedDetails);
      const response = await getPropertyValuation(formattedDetails);
      console.log("Received response:", response);
      
      // The backend returns { predicted_price, status } directly, not wrapped in a success property
      if (response && response.predicted_price) {
        setValuation({
          predictedValue: response.predicted_price,
          lowerBound: response.predicted_price * 0.9,
          upperBound: response.predicted_price * 1.1,
          pricePerSqFt: response.predicted_price / propertyDetails.squareFeet
        });
      } else {
        setError(response.error || 'Failed to get property valuation');
      }
    } catch (err) {
      console.error('Error getting valuation:', err);
      setError('Failed to get property valuation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="glass-morphism rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <h2 className="text-4xl font-bold mb-8 text-gray-800 relative">
          Property Valuation
          <span className="text-sm font-normal text-gray-500 block mt-2">
            Get an instant AI-powered estimate for your property
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
            {/* Basic Details Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    name="propertyType"
                    value={propertyDetails.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    name="neighborhood"
                    value={propertyDetails.neighborhood}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
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
                    value={propertyDetails.bedrooms}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Bedroom' : 'Bedrooms'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <select
                    name="bathrooms"
                    value={propertyDetails.bathrooms}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  >
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={propertyDetails.squareFeet}
                    onChange={handleInputChange}
                    min="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size (sq.ft)</label>
                  <input
                    type="number"
                    name="lotSize"
                    value={propertyDetails.lotSize}
                    onChange={handleInputChange}
                    min="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Renovation Details */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Renovation Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renovation Status</label>
                  <select
                    name="renovationStatus"
                    value={propertyDetails.renovationStatus}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="Not Renovated">Not Renovated</option>
                    <option value="Partially Renovated">Partially Renovated</option>
                    <option value="Fully Renovated">Fully Renovated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renovation Year</label>
                  <input
                    type="number"
                    name="renovationYear"
                    value={propertyDetails.renovationYear}
                    onChange={handleInputChange}
                    min="1980"
                    max="2023"
                    placeholder="Leave empty if not renovated"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Property Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    value={amenity}
                    checked={propertyDetails.amenities.includes(amenity)}
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
                    Calculating...
                  </>
                ) : 'Get Property Valuation'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </form>

        {/* Valuation Results */}
        {valuation && (
          <div className="mt-12 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-3xl font-bold mb-8 text-gray-800">
              Valuation Results
              <span className="text-sm font-normal text-gray-500 block mt-2">Based on current market data</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Estimated Value</div>
                <div className="text-3xl font-bold text-gray-900">{formatIndianPrice(valuation.predictedValue)}</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Price Range</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatIndianPrice(valuation.lowerBound)} - {formatIndianPrice(valuation.upperBound)}
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Price per sq.ft</div>
                <div className="text-xl font-semibold text-gray-900">{formatIndianPrice(valuation.pricePerSqFt)}/sq.ft</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyValuation;
