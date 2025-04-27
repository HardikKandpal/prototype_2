import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { getMarketAnalysis, getLocations } from '../api';

interface MarketTrend {
  metric: string;
  value: number | string;
  change: string;
  isPositive: boolean;
}

interface ChartData {
  priceTrend?: string;
  inventory?: string;
}

interface HotNeighborhood {
  name: string;
  growth: string;
  medianPrice: number;
  pricePerSqFt: number;
}

interface AnalysisData {
  marketTrends?: MarketTrend[];
  charts?: ChartData;
  hotNeighborhoods?: HotNeighborhood[];
  insights?: string[];
}

const MarketAnalysisPage: React.FC = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [months, setMonths] = useState<number>(12);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        if (response && response.success && response.data) {
          setLocations(response.data);
          if (response.data.length > 0) {
            setSelectedLocation(response.data[0]);
          }
        } else {
          const fallbackLocations = [
            'Connaught Place', 'Vasant Kunj', 'Greater Kailash', 'Dwarka', 
            'Nehru Place', 'Pitampura', 'Rajouri Garden', 'Chattarpur'
          ];
          setLocations(fallbackLocations);
          setSelectedLocation(fallbackLocations[0]);
        }
      } catch {
        const fallbackLocations = [
          'Connaught Place', 'Vasant Kunj', 'Greater Kailash', 'Dwarka', 
          'Nehru Place', 'Pitampura', 'Rajouri Garden', 'Chattarpur'
        ];
        setLocations(fallbackLocations);
        setSelectedLocation(fallbackLocations[0]);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handleMonthsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonths(Number(e.target.value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const locationToSend = selectedLocation || '';
      const monthsToSend = months || 12;

      const response = await getMarketAnalysis({ location: locationToSend, months: monthsToSend });

      if (response && response.success && response.data) {
        setAnalysisData(response.data);
      } else {
        setError("Received invalid data from the server. Please try again.");
      }
    } catch {
      setError('Failed to fetch market analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="glass-morphism rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <h2 className="text-4xl font-bold mb-8 text-gray-800 relative">
          Real Estate Market Analysis
          <span className="text-sm font-normal text-gray-500 block mt-2">
            Explore market trends and insights to make informed decisions
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

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale mb-8 relative z-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Analyze Market Trends</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={months}
                  onChange={handleMonthsChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value={3}>Last 3 months</option>
                  <option value={6}>Last 6 months</option>
                  <option value={12}>Last 12 months</option>
                  <option value={24}>Last 24 months</option>
                  <option value={36}>Last 36 months</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
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
                      Analyzing...
                    </>
                  ) : 'Analyze Market'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {analysisData && !loading && (
          <div className="space-y-8 relative z-10">
            {/* Market Overview Section */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Market Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisData.marketTrends && analysisData.marketTrends.map((trend, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">{trend.metric}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {typeof trend.value === 'number' && trend.metric.includes('Price') ? formatCurrency(trend.value) : trend.value}
                    </div>
                    <div className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {typeof trend.change === 'string' && trend.change.includes('%')
                        ? trend.change
                        : formatPercentage(Number(trend.change))}
                      {trend.isPositive ? '↑' : '↓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Trends Chart */}
            {analysisData.charts && analysisData.charts.priceTrend && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Price Trends</h3>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                  <img 
                    src={`data:image/png;base64,${analysisData.charts.priceTrend}`} 
                    alt="Price Trends" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Inventory Levels Chart */}
            {analysisData.charts && analysisData.charts.inventory && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Inventory Levels</h3>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
                  <img 
                    src={`data:image/png;base64,${analysisData.charts.inventory}`} 
                    alt="Inventory Levels" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Hot Neighborhoods Section */}
            {analysisData.hotNeighborhoods && analysisData.hotNeighborhoods.length > 0 && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Hot Neighborhoods</h3>
                <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Neighborhood
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price Growth
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Median Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price per Sq.Ft.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analysisData.hotNeighborhoods.map((neighborhood, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {neighborhood.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={neighborhood.growth.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                              {neighborhood.growth}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatCurrency(neighborhood.medianPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatCurrency(neighborhood.pricePerSqFt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Market Insights Section */}
            {analysisData.insights && analysisData.insights.length > 0 && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover-scale">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Market Insights</h3>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <ul className="space-y-2">
                    {analysisData.insights.map((insight, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysisPage;
