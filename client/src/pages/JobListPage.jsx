import { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ keyword: "", location: "", type: "", status: "open" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 10 };
      const res = await api.get("/jobs", { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    } catch (err) {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div>
      <h1>Browse Jobs</h1>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <input placeholder="Keyword" value={filters.keyword}
          onChange={e => setFilters({ ...filters, keyword: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input placeholder="Location" value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
        </select>
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        <button type="submit" style={{ padding: "8px 20px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Search
        </button>
      </form>

      <p style={{ color: "#666" }}>{total} jobs found</p>

      {loading ? <Spinner /> : error ? <p style={{ color: "red" }}>{error}</p> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: "8px 15px", cursor: "pointer" }}>Previous</button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={jobs.length < 10}
              style={{ padding: "8px 15px", cursor: "pointer" }}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobListPage;