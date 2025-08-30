import React, { useState } from "react";
import { Link } from "react-router-dom";
import AvatarMenu from "./components/AvatarMenu";
import { useAuth } from "./context/AuthContext";
import { FiChevronDown, FiUser, FiHome } from "react-icons/fi";

function Navbar() {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const [showSignupDropdown, setShowSignupDropdown] = useState(false);

    return (
        <div>
            <header className="pb-6 bg-white lg:pb-0">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex">
                                <img
                                    className="w-auto h-8 lg:h-10"
                                    src="https://media.istockphoto.com/id/938930456/vector/gold-real-estate-houses-icon-vector-design.jpg?s=612x612&w=0&k=20&c=8zyI2Mqp7SpuCIVrWj6vZS3Z0qJmY5R8Bu8k8CooZaU="
                                    alt="Logo"
                                />
                            </Link>
                        </div>

                        {/* Centered Links */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-10 mx-auto">
                            <Link to="/" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Home</Link>
                            <Link to="/about" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">About us</Link>
                            <Link to="/property" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Property</Link>
                            {isLoggedIn && (
                                <Link to="/renthouse" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Renthouse</Link>
                            )}
                            <Link to="/contact" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Contact us</Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-4">
                            {isLoggedIn ? (
                                <AvatarMenu />
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                    
                                    {/* Signup Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowSignupDropdown(!showSignupDropdown)}
                                            className="px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                                        >
                                            Sign up
                                            <FiChevronDown className="ml-1 w-4 h-4" />
                                        </button>
                                        
                                        {showSignupDropdown && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                                                <Link
                                                    to="/tenant-signup"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowSignupDropdown(false)}
                                                >
                                                    <FiUser className="mr-2 w-4 h-4 text-blue-500" />
                                                    Find a Home
                                                </Link>
                                                <Link
                                                    to="/owner-signup"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowSignupDropdown(false)}
                                                >
                                                    <FiHome className="mr-2 w-4 h-4 text-green-500" />
                                                    List Property
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Link
                                        to="/admin/login"
                                        className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Admin
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Nav */}
                    <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
                        <div className="flow-root">
                            <div className="flex flex-col px-6 -my-2 space-y-1 text-center">
                                <Link to="/" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Home</Link>
                                <Link to="/about" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">About</Link>
                                <Link to="/property" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Property</Link>
                                {isLoggedIn && (
                                    <Link to="/renthouse" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Renthouse</Link>
                                )}
                                <Link to="/contact" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Contact</Link>
                            </div>
                        </div>

                        <div className="px-6 mt-6 space-y-2">
                            {isLoggedIn ? (
                                <div className="flex justify-center"><AvatarMenu /></div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/tenant-signup"
                                        className="block w-full text-center px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        Find a Home
                                    </Link>
                                    <Link
                                        to="/owner-signup"
                                        className="block w-full text-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        List Property
                                    </Link>
                                    <Link
                                        to="/admin/login"
                                        className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Admin Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
            
            {/* Click outside to close dropdown */}
            {showSignupDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSignupDropdown(false)}
                />
            )}
        </div>
    );
}

export default Navbar;
