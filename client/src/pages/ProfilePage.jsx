import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import SkillChip from "../components/SkillChip";
import Spinner from "../components/Spinner";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  useEffect(() => {
    api.get("/profile")
      .then(res => setUser(res.data.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExtractSkills = async () => {
    setExtracting(true);
    setExtractError("");
    try {
      const res = await api.post("/profile/extract-skills");
      setUser(prev => ({ ...prev, skills: res.data.skills }));
    } catch (err) {
      setExtractError(err.response?.data?.message || "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!user) return <p>Failed to load profile</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Profile</h1>
        <Link to="/profile/edit" style={{ background: "#2980b9", color: "white", padding: "8px 20px", borderRadius: "5px", textDecoration: "none" }}>
          Edit Profile
        </Link>
      </div>

      <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
        {user.profilePicture && <img src={user.profilePicture} alt="Profile" style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "15px" }} />}
        <h2 style={{ margin: 0 }}>{user.name}</h2>
        <p style={{ color: "#666" }}>{user.email}</p>
        <p style={{ color: "#888", fontSize: "14px" }}>Role: {user.role}</p>
      </div>

      <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
        <h3>Bio</h3>
        {user.bio ? <p>{user.bio}</p> : (
          <p style={{ color: "#999" }}>No bio yet. <Link to="/profile/edit">Add one!</Link></p>
        )}
      </div>

      <div style={{ background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>Skills</h3>
          <button onClick={handleExtractSkills} disabled={extracting}
            style={{ background: "#8e44ad", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
            {extracting ? "Extracting..." : "🤖 Extract Skills from Bio"}
          </button>
        </div>

        {extractError && (
          <p style={{ color: "red" }}>
            {extractError} {extractError.includes("Bio") && <Link to="/profile/edit">Update your bio</Link>}
          </p>
        )}

        {user.skills?.length > 0 ? (
          <div>{user.skills.map((skill, i) => <SkillChip key={i} skill={skill} />)}</div>
        ) : (
          <p style={{ color: "#999" }}>No skills yet. Click "Extract Skills from Bio" to auto-detect them!</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/profile/change-password" style={{ color: "#e94560" }}>Change Password</Link>
      </div>
    </div>
  );
};

export default ProfilePage;