import { useState, useEffect } from "react";
import api from "../services/api";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/my")
      .then(res => setApplications(res.data.applications))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No applications yet.</p>
          <Link to="/jobs" style={{ color: "#e94560" }}>Browse jobs and apply!</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {applications.map(app => (
            <div key={app._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{app.job?.title}</h3>
                <p style={{ color: "#666", margin: "5px 0" }}>{app.job?.company} • {app.job?.type}</p>
                <p style={{ color: "#888", fontSize: "13px" }}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <ApplicationStatusBadge status={app.status} />
                <Link to={`/jobs/${app.job?._id}`} style={{ color: "#2980b9", fontSize: "13px" }}>View Job</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;