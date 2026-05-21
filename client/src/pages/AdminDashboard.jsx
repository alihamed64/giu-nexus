import { useState, useEffect } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <p>Failed to load stats</p>;

  const usersByRole = {};
  stats.usersByRole?.forEach(r => { usersByRole[r._id] = r.count; });
  const jobsByStatus = {};
  stats.jobsByStatus?.forEach(j => { jobsByStatus[j._id] = j.count; });
  const appsByStatus = {};
  stats.appsByStatus?.forEach(a => { appsByStatus[a._id] = a.count; });

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {[
          { label: "Job Seekers", value: usersByRole.jobSeeker || 0, color: "#2980b9" },
          { label: "Recruiters", value: usersByRole.recruiter || 0, color: "#27ae60" },
          { label: "Open Jobs", value: jobsByStatus.open || 0, color: "#f39c12" },
          { label: "Closed Jobs", value: jobsByStatus.closed || 0, color: "#95a5a6" },
          { label: "Pending Apps", value: appsByStatus.pending || 0, color: "#e67e22" },
          { label: "Shortlisted", value: appsByStatus.shortlisted || 0, color: "#27ae60" },
          { label: "Rejected Apps", value: appsByStatus.rejected || 0, color: "#e53935" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", textAlign: "center" }}>
            <h2 style={{ color: stat.color, margin: 0, fontSize: "36px" }}>{stat.value}</h2>
            <p style={{ color: "#666", margin: "5px 0" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <h2>🏆 Top Jobs by Applications</h2>
      <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        {stats.topJobs?.map((job, i) => (
          <div key={job._id} style={{ padding: "15px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
            <span>#{i + 1} {job.title} — {job.company}</span>
            <span style={{ color: "#e94560", fontWeight: "bold" }}>{job.applicationCount} applicants</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;