import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import LayerLab from "./pages/LayerLab";
import AutoLab from "./pages/AutoLab";
import CustomService from "./pages/CustomService";
import Cart from "./pages/Cart";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null); // track logged-in user

  return (
    <Router>
      <Navbar user={user} />   {/* pass user to Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layer-lab" element={<LayerLab />} />
        <Route path="/auto-lab" element={<AutoLab />} />
        <Route path="/custom-service" element={<CustomService />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Home />} /> {/* protect route */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
