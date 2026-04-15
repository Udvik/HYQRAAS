import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import GlassCard from "../components/GlassCard";
import { useDashboard } from "../context/dashboard-context";

export default function AnalyticsPage() {
  const { analytics, loading, refreshDashboardData } = useDashboard();

  const comparison = analytics?.comparison || [];
  const quantumSummary = analytics?.quantum || {};
  const hybridSummary = analytics?.hybrid || {};

  const radarData = [
    {
      metric: "Score",
      Quantum: quantumSummary.avg_score || 0,
      Hybrid: hybridSummary.avg_score || 0,
    },
    {
      metric: "MinEntropy",
      Quantum: (quantumSummary.avg_min_entropy || 0) * 100,
      Hybrid: (hybridSummary.avg_min_entropy || 0) * 100,
    },
    {
      metric: "PassRate",
      Quantum: quantumSummary.full_pass_percent || 0,
      Hybrid: hybridSummary.full_pass_percent || 0,
    },
    {
      metric: "PassCount",
      Quantum: (quantumSummary.avg_pass_count || 0) * 25,
      Hybrid: (hybridSummary.avg_pass_count || 0) * 25,
    },
  ];

  const metricCards = [
    {
      title: "Hybrid Avg Score",
      value: hybridSummary.avg_score ?? 0,
      subtitle: "Hybrid randomness quality",
      color: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    },
    {
      title: "Quantum Avg Score",
      value: quantumSummary.avg_score ?? 0,
      subtitle: "Quantum Randomness quality",
      color: "linear-gradient(135deg, #ef4444, #f97316)",
    },
    {
      title: "Hybrid Min-Entropy",
      value: hybridSummary.avg_min_entropy ?? 0,
      subtitle: "Hybrid randomness",
      color: "linear-gradient(135deg, #22c55e, #14b8a6)",
    },
    {
      title: "Quantum Min-Entropy",
      value: quantumSummary.avg_min_entropy ?? 0,
      subtitle: "Paper-aligned source",
      color: "linear-gradient(135deg, #f97316, #eab308)",
    },
  ];

  return (
    <div>
      <div style={styles.hero}>
        <div style={styles.badge}>Hybrid vs Quantum Analysis</div>
        <h1 style={styles.heading}>Analytics</h1>
        <p style={styles.subheading}>
          This page focuses on the core project objective: improving raw quantum
          randomness using a hybrid quantum-classical model.
        </p>

        <button style={styles.refreshBtn} onClick={refreshDashboardData}>
          Refresh Analytics
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading analytics...</div>
      ) : (
        <>
          <section style={styles.statGrid}>
            {metricCards.map((card, index) => (
              <div
                key={index}
                style={{
                  ...styles.metricCard,
                  background: card.color,
                }}
              >
                <div style={styles.metricOverlay}></div>
                <div style={styles.metricInner}>
                  <div style={styles.metricTitle}>{card.title}</div>
                  <div style={styles.metricValue}>
                    {typeof card.value === "number"
                      ? Number(card.value).toFixed(
                          card.title.includes("Entropy") ? 4 : 2
                        )
                      : card.value}
                  </div>
                  <div style={styles.metricSubtitle}>{card.subtitle}</div>
                </div>
              </div>
            ))}
          </section>

          <section style={styles.gridTwo}>
            <GlassCard title="Direct Metric Comparison">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={comparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="metric" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="quantum" fill="#f97316" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="hybrid" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard title="Performance Shape">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={340}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.15)" />
                    <PolarAngleAxis dataKey="metric" stroke="#e2e8f0" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" />
                    <Radar
                      name="Quantum"
                      dataKey="Quantum"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.35}
                    />
                    <Radar
                      name="Hybrid"
                      dataKey="Hybrid"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.35}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </section>
        </>
      )}
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
    maxWidth: "820px",
    marginBottom: "18px",
  },

  refreshBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  loading: {
    color: "#e2e8f0",
    fontSize: "18px",
    padding: "30px 0",
  },

  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  metricCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    padding: "22px",
    minHeight: "150px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  metricOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), transparent)",
  },

  metricInner: {
    position: "relative",
    zIndex: 2,
  },

  metricTitle: {
    fontSize: "13px",
    color: "#e2e8f0",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  metricValue: {
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  metricSubtitle: {
    fontSize: "13px",
    color: "#e2e8f0",
    lineHeight: 1.5,
  },

  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "24px",
  },

  chartWrap: {
    width: "100%",
    height: "340px",
  },
};