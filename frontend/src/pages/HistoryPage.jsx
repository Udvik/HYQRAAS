import GlassCard from "../components/GlassCard";
import { useDashboard } from "../context/dashboard-context";

export default function HistoryPage() {
  const { history, loading } = useDashboard();

  return (
    <div>
      <h1 style={styles.heading}>History</h1>
      <p style={styles.subheading}>
        Logs of generated outputs, scores, timestamps, and selected modes.
      </p>

      <GlassCard title="Recent Activity">
        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : history && history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} style={styles.row}>
              <span>{item.source || item.mode || "Unknown"}</span>
              <span>{item.health_score || item.score || "N/A"}</span>
              <span>{item.label || "—"}</span>
              <span>{item.timestamp || "No timestamp"}</span>
            </div>
          ))
        ) : (
          <div style={styles.empty}>No history found.</div>
        )}
      </GlassCard>
    </div>
  );
}

const styles = {
  heading: { fontSize: "40px", marginBottom: "8px" },
  subheading: { color: "#cbd5e1", marginBottom: "24px" },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1.5fr",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#dbeafe",
  },
  empty: {
    color: "#cbd5e1",
  },
};