const colors = {
  pending: { bg: "#fff3cd", text: "#856404" },
  shortlisted: { bg: "#d4edda", text: "#155724" },
  rejected: { bg: "#f8d7da", text: "#721c24" },
};

const ApplicationStatusBadge = ({ status }) => (
  <span style={{
    background: colors[status]?.bg || "#f0f0f0",
    color: colors[status]?.text || "#333",
    padding: "4px 12px", borderRadius: "20px",
    fontSize: "13px", fontWeight: "500"
  }}>
    {status}
  </span>
);

export default ApplicationStatusBadge;