export default function StatCard({ title, value, subtitle, gradient }) {
  return (
    <div
      style={{
        ...styles.card,
        background: gradient,
      }}
    >
      <div style={styles.overlay}></div>
      <div style={styles.inner}>
        <p style={styles.title}>{title}</p>
        <h2 style={styles.value}>{value}</h2>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    padding: "22px",
    minHeight: "145px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "0.3s ease",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), transparent)",
  },

  inner: {
    position: "relative",
    zIndex: 2,
  },

  title: {
    fontSize: "13px",
    color: "#e2e8f0",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  value: {
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },
};