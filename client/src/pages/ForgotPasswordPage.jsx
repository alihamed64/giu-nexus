import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("If this email exists, a reset link has been sent. Check your inbox.");
    } catch (err) {
      setMessage("If this email exists, a reset link has been sent. Check your inbox.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center" }}>Forgot Password</h2>
      {message ? (
        <div>
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
          <p style={{ textAlign: "center" }}><Link to="/login">Back to Login</Link></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
              required />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "10px", background: "#e94560", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;