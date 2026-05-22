import { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: "", status: "" });

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (filter.role) params.role = filter.role;
    if (filter.status) params.status = filter.status;
    api.get("/users", { params })
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status } : u));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      <h1>All Users</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select value={filter.role} onChange={e => setFilter({ ...filter, role: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">All Roles</option>
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchUsers} style={{ padding: "8px 20px", background: "#2980b9", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Filter
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ display: "grid", gap: "10px" }}>
          {users.map(u => (
            <div key={u._id} style={{ background: "white", padding: "15px 20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{u.name}</h3>
                <p style={{ color: "#666", margin: "5px 0", fontSize: "14px" }}>{u.email} • {u.role}</p>
                <span style={{ background: u.status === "approved" ? "#d4edda" : u.status === "pending" ? "#fff3cd" : "#f8d7da", color: u.status === "approved" ? "#155724" : u.status === "pending" ? "#856404" : "#721c24", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>
                  {u.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {u.role === "recruiter" && u.status === "pending" && (
                  <button onClick={() => updateStatus(u._id, "approved")}
                    style={{ background: "#27ae60", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "13px" }}>
                    Approve
                  </button>
                )}
                <button onClick={() => deleteUser(u._id)}
                  style={{ background: "#e53935", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontSize: "13px" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;