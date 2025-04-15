import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">AI RealEstate</Link>
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/valuation" className="hover:text-blue-200 transition-colors">Property Valuation</Link>
            <Link to="/search" className="hover:text-blue-200 transition-colors">Find Properties</Link>
            <Link to="/market-analysis" className="hover:text-blue-200 transition-colors">Market Analysis</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;