import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Home, DollarSign, Users, MapPin, Building } from 'lucide-react';

const Recommend = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    propertyType: '',
    budget: '',
    location: '',
    bedrooms: '',
    amenities: []
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
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
            <Brain className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Property Recommender</h1>
            <p className="text-lg text-gray-600">Let our AI find your perfect property match</p>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((number) => (
              <div key={number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= number ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {number}
                </div>
                {number < 4 && (
                  <div className={`h-1 w-24 ${
                    step > number ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">What type of property are you looking for?</h2>
              <div className="grid grid-cols-2 gap-4">
                {['House', 'Apartment', 'Condo', 'Villa'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPreferences({ ...preferences, propertyType: type })}
                    className={`p-6 rounded-lg border-2 ${
                      preferences.propertyType === type
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-600'
                    }`}
                  >
                    <Building className="h-8 w-8 mb-2 text-primary-600" />
                    <div className="font-semibold">{type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">What's your budget range?</h2>
              <div className="space-y-4">
                {[
                  '$100k - $300k',
                  '$300k - $500k',
                  '$500k - $1M',
                  '$1M+'
                ].map((range) => (
                  <button
                    key={range}
                    onClick={() => setPreferences({ ...preferences, budget: range })}
                    className={`w-full p-4 rounded-lg border-2 ${
                      preferences.budget === range
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-600'
                    }`}
                  >
                    <div className="font-semibold">{range}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Where would you like to live?</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter city, neighborhood, or ZIP code"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600"
                  value={preferences.location}
                  onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {['New York', 'Los Angeles', 'Chicago', 'Miami'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setPreferences({ ...preferences, location: city })}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-600"
                    >
                      <MapPin className="h-6 w-6 mb-2 text-primary-600" />
                      <div className="font-semibold">{city}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Additional Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bedrooms
                  </label>
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-lg"
                    value={preferences.bedrooms}
                    onChange={(e) => setPreferences({ ...preferences, bedrooms: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Must-have Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Pool',
                      'Garage',
                      'Garden',
                      'Gym',
                      'Security',
                      'Parking'
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-600"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600"
                          checked={preferences.amenities.includes(amenity)}
                          onChange={(e) => {
                            const newAmenities = e.target.checked
                              ? [...preferences.amenities, amenity]
                              : preferences.amenities.filter((a) => a !== amenity);
                            setPreferences({ ...preferences, amenities: newAmenities });
                          }}
                        />
                        <span className="ml-2">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg hover:border-primary-600"
              >
                Back
              </button>
            )}
            <button
              onClick={step < 4 ? handleNext : () => console.log('Submit:', preferences)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 ml-auto"
            >
              {step < 4 ? 'Next' : 'Get Recommendations'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommend;