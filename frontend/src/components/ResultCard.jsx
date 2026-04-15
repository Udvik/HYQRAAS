import HealthBar from "./HealthBar";

export default function ResultCard({ result }) {
  if (!result) return null;

  const scoreData = result.health_score || {};

  const statusColor =
    scoreData.color === "green" ? "#16a34a" :
    scoreData.color === "orange" ? "#f59e0b" :
    "#dc2626";

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div>
          <h2 style={styles.heading}>Generated Result</h2>
          <p style={styles.subtext}>Validated randomness output</p>
        </div>
        <div style={{ ...styles.statusPill, borderColor: statusColor, color: statusColor }}>
          {scoreData.label}
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.label}>Generated Key</p>
        <div style={styles.keyBox}>{result.generated_key}</div>
      </div>

      <HealthBar
        score={scoreData.score}
        label={scoreData.label}
        color={scoreData.color}
      />

      <div style={styles.grid}>
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>Source Mode</p>
          <p style={styles.infoValue}>{result.source_mode}</p>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>Latency</p>
          <p style={styles.infoValue}>{result.latency_ms} ms</p>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>Timestamp</p>
          <p style={styles.infoValue}>{result.timestamp}</p>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>Score</p>
          <p style={styles.infoValue}>{scoreData.score}</p>
        </div>
      </div>

      <div style={styles.explanationBox}>
        <p style={styles.explanationTitle}>Explanation</p>
        <p style={styles.explanationText}>{result.explanation}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    
border: "1px solid #e5e7eb",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
  },
  heading: {
    margin: 0,
    fontSize: "24px",
  },
  subtext: {
    margin: "4px 0 0 0",
    color: "#6b7280",
  },
  statusPill: {
    border: "2px solid",
    borderRadius: "999px",
    padding: "8px 14px",
    fontWeight: "bold",
    background: "#fff",
  },
  section: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
  keyBox: {
  background: "#0f172a",
  color: "#22c55e",
  padding: "14px",
  borderRadius: "10px",
  wordBreak: "break-all",
  fontFamily: "monospace",
  fontSize: "14px",
},
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px",
    marginBottom: "20px",
  },
  infoBox: {
    background: "#f9fafb",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  infoTitle: {
    margin: "0 0 6px 0",
    fontSize: "13px",
    color: "#6b7280",
  },
  infoValue: {
    margin: 0,
    fontWeight: "bold",
    wordBreak: "break-word",
  },
  explanationBox: {
  background: "#f0f9ff",
  border: "1px solid #bae6fd",
  padding: "16px",
  borderRadius: "12px",
},
  explanationTitle: {
    margin: "0 0 8px 0",
    fontWeight: "bold",
  },
  explanationText: {
    margin: 0,
    color: "#1f2937",
  },
};