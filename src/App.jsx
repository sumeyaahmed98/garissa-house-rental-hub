import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Property from "./Property";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SignupForm from "./signupForm";
import LoginForm from "./LoginForm";
import RentalForm from "./Renthouse";
import AdminDashboard from "./admin/AdminDashboard";
import OwnerDashboard from "./owner/OwnerDashboard";
import Contact from "../Contact";

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "owner";

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} handleLogout={handleLogout} />
      
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/property" element={<Property />} />
          <Route path="/signup" element={<Signup />} />
           <Route path="/signupform" element={< SignupForm />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={isAdmin ? "/admin" : isOwner ? "/ownerdashboard" : "/"} /> : 
                <LoginForm setUser={setUser} /> 
            } 
          />
          <Route 
            path="/signupForm" 
            element={
              isAuthenticated ? 
                <Navigate to={isAdmin ? "/admin" : isOwner ? "/ownerdashboard" : "/"} /> : 
                <SignupForm setUser={setUser} /> 
            } 
          />
          
          {/* Admin is now public */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Still protected */}
          <Route 
            path="/ownerdashboard/*" 
            element={
              <ProtectedRoute requiredRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/renthouse" 
            element={
              <ProtectedRoute>
                <RentalForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
