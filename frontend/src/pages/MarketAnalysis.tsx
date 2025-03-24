import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, Map, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MarketAnalysis = () => {
  const marketTrends = [
    {
      metric: "Median Home Price",
      value: "$425,000",
      change: "+5.2%",
      isPositive: true
    },
    {
      metric: "Days on Market",
      value: "35 days",
      change: "-12.5%",
      isPositive: false
    },
    {
      metric: "Available Listings",
      value: "1,234",
      change: "+3.8%",
      isPositive: true
    },
    {
      metric: "Price per Sq Ft",
      value: "$255",
      change: "+4.7%",
      isPositive: true
    }
  ];

  const hotNeighborhoods = [
    {
      name: "Downtown West",
      priceChange: "+8.5%",
      avgPrice: "$550,000",
      inventory: "45 listings"
    },
    {
      name: "East Village",
      priceChange: "+7.2%",
      avgPrice: "$425,000",
      inventory: "32 listings"
    },
    {
      name: "Harbor Heights",
      priceChange: "+6.8%",
      avgPrice: "$675,000",
      inventory: "28 listings"
    }
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="h-16 w-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Real Estate Market Analysis</h1>
            <p className="text-lg text-gray-600">AI-powered insights into your local real estate market</p>
          </motion.div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {marketTrends.map((trend, index) => (
            <motion.div
              key={trend.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-gray-500 text-sm font-medium">{trend.metric}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{trend.value}</p>
                <p className={`ml-2 flex items-center text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.change}
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 ml-1" />
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Price Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Price Trends</h2>
              <select className="border-2 border-gray-200 rounded-lg px-3 py-1">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>Last 2 years</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center">
              <PieChart className="h-12 w-12 text-gray-400" />
              <p className="ml-4 text-gray-500">Chart visualization will be implemented here</p>
            </div>
          </motion.div>

          {/* Market Heat Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Heat Map</h2>
            <div className="h-64 flex items-center justify-center">
              <Map className="h-12 w-12 text-gray-400" />
              <p className="ml-4 text-gray-500">Interactive heat map will be implemented here</p>
            </div>
          </motion.div>
        </div>

        {/* Hot Neighborhoods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hot Neighborhoods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotNeighborhoods.map((neighborhood, index) => (
              <div
                key={neighborhood.name}
                className="border-2 border-gray-100 rounded-lg p-4"
              >
                <Building2 className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">{neighborhood.name}</h3>
                <p className="text-green-600 font-medium">{neighborhood.priceChange} price growth</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Avg. Price: {neighborhood.avgPrice}</p>
                  <p>Available: {neighborhood.inventory}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary-900 rounded-xl shadow-lg p-8 text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">AI Market Insights</h2>
          <p className="text-lg mb-6">
            Based on our AI analysis, the market is showing strong growth potential in the following areas:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <ArrowUpRight className="h-6 w-6 mr-2 flex-shrink-0" />
              <span>Luxury condos in downtown area showing 12% higher demand compared to last quarter</span>
            </li>
            <li className="flex items-start">
              <ArrowUpRight className="h-6 w-6 mr-2 flex-shrink-0" />
              <span>Single-family homes in suburban areas experiencing faster sales cycles</span>
            </li>
            <li className="flex items-start">
              <ArrowUpRight className="h-6 w-6 mr-2 flex-shrink-0" />
              <span>Investment opportunities identified in emerging neighborhoods with new development projects</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketAnalysis;