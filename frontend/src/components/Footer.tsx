import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">AIEstate Pro</span>
            </Link>
            <p className="mt-4 text-sm">
              Revolutionizing real estate with artificial intelligence. Find your perfect property match today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-primary-500 transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/agents" className="hover:text-primary-500 transition-colors">Agents</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recommend" className="hover:text-primary-500 transition-colors">AI Recommender</Link>
              </li>
              <li>
                <Link to="/valuation" className="hover:text-primary-500 transition-colors">Property Valuation</Link>
              </li>
              <li>
                <Link to="/market-analysis" className="hover:text-primary-500 transition-colors">Market Analysis</Link>
              </li>
              <li>
                <Link to="/investment" className="hover:text-primary-500 transition-colors">Investment Guide</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: contact@aiestatepro.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 AI Street, Digital City</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AIEstate Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;