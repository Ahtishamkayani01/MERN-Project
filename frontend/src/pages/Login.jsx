import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    badge: "ADMIN",
    icon: "🛡️",
    email: "ahtishamkayani01@gmail.com",
    password: "Test@123",
    color: "#6c63ff",
    bg: "rgba(108,99,255,0.08)",
    border: "rgba(108,99,255,0.25)",
  },
];

export default function Login() {
  const { storeToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fillingIdx, setFillingIdx] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fillDemo = (acc, idx) => {
    setFillingIdx(idx);
    setForm({ email: acc.email, password: acc.password });
    setTimeout(() => setFillingIdx(null), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        storeToken(data.token);
        navigate("/");
      }
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="login-layout">
        {/* ── Demo panel ── */}
        <div className="demo-panel">
          <div className="demo-panel-inner">
            <p className="demo-eyebrow">🚀 Try it instantly</p>
            <h2 className="demo-heading">Demo&nbsp;Access</h2>
            <p className="demo-sub">
              Click any account to auto-fill credentials and explore the full app — no sign-up needed.
            </p>

            <div className="demo-cards">
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button
                  key={acc.label}
                  className={`demo-card${fillingIdx === i ? " filling" : ""}`}
                  style={{ "--dc": acc.color, "--db": acc.bg, "--dbo": acc.border }}
                  onClick={() => fillDemo(acc, i)}
                  type="button"
                >
                  <span className="demo-card-icon">{acc.icon}</span>
                  <div className="demo-card-body">
                    <div className="demo-card-top">
                      <span className="demo-card-label">{acc.label}</span>
                      <span className="demo-badge" style={{ color: acc.color, borderColor: acc.border, background: acc.bg }}>
                        {acc.badge}
                      </span>
                    </div>
                    <span className="demo-card-email">{acc.email}</span>
                    <span className="demo-card-pass">{acc.password}</span>
                  </div>
                  <span className="demo-card-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="demo-features">
              {[
                { icon: "👥", text: "View & manage all users" },
                { icon: "📬", text: "Read contact submissions" },
                { icon: "🗑️", text: "Delete records (admin only)" },
              ].map((f) => (
                <div key={f.text} className="demo-feature-row">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Login form ── */}
        <div className="card login-card">
          <h1 className="card-title">Welcome back.</h1>
          <p className="card-sub">
            No account? <Link to="/signup">Sign up</Link>
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}