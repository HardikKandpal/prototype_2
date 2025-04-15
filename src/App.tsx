import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import PropertySearch from './components/PropertySearch';
import PropertyValuation from './components/PropertyValuation';
// Update the import to use any type
import MarketAnalysisPage from './components/MarketAnalysisPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property-search" element={<PropertySearch />} />
            <Route path="/property-valuation" element={<PropertyValuation />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} PropTech AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;