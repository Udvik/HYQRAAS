export default function HistoryTable({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Recent History</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mode</th>
              <th style={styles.th}>Health Score</th>
              <th style={styles.th}>Label</th>
              <th style={styles.th}>Latency (ms)</th>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Key</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.mode}</td>
                <td style={styles.td}>{item.health_score}</td>
                <td style={styles.td}>{item.health_label}</td>
                <td style={styles.td}>{item.latency_ms}</td>
                <td style={styles.td}>{item.timestamp}</td>
                <td style={styles.tdKey}>{item.key_hex}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    marginTop: "24px",
  },
  heading: {
    marginTop: 0,
    marginBottom: "16px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #ddd",
  background: "#f1f5f9",
  color: "#334155",
},
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
  },
  tdKey: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontFamily: "monospace",
    wordBreak: "break-all",
    minWidth: "220px",
  },
};