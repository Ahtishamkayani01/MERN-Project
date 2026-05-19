import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Signup() {
  const { storeToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.msg || "Registration failed");
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
    <section className="signup-section">
      <div className="card">
        <h1 className="card-title">Create account.</h1>
        <p className="card-sub">
          Already have one? <Link to="/login">Sign in</Link>
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: "Username", name: "userName", type: "text", placeholder: "John Doe" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Phone", name: "phone", type: "tel", placeholder: "+92 300 0000000" },
            { label: "Password", name: "password", type: "password", placeholder: "Min. 7 characters" },
          ].map(({ label, name, type, placeholder }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                className="form-input"
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>
      </div>
    </section>
  );
}