export default function GlassCard({ title, children, style = {} }) {
  return (
    <div style={{ ...styles.card, ...style }}>
      {title && <h3 style={styles.title}>{title}</h3>}
      {children}
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "22px",
    padding: "22px",
    backdropFilter: "blur(16px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  },

  title: {
    fontSize: "20px",
    marginBottom: "16px",
    color: "#f8fafc",
  },
};