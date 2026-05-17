
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateJobPage = () => {
  const [form, setForm] = useState({
    title: "", company: "", description: "", requirements: "",
    location: "", type: "internship", salary: "", totalSlots: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split(",").map(r => r.trim()),
        salary: form.salary ? Number(form.salary) : undefined,
        totalSlots: Number(form.totalSlots),
      };
      const res = await api.post("/jobs", payload);
      setResult(res.data.job);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  if (result) return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "40px" }}>
      <h2>✅ Job Created Successfully!</h2>
      <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginTop: "20px" }}>
        <h3>{result.title}</h3>
        <p>AI-Assigned Category: <strong style={{ background: "#2980b9", color: "white", padding: "3px 10px", borderRadius: "20px" }}>{result.category}</strong></p>
        <p>Status: {result.status}</p>
      </div>
      <button onClick={() => navigate("/recruiter/dashboard")}
        style={{ marginTop: "20px", padding: "10px 25px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Post a New Job</h1>
      <p style={{ color: "#666" }}>The job category will be automatically assigned by AI based on your description.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[["title", "Job Title"], ["company", "Company Name"], ["location", "Location"]].map(([field, label]) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label>{label}</label>
            <input type="text" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              required />
          </div>
        ))}
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", height: "120px" }}
            required />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Requirements (comma separated)</label>
          <input type="text" placeholder="Node.js, React, MongoDB" value={form.requirements}
            onChange={e => setForm({ ...form, requirements: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            required />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}>
            <option value="internship">Internship</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
          <div>
            <label>Salary (optional)</label>
            <input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label>Total Slots</label>
            <input type="number" value={form.totalSlots} onChange={e => setForm({ ...form, totalSlots: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              min="1" required />
          </div>
        </div>
        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
          {loading ? "Creating job & classifying with AI..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;
