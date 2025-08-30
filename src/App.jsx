import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Property from "./Property";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RentalForm from "./Renthouse";
import AdminDashboard from "./admin/AdminDashboard";
import OwnerDashboard from "./owner/OwnerDashboard";
import TenantDashboard from "./tenant/TenantDashboard";
import Contact from "../Contact";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TenantSignup from "./pages/TenantSignup.jsx";
import OwnerSignup from "./pages/OwnerSignup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import { useAuth } from "./context/AuthContext.jsx";


function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tenant-signup" element={<TenantSignup />} />
          <Route path="/owner-signup" element={<OwnerSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Public routes - no login required */}
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />
          <Route path="/property" element={<Property />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected routes - require login */}
          <Route path="/admin/*" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/ownerdashboard/*" element={<RequireAuth><OwnerDashboard /></RequireAuth>} />
          <Route path="/tenantdashboard/*" element={<RequireAuth><TenantDashboard /></RequireAuth>} />
          <Route path="/renthouse" element={<RequireAuth><RentalForm /></RequireAuth>} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
