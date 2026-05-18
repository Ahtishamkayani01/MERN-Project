import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        MERN<span>.</span>Dev
      </NavLink>

      <button className="hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

      <ul className={`nav-links${open ? " open" : ""}`} onClick={() => setOpen(false)}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>

        {isLoggedIn ? (
          <>
            {user?.isAdmin && (
              <li>
                <NavLink to="/admin">
                  Dashboard<span className="nav-badge">ADMIN</span>
                </NavLink>
              </li>
            )}
            <li>
              <button className="nav-btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/signup">Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}