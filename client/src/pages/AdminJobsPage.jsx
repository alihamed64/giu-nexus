import { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const categoryColors = {
  Frontend: "#27ae60", Backend: "#2980b9", "AI/ML": "#8e44ad",
  DevOps: "#16a085", "Data Engineering": "#e67e22", Other: "#95a5a6",
};

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs?limit=100")
      .then(res => setJobs(res.data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>All Job Listings</h1>
      <p style={{ color: "#666" }}>{jobs.length} total jobs</p>
      <div style={{ display: "grid", gap: "10px" }}>
        {jobs.map(job => (
          <div key={job._id} style={{ background: "white", padding: "15px 20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <span style={{ background: categoryColors[job.category] || "#95a5a6", color: "white", padding: "2px 8px", borderRadius: "20px", fontSize: "11px" }}>
                  {job.category}
                </span>
              </div>
              <p style={{ color: "#666", margin: "5px 0", fontSize: "14px" }}>{job.company} • {job.location} • {job.type}</p>
              <span style={{ color: job.status === "open" ? "green" : "red", fontSize: "13px" }}>● {job.status}</span>
            </div>
            <button onClick={() => deleteJob(job._id)}
              style={{ background: "#e53935", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminJobsPage;