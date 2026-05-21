import { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/saved")
      .then(res => setJobs(res.data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>🔖 Saved Jobs</h1>
      {loading ? <Spinner /> : jobs.length === 0 ? (
        <p style={{ color: "#666" }}>No saved jobs yet. Browse jobs and save the ones you like!</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;