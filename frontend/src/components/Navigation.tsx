import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl">PropTech AI</Link>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              >
                Home
              </Link>
              <Link 
                to="/property-search" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/property-search')}`}
              >
                Property Search
              </Link>
              <Link 
                to="/property-valuation" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/property-valuation')}`}
              >
                Property Valuation
              </Link>
              <Link 
                to="/market-analysis" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/market-analysis')}`}
              >
                Market Analysis
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;