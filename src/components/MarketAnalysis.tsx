import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketAnalysisParams {
  location: string;
  months: number;
}

// Update this interface to match the structure from the API
interface MarketData {
  priceGrowth: number;
  demandIndex: number;
  supplyIndex: number;
  averagePrice: number;
  trendPrediction: string;
  monthlyData: {
    month: string;
    averagePrice: number;
    transactions: number;
  }[];
  trendData: {
    date: string;
    averagePrice: number;
    volume: number;
  }[];
  forecast: {
    date: string;
    predictedPrice: number;
    confidence: number;
  }[];
  insights: string[];
}

const MarketAnalysis: React.FC = () => {
  const [params, setParams] = useState<MarketAnalysisParams>({
    location: 'South Delhi', // Set a default location
    months: 6
  });
  
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'months') {
      setParams({
        ...params,
        [name]: Number(value)
      });
    } else {
      setParams({
        ...params,
        [name]: value
      });
    }
  };
  
  // Generate mock data for demonstration
  const generateMockData = (location: string, months: number): MarketData => {
    const trendData = [];
    const forecast = [];
    const currentDate = new Date();
    
    // Generate historical data
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      
      const basePrice = 10000 + Math.random() * 3000;
      const growth = 1 + (0.02 * (months - i) / months);
      
      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        averagePrice: Math.round(basePrice * growth),
        volume: Math.round(100 + Math.random() * 100)
      });
    }
    
    // Generate forecast data
    for (let i = 1; i <= 6; i++) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() + i);
      
      const lastPrice = trendData[trendData.length - 1].averagePrice;
      const growth = 1 + (0.01 * i);
      
      forecast.push({
        date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        predictedPrice: Math.round(lastPrice * growth),
        confidence: 0.9 - (i * 0.05)
      });
    }
    
    // Calculate price growth
    const firstPrice = trendData[0].averagePrice;
    const lastPrice = trendData[trendData.length - 1].averagePrice;
    const priceGrowth = ((lastPrice / firstPrice) - 1) * 100;
    
    return {
      priceGrowth,
      demandIndex: 7.2,
      supplyIndex: 5.8,
      averagePrice: lastPrice,
      trendPrediction: priceGrowth > 5 ? "Rising" : priceGrowth < 0 ? "Falling" : "Stable",
      monthlyData: trendData.map(item => ({
        month: item.date,
        averagePrice: item.averagePrice,
        transactions: item.volume
      })),
      trendData,
      forecast,
      insights: [
        priceGrowth > 5 ? "Strong upward trend in prices" : 
        priceGrowth < 0 ? "Prices are declining in this area" : 
        "Market prices are relatively stable",
        `${location} shows ${trendData[trendData.length - 1].volume} transactions in the last month`,
        `Average property value in ${location} is expected to ${priceGrowth > 0 ? 'increase' : 'decrease'} by ${Math.abs(priceGrowth).toFixed(1)}% in the next 6 months`
      ]
    };
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Comment out or remove the API call that's causing the error
      // Instead, always use the mock data for now
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock data
      const mockData = generateMockData(params.location, params.months);
      setMarketData(mockData);
      
    } catch (error) {
      console.error('Error getting market analysis:', error);
      setError('Failed to connect to market analysis service. Please try again later.');
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
  
  // Render price chart function that uses the Line component
  const renderPriceChart = () => {
    if (!marketData || !marketData.monthlyData || marketData.monthlyData.length === 0) {
      return null;
    }
  
    const chartData = {
      labels: marketData.monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Average Price (₹/sq.ft)',
          data: marketData.monthlyData.map(item => item.averagePrice),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
        }
      ]
    };
  
    const options: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Price Trends in ${params.location} (Last ${params.months} months)`,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return formatIndianPrice(Number(value));
            }
          }
        }
      }
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <Line data={chartData} options={options} />
      </div>
    );
  };
  
  // Render forecast chart
  const renderForecastChart = () => {
    if (!marketData || !marketData.forecast || marketData.forecast.length === 0) {
      return null;
    }
    
    // Combine last 3 months of historical data with forecast data for continuity
    const historicalData = marketData.trendData.slice(-3);
    
    const chartData = {
      labels: [
        ...historicalData.map(item => item.date),
        ...marketData.forecast.map(item => item.date)
      ],
      datasets: [
        {
          label: 'Historical Price',
          data: [
            ...historicalData.map(item => item.averagePrice),
            ...marketData.forecast.map(() => null)
          ],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: false,
        },
        {
          label: 'Forecasted Price',
          data: [
            ...historicalData.map(() => null),
            ...marketData.forecast.map(item => item.predictedPrice)
          ],
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderDash: [5, 5],
          tension: 0.3,
          fill: false,
        }
      ]
    };
    
    const options: ChartOptions<'line'> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Price Forecast for ${params.location} (Next 6 months)`,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return formatIndianPrice(Number(value));
            }
          }
        }
      }
    };
    
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <Line data={chartData} options={options} />
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2">Real Estate Market Analysis</h1>
      <p className="text-center text-gray-600 mb-8">Get insights into property market trends in your area</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={params.location}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="e.g., South Delhi, Gurgaon"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Time Period (Months)</label>
            <select
              name="months"
              value={params.months}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
              <option value={24}>24 Months</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get Market Analysis'}
          </button>
        </div>
      </form>
      
      {marketData && (
        <div className="mt-8 p-6 border border-blue-200 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Market Analysis for {params.location}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Price Growth</h3>
              <p className={`text-2xl font-bold ${marketData.priceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.priceGrowth >= 0 ? '+' : ''}{marketData.priceGrowth.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Last {params.months} months</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Price</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatIndianPrice(marketData.averagePrice)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Per square foot</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Market Trend</h3>
              <p className="text-2xl font-bold text-purple-600">
                {marketData.trendPrediction}
              </p>
              <p className="text-sm text-gray-500 mt-1">Next 6 months forecast</p>
            </div>
          </div>
          
          {/* Price Trend Chart */}
          <h3 className="text-xl font-semibold mb-4">Historical Price Trends</h3>
          {renderPriceChart()}
          
          {/* Price Forecast Chart */}
          <h3 className="text-xl font-semibold mb-4">Price Forecast</h3>
          {renderForecastChart()}
          
          {/* Market Insights */}
          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h3 className="text-xl font-semibold mb-4">Market Insights</h3>
            <ul className="list-disc pl-5 space-y-2">
              {marketData.insights.map((insight, index) => (
                <li key={index} className="text-gray-700">{insight}</li>
              ))}
            </ul>
          </div>
          
          {/* Supply and Demand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Demand Index</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${(marketData.demandIndex / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {marketData.demandIndex < 4 ? 'Low demand' : 
                 marketData.demandIndex < 7 ? 'Moderate demand' : 'High demand'} 
                ({marketData.demandIndex}/10)
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Supply Index</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ width: `${(marketData.supplyIndex / 10) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {marketData.supplyIndex < 4 ? 'Low supply' : 
                 marketData.supplyIndex < 7 ? 'Moderate supply' : 'High supply'} 
                ({marketData.supplyIndex}/10)
              </p>
            </div>
          </div>
          
          {/* Transaction Volume */}
          <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction Volume</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketData.monthlyData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.transactions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatIndianPrice(item.averagePrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Show a message when no data is available */}
      {!loading && !marketData && !error && (
        <div className="mt-8 p-6 text-center">
          <p className="text-gray-600">Enter a location and time period to see market analysis</p>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;