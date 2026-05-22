import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Spinner from "../components/Spinner";

const categoryColors = {
  Frontend: "#27ae60", Backend: "#2980b9", "AI/ML": "#8e44ad",
  DevOps: "#16a085", "Data Engineering": "#e67e22", Other: "#95a5a6",
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(res => setJob(res.data.job))
      .catch(() => setError("Job not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      setMessage("Application submitted successfully!");
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.post(`/jobs/${id}/save`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1>{job.title}</h1>
          <p style={{ color: "#666", fontSize: "18px" }}>{job.company}</p>
        </div>
        <span style={{ background: categoryColors[job.category] || "#95a5a6", color: "white", padding: "5px 15px", borderRadius: "20px" }}>
          {job.category}
        </span>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", color: "#666" }}>
        <span>📍 {job.location}</span>
        <span>💼 {job.type}</span>
        {job.salary && <span>💰 ${job.salary}/month</span>}
        <span style={{ color: job.status === "open" ? "green" : "red" }}>● {job.status}</span>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Description</h3>
        <p>{job.description}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Requirements</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {job.requirements.map((req, i) => (
            <span key={i} style={{ background: "#f0f0f0", padding: "5px 12px", borderRadius: "20px", fontSize: "14px" }}>
              {req}
            </span>
          ))}
        </div>
      </div>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      {isAuthenticated && user?.role === "jobSeeker" && job.status === "open" && !message && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowModal(true)}
            style={{ padding: "10px 25px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
            Apply Now
          </button>
          <button onClick={handleSave}
            style={{ padding: "10px 25px", background: saved ? "#666" : "#2980b9", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {saved ? "Unsave" : "Save Job"}
          </button>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "500px" }}>
            <h3>Apply to {job.title}</h3>
            <textarea placeholder="Cover letter (optional)" value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              style={{ width: "100%", height: "150px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginBottom: "15px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleApply} disabled={applying}
                style={{ flex: 1, padding: "10px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: "10px", background: "#ccc", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;