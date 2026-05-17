import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

const statusColors = { pending: "#f39c12", shortlisted: "#27ae60", rejected: "#e53935" };

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/${jobId}/applicants`)
      .then(res => setApplications(res.data.applications))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>Applicants</h1>
      {applications.length === 0 ? <p>No applicants yet.</p> : (
        <div style={{ display: "grid", gap: "15px" }}>
          {applications.map(app => (
            <div key={app._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{app.user?.name}</h3>
                  <p style={{ color: "#666", margin: "5px 0" }}>{app.user?.email}</p>
                  {app.user?.skills?.length > 0 && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
                      {app.user.skills.map((s, i) => (
                        <span key={i} style={{ background: "#e8f4fd", color: "#2980b9", padding: "3px 8px", borderRadius: "20px", fontSize: "12px" }}>{s}</span>
                      ))}
                    </div>
                  )}
                  {app.coverLetter && <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}><strong>Cover Letter:</strong> {app.coverLetter}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                  <span style={{ background: statusColors[app.status], color: "white", padding: "5px 12px", borderRadius: "20px", fontSize: "13px" }}>
                    {app.status}
                  </span>
                  <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)}
                    style={{ padding: "6px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer" }}>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsPage;