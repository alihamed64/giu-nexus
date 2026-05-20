import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const EditProfilePage = () => {
  const [form, setForm] = useState({ name: "", bio: "", profilePicture: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/profile").then(res => {
      const { name, bio, profilePicture } = res.data.user;
      setForm({ name: name || "", bio: bio || "", profilePicture: profilePicture || "" });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profile", form);
      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Edit Profile</h1>
      {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {["name", "bio", "profilePicture"].map(field => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label style={{ textTransform: "capitalize" }}>{field === "profilePicture" ? "Profile Picture URL" : field}</label>
            {field === "bio" ? (
              <textarea value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", height: "100px" }} />
            ) : (
              <input type="text" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
                style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }} />
            )}
          </div>
        ))}
        <button type="submit" disabled={saving}
          style={{ width: "100%", padding: "10px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;