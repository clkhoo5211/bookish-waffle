import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[#00a19c] mb-4">RVM Web3</h3>
            <p className="text-gray-600 text-sm">
              Progressive Web App for cryptocurrency payments via Web3
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1e293c] mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#00a19c] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#00a19c] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#00a19c] transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1e293c] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#00a19c] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00a19c] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} RVM Web3 Payment PWA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

