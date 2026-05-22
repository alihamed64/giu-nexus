import { Link } from "react-router-dom";

const categoryColors = {
  Frontend: "#27ae60",
  Backend: "#2980b9",
  "AI/ML": "#8e44ad",
  DevOps: "#16a085",
  "Data Engineering": "#e67e22",
  Other: "#95a5a6",
};

const JobCard = ({ job, showScore }) => (
  <div style={{ border: "1px solid #eee", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "white" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <h3 style={{ margin: 0 }}>{job.title}</h3>
      <span style={{
        background: categoryColors[job.category] || "#95a5a6",
        color: "white", padding: "3px 10px", borderRadius: "20px", fontSize: "12px"
      }}>
        {job.category}
      </span>
    </div>
    <p style={{ color: "#666", margin: "8px 0" }}>{job.company}</p>
    <p style={{ color: "#888", fontSize: "14px" }}>📍 {job.location} • {job.type}</p>
    {showScore && job.score && (
      <p style={{ color: "#27ae60", fontSize: "13px", fontWeight: "bold" }}>
        Match: {Math.round(job.score * 100)}%
      </p>
    )}
    <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{
        background: job.status === "open" ? "#e8f5e9" : "#ffebee",
        color: job.status === "open" ? "#27ae60" : "#e53935",
        padding: "3px 10px", borderRadius: "20px", fontSize: "12px"
      }}>
        {job.status}
      </span>
      <Link to={`/jobs/${job._id}`} style={{ background: "#e94560", color: "white", padding: "8px 15px", borderRadius: "5px", textDecoration: "none", fontSize: "14px" }}>
        View Details
      </Link>
    </div>
  </div>
);

export default JobCard;