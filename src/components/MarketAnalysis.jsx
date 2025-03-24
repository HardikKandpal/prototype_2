import { useState, useEffect } from 'react';
import { getMarketAnalysis, getLocations } from '../lib/api';

const MarketAnalysis = () => {
  const [locations, setLocations] = useState([
    'Connaught Place', 'Vasant Kunj', 'Greater Kailash', 'Chanakyapuri',
    'Dwarka', 'Nehru Place', 'Preet Vihar', 'Pitampura', 
    'Rajouri Garden', 'Karol Bagh', 'Chattarpur'
  ]);
  
  const [filters, setFilters] = useState({
    neighborhood: '',
    startDate: '2021-01',
    endDate: '2023-12',
    metrics: ['Median Home Price']
  });
  
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const availableMetrics = [
    'Median Home Price',
    'Number of Sales',
    'Days on Market',
    'Price per Square Foot',
    'Inventory Levels',
    'Year-over-Year Price Change'
  ];
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsRes = await getLocations();
        
        if (locationsRes.locations && locationsRes.locations.length > 0) {
          setLocations(locationsRes.locations);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
        // Using default values, so no need to show error
      }
    };
    
    fetchLocations();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const handleMetricChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFilters({ 
        ...filters, 
        metrics: [...filters.metrics, value] 
      });
    } else {
      setFilters({
        ...filters,
        metrics: filters.metrics.filter(metric => metric !== value)
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMarketAnalysis({
        neighborhood: filters.neighborhood,
        start_date: filters.startDate,
        end_date: filters.endDate,
        metrics: filters.metrics
      });
      
      console.log("Market analysis response:", response);
      
      if (response.success && response.data) {
        setAnalysisData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error("Error submitting market analysis:", err);
      setError("Failed to get market analysis data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Real Estate Market Analysis</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhood</label>
            <select 
              name="neighborhood" 
              value={filters.neighborhood} 
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Neighborhood</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <select
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {Array.from({ length: 36 }, (_, i) => {
                const year = 2021 + Math.floor(i / 12);
                const month = (i % 12) + 1;
                const value = `${year}-${month.toString().padStart(2, '0')}`;
                return (
                  <option key={value} value={value}>
                    {`${year}-${month.toString().padStart(2, '0')}`}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <select
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {Array.from({ length: 36 }, (_, i) => {
                const year = 2021 + Math.floor(i / 12);
                const month = (i % 12) + 1;
                const value = `${year}-${month.toString().padStart(2, '0')}`;
                return (
                  <option key={value} value={value}>
                    {`${year}-${month.toString().padStart(2, '0')}`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metrics to Display</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableMetrics.map(metric => (
              <div key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  id={`metric-${metric}`}
                  value={metric}
                  checked={filters.metrics.includes(metric)}
                  onChange={handleMetricChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`metric-${metric}`} className="ml-2 text-sm text-gray-700">
                  {metric}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Analyze Market'}
          </button>
        </div>
      </form>
      
      {loading && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">Loading market analysis...</p>
        </div>
      )}
      
      // In the render section where you display the analysis results
      {analysisData && !loading && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Market Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filters.metrics.map(metric => {
              const metricKey = metric.toLowerCase().replace(/ /g, '_');
              const metricData = analysisData.summary && analysisData.summary[metricKey];
              
              return (
                <div key={metric} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">{metric}</h4>
                  {metricData ? (
                    <>
                      <p className="text-gray-600">
                        Average: {metricData.average !== null ? metricData.average.toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Min: {metricData.min !== null ? metricData.min.toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Max: {metricData.max !== null ? metricData.max.toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        Trend: {metricData.trend || 'N/A'}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-600">No data available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;