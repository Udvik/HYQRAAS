import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import StatCard from "../components/StatCard";
import { useDashboard } from "../context/dashboard-context";

export default function Dashboard() {
  const { stats, history, loading } = useDashboard();

  const totalKeys =
    stats?.total_keys ??
    stats?.summary?.total_keys ??
    history?.length ??
    0;

  const avgHealth =
    stats?.avg_health_score ??
    stats?.summary?.avg_health_score ??
    0;

  const avgLatency =
    stats?.avg_latency ??
    stats?.summary?.avg_latency ??
    0;

  const recommendedMode =
    stats?.recommended_mode ??
    "Hybrid";

  return (
    <div>
      <section style={styles.hero}>
        <div>
          <div style={styles.badge}>Hybrid Quantum-Classical Platform</div>
          <h1 style={styles.heading}>HyQRaaS Dashboard</h1>
          <p style={styles.subheading}>
            Secure, validated, visually rich randomness analytics with hybrid
            mode as the recommended output engine.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/generator" style={styles.primaryBtn}>
              Generate Key
            </Link>
            <Link to="/analytics" style={styles.secondaryBtn}>
              View Analytics
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.grid4}>
        <StatCard
          title="Average Health"
          value={loading ? "..." : Number(avgHealth).toFixed(2)}
          subtitle="Live value updated from generated results"
          gradient="linear-gradient(135deg, #7c3aed, #22d3ee)"
        />
        <StatCard
          title="Average Latency"
          value={loading ? "..." : `${Number(avgLatency).toFixed(2)} ms`}
          subtitle="Database-backed runtime average"
          gradient="linear-gradient(135deg, #2563eb, #06b6d4)"
        />
        <StatCard
          title="Keys Generated"
          value={loading ? "..." : totalKeys}
          subtitle="Updated whenever a new key is generated"
          gradient="linear-gradient(135deg, #ec4899, #8b5cf6)"
        />
        <StatCard
          title="Recommended Mode"
          value={recommendedMode}
          subtitle="Current best trust-oriented mode"
          gradient="linear-gradient(135deg, #22c55e, #14b8a6)"
        />
      </section>

      <section style={styles.chartsGrid}>
        <GlassCard title="Recent History">
          {history && history.length > 0 ? (
            <div style={styles.historyWrap}>
              {history.slice(0, 5).map((item, index) => (
                <div key={index} style={styles.historyRow}>
                  <span>{item.source || item.mode || "Unknown"}</span>
                  <span>{item.health_score || item.score || "N/A"}</span>
                  <span>{item.timestamp || "No time"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>No history available yet.</div>
          )}
        </GlassCard>

        <GlassCard title="Platform Insight">
          <div style={styles.insightBox}>
            <div style={styles.insightBadge}>Why Hybrid Wins</div>
            <p style={styles.insightText}>
              Hybrid combines classical entropy with a paper-aligned noisy
              quantum source, then improves output through cryptographic mixing.
            </p>
            <p style={styles.insightText}>
              Every new key updates dashboard metrics automatically through
              the shared dashboard state.
            </p>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    marginBottom: "24px",
    padding: "34px",
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
    fontSize: "48px",
    lineHeight: 1.1,
    marginBottom: "14px",
  },

  subheading: {
    maxWidth: "760px",
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.7,
    marginBottom: "24px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    color: "#fff",
    fontWeight: "700",
    boxShadow: "0 12px 24px rgba(34,211,238,0.2)",
  },

  secondaryBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontWeight: "700",
  },

  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  historyWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  historyRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1.5fr",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#dbeafe",
  },

  emptyState: {
    color: "#cbd5e1",
  },

  insightBox: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  insightBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(139,92,246,0.2)",
    color: "#ddd6fe",
    fontSize: "12px",
    fontWeight: "700",
  },

  insightText: {
    color: "#dbeafe",
    lineHeight: 1.7,
    fontSize: "15px",
  },
};