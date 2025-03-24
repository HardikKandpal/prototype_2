import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Building2, Brain, Calculator, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AIEstate Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center text-gray-600 hover:text-primary-600">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/recommend" className="flex items-center text-gray-600 hover:text-primary-600">
              <Brain className="h-5 w-5 mr-1" />
              <span>AI Recommender</span>
            </Link>
            <Link to="/valuation" className="flex items-center text-gray-600 hover:text-primary-600">
              <Calculator className="h-5 w-5 mr-1" />
              <span>Valuation</span>
            </Link>
            <Link to="/login" className="flex items-center px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">
              <LogIn className="h-5 w-5 mr-1" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Home</span>
            </Link>
            <Link
              to="/recommend"
              className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Brain className="h-5 w-5 mr-2" />
              <span>AI Recommender</span>
            </Link>
            <Link
              to="/valuation"
              className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Calculator className="h-5 w-5 mr-2" />
              <span>Valuation</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-5 w-5 mr-2" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;