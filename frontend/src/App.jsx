import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import LayerLab from "./pages/LayerLab";
import AutoLab from "./pages/AutoLab";
import CustomService from "./pages/CustomService";
import Cart from "./pages/Cart";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail";

/** Protect routes that require admin role. */
function AdminRoute() {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Admin />;
}

function AppRoutes() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <>
      <Navbar user={user ? { email: user.email, firstName: user.firstName, isAdmin } : null} onLogout={signOut} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layer-lab" element={<LayerLab />} />
        <Route path="/auto-lab" element={<AutoLab />} />
        <Route path="/custom-service" element={<CustomService />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
