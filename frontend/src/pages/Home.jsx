import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🔐", title: "JWT Auth", desc: "Secure login & signup with JSON Web Tokens and bcrypt password hashing." },
  { icon: "🛡️", title: "Admin Panel", desc: "Full dashboard to view and manage all users and contact submissions." },
  { icon: "📬", title: "Contact Form", desc: "Messages saved to MongoDB and accessible via the admin dashboard." },
  { icon: "⚡", title: "REST API", desc: "Express backend with clean controllers, middlewares, and Zod validation." },
];

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">MERN Stack Portfolio Project</p>
        <h1 className="hero-title">
          Full-Stack Dev<br />
          <span className="grad">Built Different.</span>
        </h1>
        <p className="hero-desc">
          A complete MERN stack application showcasing authentication, admin dashboards,
          MongoDB data management, and a clean REST API — all production-ready.
        </p>
        <div className="hero-ctas">
          {isLoggedIn ? (
            <>
              <span style={{ color: "var(--text2)", fontSize: "0.85rem", alignSelf: "center" }}>
                Welcome back{user?.isAdmin ? ", Admin 👋" : ""}
              </span>
              {user?.isAdmin && (
                <Link to="/admin" className="btn btn-primary" style={{ width: "auto" }}>
                  Open Dashboard →
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ width: "auto" }}>
                Get Started →
              </Link>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="features-grid">
        {features.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}