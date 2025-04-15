import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PropertyValuation from './components/PropertyValuation'; // Updated import path
import PropertySearchPage from './components/PropertySearch'; // Updated path
import MarketAnalysisPage from './components/MarketAnalysisPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/valuation" element={<PropertyValuation />} /> {/* Updated component name */}
            <Route path="/search" element={<PropertySearchPage />} />
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;