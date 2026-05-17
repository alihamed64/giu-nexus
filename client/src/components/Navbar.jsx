import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px 20px", background: "#1a1a2e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "20px" }}>
        GIU Nexus
      </Link>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/jobs" style={{ color: "white", textDecoration: "none" }}>Jobs</Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        )}

        {isAuthenticated && user?.role === "jobSeeker" && (
          <>
            <Link to="/jobs/recommended" style={{ color: "white", textDecoration: "none" }}>Recommended</Link>
            <Link to="/jobs/saved" style={{ color: "white", textDecoration: "none" }}>Saved Jobs</Link>
            <Link to="/applications/my" style={{ color: "white", textDecoration: "none" }}>My Applications</Link>
            <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link>
          </>
        )}

        {isAuthenticated && user?.role === "recruiter" && (
          <>
            <Link to="/recruiter/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/recruiter/jobs/create" style={{ color: "white", textDecoration: "none" }}>Post Job</Link>
          </>
        )}

        {isAuthenticated && user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
            <Link to="/admin/recruiters" style={{ color: "white", textDecoration: "none" }}>Recruiters</Link>
            <Link to="/admin/jobs" style={{ color: "white", textDecoration: "none" }}>Jobs</Link>
            <Link to="/admin/users" style={{ color: "white", textDecoration: "none" }}>Users</Link>
          </>
        )}

        {isAuthenticated && (
          <button onClick={handleLogout} style={{ background: "#e94560", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;