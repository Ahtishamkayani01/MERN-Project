import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [uRes, cRes] = await Promise.all([
        fetch(`${API}/api/admin/users`, { headers: authHeaders }),
        fetch(`${API}/api/admin/contacts`, { headers: authHeaders }),
      ]);
      if (!uRes.ok || !cRes.ok) throw new Error("Fetch failed");
      const [u, c] = await Promise.all([uRes.json(), cRes.json()]);
      setUsers(u);
      setContacts(c);
    } catch {
      setError("Could not load data. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API}/api/admin/users/${id}`, { method: "DELETE", headers: authHeaders });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const deleteContact = async (id) => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`${API}/api/admin/contacts/${id}`, { method: "DELETE", headers: authHeaders });
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin <span>Dashboard</span></h1>
        <button className="btn btn-outline" onClick={fetchAll} style={{ width: "auto" }}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-num">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{users.filter((u) => u.isAdmin).length}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{contacts.length}</div>
          <div className="stat-label">Messages</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>
          👥 Users ({users.length})
        </button>
        <button className={`tab-btn${tab === "contacts" ? " active" : ""}`} onClick={() => setTab("contacts")}>
          📬 Messages ({contacts.length})
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Loading data…</div>
      ) : tab === "users" ? (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state">No users found</div></td></tr>
              ) : users.map((u, i) => (
                <tr key={u._id}>
                  <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                  <td>{u.userName}</td>
                  <td style={{ color: "var(--text2)" }}>{u.email}</td>
                  <td style={{ color: "var(--text2)" }}>{u.phone}</td>
                  <td>
                    <span className={`badge ${u.isAdmin ? "badge-admin" : "badge-user"}`}>
                      {u.isAdmin ? "ADMIN" : "USER"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteUser(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state">No messages yet</div></td></tr>
              ) : contacts.map((c, i) => (
                <tr key={c._id}>
                  <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                  <td>{c.username}</td>
                  <td style={{ color: "var(--text2)" }}>{c.email}</td>
                  <td style={{ color: "var(--text2)", maxWidth: 300 }}>{c.message}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteContact(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}