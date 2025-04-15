import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PropertyValuation from './components/PropertyValuation';
// Update the import for PropertySearchPage if the file exists with a different name
// or create this component if it doesn't exist
import PropertySearch from './components/PropertySearch'; // Changed from PropertySearchPage
import MarketAnalysisPage from './components/MarketAnalysisPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/valuation" element={<PropertyValuation />} />
            <Route path="/search" element={<PropertySearch />} /> {/* Updated component name */}
            <Route path="/market-analysis" element={<MarketAnalysisPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;