import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import PropertyValuation from './components/PropertyValuation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Real Estate AI
                </h1>
              </div>
              <nav className="flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Home
                </Link>
                <Link to="/valuation" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                  Valuation
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/valuation" element={<PropertyValuation />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Real Estate AI</h3>
                <p className="text-gray-400">
                  Advanced property valuation powered by artificial intelligence
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/valuation" className="text-gray-400 hover:text-white transition-colors">
                      Get Valuation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-400">
                  Email: contact@realestate.ai<br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;