import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/users", formData);
            alert("Signup successful! Redirecting to login...");
            navigate("/login");
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-white">Create an account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 bg-gray-700 text-white rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-3 bg-gray-700 text-white rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-4">
                    Already have an account?{" "}
                    <Link
                    to="/login" className="text-red-500 hover:underline">Login</Link>
                </p>
            </div>
        </section>
    );
}

export default Signup;
