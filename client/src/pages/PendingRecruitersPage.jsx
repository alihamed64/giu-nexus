import { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const PendingRecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users?role=recruiter&status=pending")
      .then(res => setRecruiters(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      setRecruiters(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>Pending Recruiter Approvals</h1>
      {recruiters.length === 0 ? <p style={{ color: "#666" }}>No pending recruiters.</p> : (
        <div style={{ display: "grid", gap: "15px" }}>
          {recruiters.map(r => (
            <div key={r._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{r.name}</h3>
                <p style={{ color: "#666", margin: "5px 0" }}>{r.email}</p>
                <p style={{ color: "#888", fontSize: "13px" }}>Registered: {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => updateStatus(r._id, "approved")}
                  style={{ background: "#27ae60", color: "white", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer" }}>
                  Approve
                </button>
                <button onClick={() => updateStatus(r._id, "rejected")}
                  style={{ background: "#e53935", color: "white", border: "none", padding: "8px 20px", borderRadius: "5px", cursor: "pointer" }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRecruitersPage;