import { Link } from "react-router-dom";

function Navbar({ user }) {
  return (
    <nav style={{ backgroundColor: '#37435e' }} className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        
        <img src="/LL%20w.png" alt="LL logo" className="h-10 mr-2" />
        <h1 className="text-xl font-bold">Layer Lab</h1>
      </div>

      <ul className="flex gap-6">
        <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
        <li><Link to="/layer-lab" className="hover:text-gray-400">Layer-Lab</Link></li>
        <li><Link to="/auto-lab" className="hover:text-gray-400">Auto-Lab</Link></li>
        <li><Link to="/custom-service" className="hover:text-gray-400">Custom</Link></li>
        <li><Link to="/cart" className="hover:text-gray-400">Cart</Link></li>
        <li><Link to="/login" className="hover:text-gray-400">Login</Link></li>

        {/* Show Admin only if user is admin */}
        {user?.isAdmin && (
          <li><Link to="/admin" className="hover:text-gray-400">Admin</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
