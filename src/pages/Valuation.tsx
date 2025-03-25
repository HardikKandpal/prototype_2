import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, MapPin, Ruler, Camera } from 'lucide-react';

const Valuation = () => {
  const [formData, setFormData] = useState({
    address: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    lotSize: '',
    recentRenovations: false,
    photos: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Valuation request:', formData);
    // Here you would typically send the data to your AI valuation service
  };

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calculator className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Property Valuation</h1>
            <p className="text-lg text-gray-600">Get an accurate AI-powered valuation for your property</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  placeholder="Enter your property address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  <option value="">Select type...</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  placeholder="e.g., 2000"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  placeholder="Number of bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  placeholder="Number of bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                    placeholder="Total area"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Drag and drop photos here, or click to select files
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload up to 10 photos of your property
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ ...formData, photos: files });
                  }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="renovations"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.recentRenovations}
                onChange={(e) => setFormData({ ...formData, recentRenovations: e.target.checked })}
              />
              <label htmlFor="renovations" className="ml-2 text-sm text-gray-700">
                Property has been renovated in the last 5 years
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Property Valuation
            </button>
          </form>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Accurate Valuations</h3>
            <p className="mt-2 text-gray-600">
              Our AI analyzes thousands of market data points for precise estimates
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <Home className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
            <p className="mt-2 text-gray-600">
              Get detailed market analysis and property value trends
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Location Analysis</h3>
            <p className="mt-2 text-gray-600">
              Understand how location impacts your property's value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valuation;