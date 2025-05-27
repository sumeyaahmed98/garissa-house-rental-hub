import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, handleLogout }) {
    const isLoggedIn = !!user;

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

                        <div className="hidden lg:flex lg:items-center lg:ml-auto lg:space-x-10">
                            <Link to="/" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Home</Link>
                            <Link to="/about" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">About us</Link>
                            <Link to="/property" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Property</Link>
                            {isLoggedIn && (
                                <Link to="/renthouse" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Renthouse</Link>
                            )}
                            <Link to="/contact" className="text-base font-medium text-black transition duration-200 hover:text-blue-600">Contact us</Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-4 ml-10">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signupform"
                                        className="px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Nav */}
                    <nav className="pt-4 pb-6 bg-white border border-gray-200 rounded-md shadow-md lg:hidden">
                        <div className="flow-root">
                            <div className="flex flex-col px-6 -my-2 space-y-1">
                                <Link to="/" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Home</Link>
                                <Link to="/about" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">About</Link>
                                <Link to="/property" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Property</Link>
                                {isLoggedIn && (
                                    <Link to="/renthouse" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Renthouse</Link>
                                )}
                                <Link to="/signup" className="inline-flex py-2 text-base font-medium text-black hover:text-blue-600">Contact</Link>
                            </div>
                        </div>

                        <div className="px-6 mt-6 space-y-2">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block w-full text-center px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>
        </div>
    );
}

export default Navbar;
