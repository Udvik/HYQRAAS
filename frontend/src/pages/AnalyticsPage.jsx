import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
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

  const quantumSummary = analytics?.quantum || {};
  const hybridSummary = analytics?.hybrid || {};

  const scoreData = [
    { name: "Quantum", value: quantumSummary.avg_score || 0 },
    { name: "Hybrid", value: hybridSummary.avg_score || 0 },
  ];

  const entropyData = [
    { name: "Quantum", value: quantumSummary.avg_min_entropy || 0 },
    { name: "Hybrid", value: hybridSummary.avg_min_entropy || 0 },
  ];

  const passPercentData = [
    {
      name: "Quantum",
      value: quantumSummary.full_pass_percent || 0,
      fill: "#f97316",
    },
    {
      name: "Hybrid",
      value: hybridSummary.full_pass_percent || 0,
      fill: "#22d3ee",
    },
  ];

  const passCountData = [
    { name: "Quantum", value: quantumSummary.avg_pass_count || 0 },
    { name: "Hybrid", value: hybridSummary.avg_pass_count || 0 },
  ];

  const latencyData = [
    { name: "Quantum", value: quantumSummary.avg_latency || 0 },
    { name: "Hybrid", value: hybridSummary.avg_latency || 0 },
  ];

  const trendData = [
    {
      metric: "Score",
      Quantum: quantumSummary.avg_score || 0,
      Hybrid: hybridSummary.avg_score || 0,
    },
    {
      metric: "MinEntropy x100",
      Quantum: (quantumSummary.avg_min_entropy || 0) * 100,
      Hybrid: (hybridSummary.avg_min_entropy || 0) * 100,
    },
    {
      metric: "Pass Rate",
      Quantum: quantumSummary.full_pass_percent || 0,
      Hybrid: hybridSummary.full_pass_percent || 0,
    },
    {
      metric: "Pass Count x25",
      Quantum: (quantumSummary.avg_pass_count || 0) * 25,
      Hybrid: (hybridSummary.avg_pass_count || 0) * 25,
    },
  ];

  const radarData = [
    {
      subject: "Score",
      Quantum: quantumSummary.avg_score || 0,
      Hybrid: hybridSummary.avg_score || 0,
    },
    {
      subject: "Entropy",
      Quantum: (quantumSummary.avg_min_entropy || 0) * 100,
      Hybrid: (hybridSummary.avg_min_entropy || 0) * 100,
    },
    {
      subject: "Pass %",
      Quantum: quantumSummary.full_pass_percent || 0,
      Hybrid: hybridSummary.full_pass_percent || 0,
    },
    {
      subject: "Pass Count",
      Quantum: (quantumSummary.avg_pass_count || 0) * 25,
      Hybrid: (hybridSummary.avg_pass_count || 0) * 25,
    },
    {
      subject: "Latency Score",
      Quantum: Math.max(0, 100 - (quantumSummary.avg_latency || 0) / 10),
      Hybrid: Math.max(0, 100 - (hybridSummary.avg_latency || 0) / 10),
    },
  ];

  const pieData = [
    {
      name: "Quantum Score Contribution",
      value: quantumSummary.avg_score || 0,
    },
    {
      name: "Hybrid Score Contribution",
      value: hybridSummary.avg_score || 0,
    },
  ];

  const metricCards = [
    {
      title: "Hybrid Avg Score",
      value: hybridSummary.avg_score ?? 0,
      subtitle: "Hybrid randomness quality",
      color: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
      fixed: 2,
    },
    {
      title: "Quantum Avg Score",
      value: quantumSummary.avg_score ?? 0,
      subtitle: "Quantum randomness quality",
      color: "linear-gradient(135deg, #ef4444, #f97316)",
      fixed: 2,
    },
    {
      title: "Hybrid Min-Entropy",
      value: hybridSummary.avg_min_entropy ?? 0,
      subtitle: "Hybrid entropy strength",
      color: "linear-gradient(135deg, #22c55e, #14b8a6)",
      fixed: 4,
    },
    {
      title: "Quantum Min-Entropy",
      value: quantumSummary.avg_min_entropy ?? 0,
      subtitle: "Paper-aligned source",
      color: "linear-gradient(135deg, #f97316, #eab308)",
      fixed: 4,
    },
  ];

  const renderMetricChart = (
    title,
    dataSet,
    colorQuantum,
    colorHybrid,
    yDomain = ["auto", "auto"]
  ) => (
    <GlassCard title={title}>
      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={290}>
          <BarChart data={dataSet}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" domain={yDomain} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {dataSet.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Quantum" ? colorQuantum : colorHybrid}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );

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
                      ? Number(card.value).toFixed(card.fixed)
                      : card.value}
                  </div>
                  <div style={styles.metricSubtitle}>{card.subtitle}</div>
                </div>
              </div>
            ))}
          </section>

          <section style={styles.gridTwo}>
            {renderMetricChart(
              "Average Score Comparison",
              scoreData,
              "#f97316",
              "#22d3ee",
              [0, 100]
            )}
            {renderMetricChart(
              "Min-Entropy Comparison",
              entropyData,
              "#f97316",
              "#22d3ee",
              [0, 1]
            )}
          </section>

          <section style={styles.gridTwo}>
            {renderMetricChart(
              "Average Pass Count",
              passCountData,
              "#f97316",
              "#22d3ee",
              [0, 4]
            )}
            {renderMetricChart(
              "Latency Comparison",
              latencyData,
              "#f97316",
              "#22d3ee"
            )}
          </section>

          <section style={styles.gridTwo}>
            <GlassCard title="Full Pass Percentage">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={290}>
                  <RadialBarChart
                    innerRadius="35%"
                    outerRadius="90%"
                    data={passPercentData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      cornerRadius={12}
                    />
                    <Legend iconSize={12} layout="horizontal" verticalAlign="bottom" />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard title="Performance Trend View">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={290}>
                  <AreaChart data={trendData}>
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
                    <Area
                      type="monotone"
                      dataKey="Quantum"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.18}
                    />
                    <Area
                      type="monotone"
                      dataKey="Hybrid"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.18}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </section>

          <section style={styles.gridTwo}>
            <GlassCard title="Performance Shape">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.12)" />
                    <PolarAngleAxis dataKey="subject" stroke="#e2e8f0" />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.18)" />
                    <Radar
                      name="Quantum"
                      dataKey="Quantum"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.28}
                    />
                    <Radar
                      name="Hybrid"
                      dataKey="Hybrid"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.28}
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

            <GlassCard title="Score Share View">
              <div style={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      <Cell fill="#f97316" />
                      <Cell fill="#22d3ee" />
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </section>

          <section style={styles.gridTwo}>
            <GlassCard title="Quick Visual Comparison">
              <div style={styles.quickCompare}>
                <MetricStrip
                  label="Average Score"
                  quantum={quantumSummary.avg_score || 0}
                  hybrid={hybridSummary.avg_score || 0}
                  max={100}
                />
                <MetricStrip
                  label="Min-Entropy"
                  quantum={quantumSummary.avg_min_entropy || 0}
                  hybrid={hybridSummary.avg_min_entropy || 0}
                  max={1}
                />
                <MetricStrip
                  label="Pass Count"
                  quantum={quantumSummary.avg_pass_count || 0}
                  hybrid={hybridSummary.avg_pass_count || 0}
                  max={4}
                />
                <MetricStrip
                  label="Full Pass %"
                  quantum={quantumSummary.full_pass_percent || 0}
                  hybrid={hybridSummary.full_pass_percent || 0}
                  max={100}
                />
              </div>
            </GlassCard>

            <GlassCard title="Interpretation">
              <div style={styles.reasonList}>
                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>
                    Hybrid improves average score
                  </div>
                  <div style={styles.reasonText}>
                    Hybrid consistently achieves a stronger final quality score
                    than raw quantum randomness.
                  </div>
                </div>

                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>
                    Hybrid raises min-entropy
                  </div>
                  <div style={styles.reasonText}>
                    Hybrid improves the entropy quality of the final output and
                    addresses the weaker entropy of the raw quantum source.
                  </div>
                </div>

                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>
                    Hybrid passes validation more reliably
                  </div>
                  <div style={styles.reasonText}>
                    Full pass percentage and pass count show that hybrid is more
                    usable and consistent than raw quantum output.
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          <section>
            <GlassCard title="Exact Analytics Table">
              <div style={styles.table}>
                <div style={styles.tableHeader}>
                  <span>Metric</span>
                  <span>Quantum</span>
                  <span>Hybrid</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Average Score</span>
                  <span>{Number(quantumSummary.avg_score || 0).toFixed(2)}</span>
                  <span>{Number(hybridSummary.avg_score || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Min-Entropy</span>
                  <span>{Number(quantumSummary.avg_min_entropy || 0).toFixed(4)}</span>
                  <span>{Number(hybridSummary.avg_min_entropy || 0).toFixed(4)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Full Pass %</span>
                  <span>{Number(quantumSummary.full_pass_percent || 0).toFixed(2)}</span>
                  <span>{Number(hybridSummary.full_pass_percent || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Average Pass Count</span>
                  <span>{Number(quantumSummary.avg_pass_count || 0).toFixed(2)}</span>
                  <span>{Number(hybridSummary.avg_pass_count || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Latency</span>
                  <span>{Number(quantumSummary.avg_latency || 0).toFixed(2)} ms</span>
                  <span>{Number(hybridSummary.avg_latency || 0).toFixed(2)} ms</span>
                </div>
              </div>
            </GlassCard>
          </section>
        </>
      )}
    </div>
  );
}

function MetricStrip({ label, quantum, hybrid, max }) {
  const quantumWidth = max > 0 ? (quantum / max) * 100 : 0;
  const hybridWidth = max > 0 ? (hybrid / max) * 100 : 0;

  const formatValue = (value) => {
    if (value < 1) return Number(value).toFixed(4);
    return Number(value).toFixed(2);
  };

  return (
    <div style={styles.stripWrap}>
      <div style={styles.stripHeader}>
        <span style={styles.stripLabel}>{label}</span>
      </div>

      <div style={styles.stripRow}>
        <span style={styles.stripName}>Quantum</span>
        <div style={styles.stripTrack}>
          <div
            style={{
              ...styles.stripFill,
              width: `${quantumWidth}%`,
              background: "linear-gradient(90deg, #f97316, #fb923c)",
            }}
          />
        </div>
        <span style={styles.stripValue}>{formatValue(quantum)}</span>
      </div>

      <div style={styles.stripRow}>
        <span style={styles.stripName}>Hybrid</span>
        <div style={styles.stripTrack}>
          <div
            style={{
              ...styles.stripFill,
              width: `${hybridWidth}%`,
              background: "linear-gradient(90deg, #22d3ee, #8b5cf6)",
            }}
          />
        </div>
        <span style={styles.stripValue}>{formatValue(hybrid)}</span>
      </div>
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
    height: "320px",
  },

  quickCompare: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  stripWrap: {
    padding: "14px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  stripHeader: {
    marginBottom: "12px",
  },

  stripLabel: {
    color: "#67e8f9",
    fontWeight: "700",
    fontSize: "14px",
  },

  stripRow: {
    display: "grid",
    gridTemplateColumns: "74px 1fr 70px",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },

  stripName: {
    color: "#dbeafe",
    fontSize: "13px",
  },

  stripTrack: {
    height: "12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  stripFill: {
    height: "100%",
    borderRadius: "999px",
  },

  stripValue: {
    color: "#f8fafc",
    fontSize: "12px",
    textAlign: "right",
  },

  reasonList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  reasonItem: {
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  reasonTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#67e8f9",
  },

  reasonText: {
    color: "#dbeafe",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  table: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr",
    fontWeight: "700",
    color: "#67e8f9",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr 1fr",
    color: "#dbeafe",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
};