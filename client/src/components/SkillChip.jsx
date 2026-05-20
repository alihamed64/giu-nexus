const SkillChip = ({ skill }) => (
  <span style={{
    display: "inline-block", background: "#e8f4fd", color: "#2980b9",
    padding: "5px 12px", borderRadius: "20px", fontSize: "13px",
    margin: "4px", fontWeight: "500", border: "1px solid #2980b9"
  }}>
    {skill}
  </span>
);

export default SkillChip;