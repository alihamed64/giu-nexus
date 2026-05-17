
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", company: "", description: "", requirements: "", location: "", type: "", salary: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => {
      const j = res.data.job;
      setForm({ title: j.title, company: j.company, description: j.description, requirements: j.requirements.join(", "), location: j.location, type: j.type, salary: j.salary || "", status: j.status });
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/jobs/${id}`, {
        ...form,
        requirements: form.requirements.split(",").map(r => r.trim()),
        salary: form.salary ? Number(form.salary) : undefined,
      });
      setMessage("Job updated! AI will re-classify if description changed.");
      setTimeout(() => navigate("/recruiter/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Job</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {[["title", "Job Title"], ["company", "Company"], ["location", "Location"]].map(([field, label]) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label>{label}</label>
            <input type="text" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} required />
          </div>
        ))}
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", height: "120px" }} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Requirements (comma separated)</label>
          <input type="text" value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" disabled={saving}
          style={{ width: "100%", padding: "10px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditJobPage;
