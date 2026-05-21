import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/jobs/recommended")
      .then(res => setJobs(res.data.jobs))
      .catch(() => setError("Failed to load recommendations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>🤖 Recommended Jobs For You</h1>
      <p style={{ color: "#666", marginBottom: "25px" }}>Jobs ranked by AI similarity to your skills</p>

      {loading ? <Spinner /> : error ? <p style={{ color: "red" }}>{error}</p> :
        jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>No recommendations yet.</p>
            <Link to="/profile" style={{ color: "#e94560" }}>Extract your skills from your bio first!</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {jobs.map(job => <JobCard key={job._id} job={job} showScore />)}
          </div>
        )
      }
    </div>
  );
};

export default RecommendedJobsPage;