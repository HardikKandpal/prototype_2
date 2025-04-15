import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to AI RealEstate</h1>
        <p className="text-xl text-gray-600">Your intelligent real estate companion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Property Valuation Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Valuation</h2>
            <p className="text-gray-600 mb-4">
              Get an accurate estimate of your property's value using our advanced AI model.
            </p>
            <Link
              to="/valuation"
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Estimate Value
            </Link>
          </div>
        </div>

        {/* Property Search Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Properties</h2>
            <p className="text-gray-600 mb-4">
              Discover properties that match your preferences with our AI-powered recommendation system.
            </p>
            <Link
              to="/search"
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Search Properties
            </Link>
          </div>
        </div>

        {/* Market Analysis Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Market Analysis</h2>
            <p className="text-gray-600 mb-4">
              Explore real estate market trends and insights to make informed investment decisions.
            </p>
            <Link
              to="/market-analysis"
              className="block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Analyze Market
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;