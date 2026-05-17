import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Spinner from "../components/Spinner";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/my-jobs")
      .then(res => setJobs(res.data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (user?.status === "pending") return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h2>⏳ Account Pending Approval</h2>
      <p>Your recruiter account is waiting for admin approval. You cannot post jobs yet.</p>
      <p>Please check back later.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Job Postings</h1>
        <Link to="/recruiter/jobs/create" style={{ background: "#e94560", color: "white", padding: "10px 20px", borderRadius: "5px", textDecoration: "none" }}>
          + Post New Job
        </Link>
      </div>

      {loading ? <Spinner /> : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p>No job postings yet.</p>
          <Link to="/recruiter/jobs/create">Create your first job posting!</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {jobs.map(job => (
            <div key={job._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <p style={{ color: "#666", margin: "5px 0" }}>{job.company} • {job.location}</p>
                <span style={{ background: job.status === "open" ? "#e8f5e9" : "#ffebee", color: job.status === "open" ? "#27ae60" : "#e53935", padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>
                  {job.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={`/recruiter/applicants/${job._id}`} style={{ background: "#2980b9", color: "white", padding: "8px 15px", borderRadius: "5px", textDecoration: "none", fontSize: "14px" }}>
                  View Applicants
                </Link>
                <Link to={`/recruiter/jobs/${job._id}/edit`} style={{ background: "#f39c12", color: "white", padding: "8px 15px", borderRadius: "5px", textDecoration: "none", fontSize: "14px" }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
