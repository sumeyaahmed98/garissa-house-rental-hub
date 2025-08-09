import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm({ setUser }) {
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
            const res = await axios.get("http://localhost:3000/users", {
                params: {
                    email: formData.email,
                    password: formData.password
                }
            });

            if (res.data.length > 0) {
                // Set user data in App state
                setUser(res.data[0]); // assuming res.data[0] is user object
                alert("Login successful! Redirecting...");
                navigate("/renthouse");  // redirect to protected page
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please try again.");
        }
    };


    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-white">Login</h2>
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
                        Login
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-4">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-red-500 hover:underline">Sign up</a>
                </p>
            </div>
        </section>
    );
}

export default LoginForm;
