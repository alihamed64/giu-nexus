import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "jobSeeker") {
      setLoadingRec(true);
      api.get("/jobs/recommended")
        .then(res => setRecommended(res.data.jobs.slice(0, 4)))
        .catch(console.error)
        .finally(() => setLoadingRec(false));
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Find Your Dream Job</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
        AI-powered job matching for GIU students
      </p>

      {isAuthenticated && user?.role === "jobSeeker" && (
        <div style={{ marginBottom: "40px" }}>
          <h2>🤖 Recommended For You</h2>
          {loadingRec ? <Spinner /> : (
            recommended.length === 0 ? (
              <p>No recommendations yet. <a href="/profile">Extract your skills first!</a></p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {recommended.map(job => <JobCard key={job._id} job={job} showScore />)}
              </div>
            )
          )}
        </div>
      )}

      <h2>Latest Jobs</h2>
      {loadingJobs ? <Spinner /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
};

export default HomePage;