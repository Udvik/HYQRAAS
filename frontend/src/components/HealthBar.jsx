export default function HealthBar({ score, label, color }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));

  const barColor =
    color === "green" ? "#16a34a" :
    color === "orange" ? "#f59e0b" :
    "#dc2626";

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <span style={styles.title}>Health Score</span>
        <span style={{ ...styles.badge, backgroundColor: barColor }}>
          {label}
        </span>
      </div>

      <div style={styles.barOuter}>
        <div
          style={{
            ...styles.barInner,
            width: `${safeScore}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      <div style={styles.footerRow}>
        <span>0</span>
        <strong>{safeScore}/100</strong>
        <span>100</span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  badge: {
    color: "white",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  barOuter: {
    width: "100%",
    height: "18px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barInner: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px",
    fontSize: "13px",
    color: "#4b5563",
  },
};