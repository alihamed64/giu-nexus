import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SaveJobButton = ({ jobId, jobStatus, initialSaved = false }) => {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || jobStatus !== "open") return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={loading}
      style={{ background: saved ? "#666" : "#2980b9", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
      {loading ? "..." : saved ? "🔖 Unsave" : "🔖 Save"}
    </button>
  );
};

export default SaveJobButton;