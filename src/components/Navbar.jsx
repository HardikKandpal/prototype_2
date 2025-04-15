import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">🏠</span>
            <span>AI RealEstate</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/valuation" current={location.pathname === "/valuation"}>Property Valuation</NavLink>
            <NavLink to="/search" current={location.pathname === "/search"}>Find Properties</NavLink>
            <NavLink to="/market-analysis" current={location.pathname === "/market-analysis"}>Market Analysis</NavLink>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 pb-5 border-t border-blue-400">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/valuation" onClick={() => setIsMenuOpen(false)}>Property Valuation</MobileNavLink>
            <MobileNavLink to="/search" onClick={() => setIsMenuOpen(false)}>Find Properties</MobileNavLink>
            <MobileNavLink to="/market-analysis" onClick={() => setIsMenuOpen(false)}>Market Analysis</MobileNavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

// NavLink component for desktop navigation
const NavLink = ({ to, children, current }) => (
  <Link 
    to={to} 
    className={`px-3 py-2 rounded-md transition-all duration-300 ${
      current 
        ? 'bg-blue-800 text-white font-medium' 
        : 'hover:bg-blue-600 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

// MobileNavLink component for mobile navigation
const MobileNavLink = ({ to, children, onClick }) => (
  <Link 
    to={to} 
    className="block px-4 py-2 text-center hover:bg-blue-600 rounded-md transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;