import React, { useState } from 'react';
import { getPropertyValuation } from '../api';

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

const PropertyValuation: React.FC = () => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    propertyType: '',
    location: '',
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    yearBuilt: 2000,
    lotSize: 0,
    renovationStatus: 'None'
  });
  
  const [valuation, setValuation] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    if (['bedrooms', 'bathrooms', 'squareFeet', 'yearBuilt', 'lotSize', 'renovationYear'].includes(name)) {
      setPropertyDetails({
        ...propertyDetails,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setPropertyDetails({
        ...propertyDetails,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPropertyValuation(propertyDetails);
      
      if (response.success) {
        setValuation(response.data.estimatedValue);
      } else {
        setError(response.error || 'Failed to get property valuation');
      }
    } catch (error) {
      console.error('Error getting property valuation:', error);
      setError('Failed to connect to valuation service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function for Indian currency format
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
      <h1 className="text-3xl font-bold text-center mb-2">Property Valuation Tool</h1>
      <p className="text-center text-gray-600 mb-8">Get an estimated value for your property</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Property Type</label>
            <select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Builder Floor">Builder Floor</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={propertyDetails.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="e.g., South Delhi, Gurgaon"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={propertyDetails.bedrooms}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={propertyDetails.bathrooms}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Square Feet</label>
            <input
              type="number"
              name="squareFeet"
              value={propertyDetails.squareFeet}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              min="100"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Year Built</label>
            <input
              type="number"
              name="yearBuilt"
              value={propertyDetails.yearBuilt}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              min="1900"
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Lot Size (sq.ft)</label>
            <input
              type="number"
              name="lotSize"
              value={propertyDetails.lotSize}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Renovation Status</label>
            <select
              name="renovationStatus"
              value={propertyDetails.renovationStatus}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="None">None</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
          </div>
          
          {propertyDetails.renovationStatus !== 'None' && (
            <div>
              <label className="block text-gray-700 mb-2">Renovation Year</label>
              <input
                type="number"
                name="renovationYear"
                value={propertyDetails.renovationYear || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Get Property Valuation'}
          </button>
        </div>
      </form>
      
      {valuation !== null && (
        <div className="mt-8 p-6 border border-green-200 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-2">Estimated Property Value</h2>
          <p className="text-3xl font-bold text-center text-green-600">
            {formatIndianPrice(valuation)}
          </p>
          <p className="text-center text-gray-600 mt-2">
            This is an AI-generated estimate based on the provided details
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyValuation;
