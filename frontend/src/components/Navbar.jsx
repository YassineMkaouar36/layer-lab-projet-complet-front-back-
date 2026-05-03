import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <nav
      style={{ backgroundColor: "#37435e" }}
      className="text-white px-6 py-4 flex justify-between items-center"
    >
      {/* Logo */}
      <div className="flex items-center">
        <img src="/LL%20w.png" alt="LL logo" className="h-10 mr-2" />
        <h1 className="text-xl font-bold">Layer Lab</h1>
      </div>

      {/* Navigation links */}
      <ul className="flex gap-6 items-center">
        <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
        <li><Link to="/layer-lab" className="hover:text-gray-300 transition-colors">Layer-Lab</Link></li>
        <li><Link to="/auto-lab" className="hover:text-gray-300 transition-colors">Auto-Lab</Link></li>
        <li><Link to="/custom-service" className="hover:text-gray-300 transition-colors">Custom</Link></li>
        <li><Link to="/cart" className="hover:text-gray-300 transition-colors">Cart</Link></li>

        {/* Admin link — only for admins */}
        {user?.isAdmin && (
          <li>
            <Link to="/admin" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </li>
        )}

        {/* Auth section */}
        {user ? (
          <li className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:block">
               {user.firstName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Log In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
