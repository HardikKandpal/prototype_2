import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, Calculator, Building2, Users, ArrowRight, MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredProperties = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: "$2,500,000",
    beds: 5,
    baths: 4,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 2,
    title: "Oceanfront Penthouse",
    location: "Miami Beach, FL",
    price: "$3,200,000",
    beds: 4,
    baths: 3.5,
    sqft: 3800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: 3,
    title: "Urban Smart Home",
    location: "Seattle, WA",
    price: "$1,800,000",
    beds: 3,
    baths: 2.5,
    sqft: 2500,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80"
  }
];

const marketStats = [
  { label: "Average Price", value: "$850,000", change: "+5.2%" },
  { label: "Properties Sold", value: "1,234", change: "+12.3%" },
  { label: "Days on Market", value: "45", change: "-8.5%" },
  { label: "Active Listings", value: "3,567", change: "+3.1%" }
];

const Home = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Find Your Dream Home with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
          >
            Leverage artificial intelligence to discover the perfect property
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter location or keyword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Price Range</option>
                  <option>$100k - $300k</option>
                  <option>$300k - $500k</option>
                  <option>$500k - $1M</option>
                  <option>$1M+</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Property Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Condo</option>
                  <option>Villa</option>
                </select>
                <button className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Real-Time Market Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-600">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} this month
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-lg text-gray-600">Discover how artificial intelligence revolutionizes your real estate journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-gray-50 shadow-sm"
            >
              <Brain className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Property Matcher</h3>
              <p className="text-gray-600 mb-4">Our AI analyzes your preferences and matches you with properties that perfectly align with your needs.</p>
              <Link to="/recommend" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
                Try it now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-gray-50 shadow-sm"
            >
              <Calculator className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Valuation</h3>
              <p className="text-gray-600 mb-4">Get accurate property valuations using our advanced AI algorithms and market data analysis.</p>
              <Link to="/valuation" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
                Value your property <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-6 rounded-xl bg-gray-50 shadow-sm"
            >
              <Search className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
              <p className="text-gray-600 mb-4">Access real-time market trends, price predictions, and investment opportunities.</p>
              <Link to="/market-analysis" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
                View insights <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link to="/properties" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
              View all properties <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <img src={property.image} alt={property.title} className="w-full h-64 object-cover" />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-2xl font-bold text-primary-600 mb-4">{property.price}</p>
                  <div className="flex justify-between text-gray-500">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready to Find Your Perfect Property?</h2>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-primary-900 hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;