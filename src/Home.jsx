import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="py-10 bg-black sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid items-center grid-cols-1 gap-y-8 lg:grid-cols-2 gap-x-16 xl:gap-x-24">
          <div className="relative mb-12">
            <img 
              className="w-full rounded-md border-2 border-gray-700" 
              src="https://webberstudio.com/wp-content/uploads/2023/02/Stunning-House-Design.jpg"
              alt="Luxury property in Garissa" 
            />
            <div className="absolute w-full max-w-xs px-4 -translate-x-1/2 sm:px-0 sm:max-w-sm left-1/2 -bottom-12">
              <div className="overflow-hidden bg-gray-900 rounded shadow-lg border border-gray-700">
                <div className="px-6 py-4">
                  <div className="flex items-center">
                    <p className="flex-shrink-0 text-3xl font-bold text-red-500 sm:text-4xl">95%</p>
                    <p className="pl-4 text-sm font-medium text-white sm:text-base">
                      Customer Satisfaction <br /> 
                      Across Garissa County
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full shadow-md border border-gray-700">
              <svg 
                className="w-8 h-8 text-red-500" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
            </div>
            
            <h2 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Premier Real Estate Solutions in Garissa County
            </h2>
            
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Garissa Real Estate Hub is revolutionizing property discovery in Northeastern Kenya. 
              Our platform specializes in connecting property owners with potential clients for:
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2 text-gray-300">
                  <strong>Wedding Venues:</strong> Grand ballrooms, outdoor gardens, and traditional spaces for ceremonies and receptions
                </span>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2 text-gray-300">
                  <strong>Residential Rentals:</strong> Modern apartments, family homes, and temporary accommodations
                </span>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2 text-gray-300">
                  <strong>Commercial Spaces:</strong> Offices, retail locations, and event venues for businesses
                </span>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2 text-gray-300">
                  <strong>Vacation Rentals:</strong> Short-term stays for visitors and tourists
                </span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">Why Choose Us?</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Verified listings with high-quality photos and detailed descriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Secure booking system with transparent pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Local expertise in Garissa's real estate market</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>24/7 customer support in English and Somali</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/property" 
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 rounded-md bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 focus:opacity-80 hover:shadow-lg hover:shadow-red-900/30"
              >
                Browse Properties
                <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                to="/host" 
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-gray-900 transition-all duration-200 rounded-md bg-gray-100 hover:bg-white focus:bg-white border border-gray-300"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;