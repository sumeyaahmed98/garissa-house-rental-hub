import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Property from "./Property";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SignupForm from "./signupForm";
import LoginForm from "./LoginForm";
import RentalForm from "./Renthouse";
import AdminDashboard from "../Admin";
import ContactUs from "../Contact";

function App() {
  // Manage user state
  const [user, setUser] = useState(null);

  // Simulate logout
  const handleLogout = () => {
    // You might also clear localStorage/sessionStorage here if used
    setUser(null);
    // Optionally redirect or show message
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/property" element={<Property />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupForm" element={<SignupForm setUser={setUser} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/renthouse" element={<RentalForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/contact" element={<ContactUs/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
