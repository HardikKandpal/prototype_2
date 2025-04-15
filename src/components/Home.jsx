import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageStats, getFeaturedProperties, getNearbyProperties } from '../api';

const Home = () => {
  // State for data
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [priceGrowth, setPriceGrowth] = useState(0);
  const [priceTrendChart, setPriceTrendChart] = useState('');
  const [popularLocations, setPopularLocations] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    featured: true,
    nearby: false
  });
  const [error, setError] = useState({
    stats: null,
    featured: null,
    nearby: null
  });

  // Load stats and featured properties on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Get home page stats
        setLoading(prev => ({ ...prev, stats: true }));
        const statsData = await getHomePageStats();
        setPropertiesCount(statsData.total_properties);
        setAvgPrice(statsData.avg_price);
        setPriceGrowth(statsData.price_growth);
        setPopularLocations(statsData.popular_locations);
        setPriceTrendChart(statsData.price_trend_chart);
        setLoading(prev => ({ ...prev, stats: false }));
      } catch (err) {
        console.error('Error loading stats:', err);
        setError(prev => ({ ...prev, stats: 'Failed to load market statistics' }));
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // Get featured properties
        setLoading(prev => ({ ...prev, featured: true }));
        const featuredData = await getFeaturedProperties();
        setFeaturedProperties(featuredData);
        setLoading(prev => ({ ...prev, featured: false }));
      } catch (err) {
        console.error('Error loading featured properties:', err);
        setError(prev => ({ ...prev, featured: 'Failed to load featured properties' }));
        setLoading(prev => ({ ...prev, featured: false }));
      }
    };

    loadInitialData();
  }, []);

  // Function to handle location permission and fetch nearby properties
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          
          // Fetch nearby properties
          try {
            setLoading(prev => ({ ...prev, nearby: true }));
            const nearbyData = await getNearbyProperties(coords.lat, coords.lng);
            setNearbyProperties(nearbyData);
            setLoading(prev => ({ ...prev, nearby: false }));
          } catch (err) {
            console.error('Error loading nearby properties:', err);
            setError(prev => ({ ...prev, nearby: 'Failed to load nearby properties' }));
            setLoading(prev => ({ ...prev, nearby: false }));
          }
        },
        (error) => {
          console.log("Error obtaining location:", error);
          setError(prev => ({ ...prev, nearby: 'Please enable location services to see properties around you' }));
        }
      );
    } else {
      setError(prev => ({ ...prev, nearby: 'Geolocation is not supported by this browser' }));
    }
  };

  // Add testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Investor",
      content: "The AI-powered valuation tool helped me make confident investment decisions. Highly recommended!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "First-time Buyer",
      content: "Found my dream home within weeks using their smart search feature. The process was seamless!",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Modern home"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Dream Property with AI
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Leverage artificial intelligence to discover, evaluate, and track real estate properties that perfectly match your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/valuation"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
            >
              Get Property Valuation
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:text-lg"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Market Trends Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Market Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Price Trends</h3>
              {loading.stats ? (
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading chart...</div>
                </div>
              ) : priceTrendChart ? (
                <div className="h-64 rounded-lg overflow-hidden">
                  <img 
                    src={`data:image/png;base64,${priceTrendChart}`} 
                    alt="Price Trend Chart" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">Chart data unavailable</div>
                </div>
              )}
              
              {/* Market stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {loading.stats ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      new Intl.NumberFormat('en-IN').format(propertiesCount)
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Properties</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {loading.stats ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `₹${(avgPrice / 10000000).toFixed(1)} Cr`
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Avg. Price</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {loading.stats ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `+${priceGrowth}%`
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Annual Growth</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Localities</h3>
              {loading.stats ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse flex justify-between items-center p-3 bg-white rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : popularLocations.length > 0 ? (
                <div className="space-y-4">
                  {popularLocations.map(locality => (
                    <div key={locality.name} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">{locality.name}</span>
                      <span className="text-green-600">↑ {locality.growth}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-lg text-center text-gray-500">
                  No locality data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/search" className="text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>
          
          {loading.featured ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProperties.map(property => (
                <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-48 object-cover rounded-t-xl" 
                    />
                    <div className="absolute top-3 right-3 bg-indigo-600 px-2 py-1 rounded-lg text-xs font-medium text-white">
                      {property.tag}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="mr-3">{property.beds} Beds</span>
                      <span className="mr-3">{property.baths} Baths</span>
                      <span>{property.area} sq.ft</span>
                    </div>
                    {property.amenities && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {property.amenities.map(amenity => (
                          <span key={amenity} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-600">₹{property.price}</span>
                      <Link 
                        to={`/property/${property.id}`}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Properties Around You Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Properties Around You</h2>
              <p className="text-gray-600 mb-4 md:mb-0">
                {userLocation 
                  ? "Based on your current location" 
                  : "Enable location to see properties near you"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!userLocation && (
                <button 
                  onClick={requestLocationPermission}
                  className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Enable Location
                </button>
              )}
              <Link to="/search" className="text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </Link>
            </div>
          </div>
          
          {userLocation ? (
            loading.nearby ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : nearbyProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyProperties.map(property => (
                  <div key={property.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-48 object-cover rounded-t-xl" 
                      />
                      <div className="absolute top-3 right-3 bg-green-600 px-2 py-1 rounded-lg text-xs font-medium text-white">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {property.distance}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{property.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">₹{property.price}</span>
                        <Link 
                          to={`/property/${property.id}`}
                          className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">No properties found near your location.</p>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enable Location Services</h3>
              <p className="text-gray-600 mb-4">Allow location access to see properties in your area</p>
              <button 
                onClick={requestLocationPermission}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Enable Location
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Guides Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Property Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "First-Time Buyer's Guide",
                description: "Everything you need to know about buying your first property",
                icon: "📚"
              },
              {
                title: "Investment Strategy",
                description: "Learn how to build a profitable real estate portfolio",
                icon: "📈"
              },
              {
                title: "Legal Documentation",
                description: "Understanding property documentation and legal requirements",
                icon: "📋"
              }
            ].map(guide => (
              <div key={guide.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-4">{guide.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                <p className="text-gray-600 text-sm">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ready to Find Your Perfect Property?
          </h2>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Search Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;