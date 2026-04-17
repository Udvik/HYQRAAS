import GlassCard from "../components/GlassCard";
import { useDashboard } from "../context/dashboard-context";

export default function HistoryPage() {
  const { history, loading } = useDashboard();

  return (
    <div>
      <div style={styles.hero}>
        <div style={styles.badge}>Stored Generation Logs</div>
        <h1 style={styles.heading}>History</h1>
        <p style={styles.subheading}>
          View recent generated keys along with mode, entropy, latency, and timestamp.
        </p>
      </div>

      <GlassCard title="Recent Activity">
        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : history && history.length > 0 ? (
          <div style={styles.tableWrap}>
            <div style={styles.tableHeader}>
              <span>Mode</span>
              <span>Entropy</span>
              <span>Latency</span>
              <span>Timestamp</span>
              <span>Key</span>
            </div>

            {history.map((item, index) => (
              <div key={index} style={styles.row}>
                <span style={styles.modeChip(item.mode)}>
                  {item.mode || "Unknown"}
                </span>

                <span style={styles.valueText}>
                  {item.min_entropy !== undefined && item.min_entropy !== null
                    ? Number(item.min_entropy).toFixed(4)
                    : item.shannon_entropy !== undefined && item.shannon_entropy !== null
                    ? Number(item.shannon_entropy).toFixed(4)
                    : "N/A"}
                </span>

                <span style={styles.valueText}>
                  {item.latency_ms !== undefined && item.latency_ms !== null
                    ? `${Number(item.latency_ms).toFixed(2)} ms`
                    : "N/A"}
                </span>

                <span style={styles.timeText}>
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
                    : "No timestamp"}
                </span>

                <span style={styles.keyText} title={item.key_hex || ""}>
                  {item.key_preview || item.key_hex || "No key"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>No history found.</div>
        )}
      </GlassCard>
    </div>
  );
}

const styles = {
  hero: {
    marginBottom: "24px",
    padding: "30px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(34,211,238,0.14), rgba(236,72,153,0.12))",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(34,211,238,0.16)",
    color: "#67e8f9",
    fontWeight: "700",
    fontSize: "12px",
    marginBottom: "16px",
  },

  heading: {
    fontSize: "44px",
    marginBottom: "10px",
  },

  subheading: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "760px",
  },

  tableWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowX: "auto",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1.8fr 1.5fr",
    gap: "14px",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#67e8f9",
    fontWeight: "700",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1.8fr 1.5fr",
    gap: "14px",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#dbeafe",
  },

  modeChip: (mode) => ({
    display: "inline-block",
    width: "fit-content",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    background:
      mode === "hybrid"
        ? "rgba(34,211,238,0.16)"
        : mode === "quantum"
        ? "rgba(249,115,22,0.16)"
        : "rgba(139,92,246,0.16)",
    color:
      mode === "hybrid"
        ? "#67e8f9"
        : mode === "quantum"
        ? "#fdba74"
        : "#ddd6fe",
    border: "1px solid rgba(255,255,255,0.08)",
  }),

  valueText: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: "14px",
  },

  timeText: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  keyText: {
    color: "#e2e8f0",
    fontFamily: "monospace",
    fontSize: "14px",
    letterSpacing: "0.5px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "8px 12px",
    borderRadius: "12px",
    width: "fit-content",
  },

  empty: {
    color: "#cbd5e1",
    fontSize: "15px",
  },
};