import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Cell } from "recharts";
import GlassCard from "../components/GlassCard";
import { getBenchmarkResults } from "../api/client";

export default function BenchmarkMetricsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBenchmarkResults();
  }, []);

  const loadBenchmarkResults = async () => {
    try {
      setLoading(true);
      const response = await getBenchmarkResults();
      setData(response);
    } catch (error) {
      console.error("Failed to load benchmark results:", error);
    } finally {
      setLoading(false);
    }
  };

  const quantum = data?.quantum || {};
  const hybrid = data?.hybrid || {};

  const scoreData = [
    { name: "Quantum", value: quantum.avg_score || 0 },
    { name: "Hybrid", value: hybrid.avg_score || 0 },
  ];

  const entropyData = [
    { name: "Quantum", value: quantum.avg_min_entropy || 0 },
    { name: "Hybrid", value: hybrid.avg_min_entropy || 0 },
  ];

  const passPercentData = [
    { name: "Quantum", value: quantum.full_pass_percent || 0 },
    { name: "Hybrid", value: hybrid.full_pass_percent || 0 },
  ];

  const passCountData = [
    { name: "Quantum", value: quantum.avg_pass_count || 0 },
    { name: "Hybrid", value: hybrid.avg_pass_count || 0 },
  ];

  const latencyData = [
    { name: "Quantum", value: quantum.avg_latency || 0 },
    { name: "Hybrid", value: hybrid.avg_latency || 0 },
  ];

  const cards = [
    {
      title: "Hybrid Score",
      value: hybrid.avg_score ?? 0,
      subtitle: "Benchmark average quality",
      bg: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
      fixed: 2,
    },
    {
      title: "Quantum Score",
      value: quantum.avg_score ?? 0,
      subtitle: "Raw quantum benchmark quality",
      bg: "linear-gradient(135deg, #ef4444, #f97316)",
      fixed: 2,
    },
    {
      title: "Hybrid Min-Entropy",
      value: hybrid.avg_min_entropy ?? 0,
      subtitle: "Stronger final randomness",
      bg: "linear-gradient(135deg, #22c55e, #14b8a6)",
      fixed: 4,
    },
    {
      title: "Quantum Min-Entropy",
      value: quantum.avg_min_entropy ?? 0,
      subtitle: "Paper-aligned weaker source",
      bg: "linear-gradient(135deg, #f97316, #eab308)",
      fixed: 4,
    },
  ];

  const renderMetricChart = (title, dataSet, colorQuantum, colorHybrid, yDomain = ["auto", "auto"]) => (
    <GlassCard title={title}>
      <div style={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataSet}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
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
            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
            >
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
      <section style={styles.hero}>
        <div style={styles.badge}>Controlled Benchmark Comparison</div>
        <h1 style={styles.heading}>Benchmark Metrics</h1>
        <p style={styles.subheading}>
          This page shows benchmark-only results generated from the benchmark script.
          Each metric is visualized separately so the Hybrid vs Quantum difference
          is clearly visible.
        </p>
        <button style={styles.refreshBtn} onClick={loadBenchmarkResults}>
          Refresh Benchmark Results
        </button>
      </section>

      {loading ? (
        <div style={styles.loading}>Loading benchmark metrics...</div>
      ) : (
        <>
          <section style={styles.cardGrid}>
            {cards.map((card, index) => (
              <div
                key={index}
                style={{
                  ...styles.metricCard,
                  background: card.bg,
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
              "Full Pass Percentage",
              passPercentData,
              "#f97316",
              "#22d3ee",
              [0, 100]
            )}
            {renderMetricChart(
              "Average Pass Count",
              passCountData,
              "#f97316",
              "#22d3ee",
              [0, 4]
            )}
          </section>

          <section style={styles.gridTwo}>
            {renderMetricChart(
              "Latency Comparison",
              latencyData,
              "#f97316",
              "#22d3ee"
            )}

            <GlassCard title="Interpretation">
              <div style={styles.reasonList}>
                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>Hybrid improves benchmark score</div>
                  <div style={styles.reasonText}>
                    Hybrid consistently produces a much stronger final quality score than raw quantum output.
                  </div>
                </div>

                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>Hybrid raises entropy quality</div>
                  <div style={styles.reasonText}>
                    The hybrid model significantly improves min-entropy over the raw quantum source.
                  </div>
                </div>

                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>Hybrid passes more validation checks</div>
                  <div style={styles.reasonText}>
                    Full pass percentage and pass count show that hybrid is much more reliable for practical use.
                  </div>
                </div>

                <div style={styles.reasonItem}>
                  <div style={styles.reasonTitle}>Separate charts improve readability</div>
                  <div style={styles.reasonText}>
                    Since each metric uses a very different scale, individual charts make the comparison much clearer.
                  </div>
                </div>
              </div>
            </GlassCard>
          </section>

          <section>
            <GlassCard title="Exact Benchmark Table">
              <div style={styles.table}>
                <div style={styles.tableHeader}>
                  <span>Metric</span>
                  <span>Quantum</span>
                  <span>Hybrid</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Average Score</span>
                  <span>{Number(quantum.avg_score || 0).toFixed(2)}</span>
                  <span>{Number(hybrid.avg_score || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Min-Entropy</span>
                  <span>{Number(quantum.avg_min_entropy || 0).toFixed(4)}</span>
                  <span>{Number(hybrid.avg_min_entropy || 0).toFixed(4)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Full Pass %</span>
                  <span>{Number(quantum.full_pass_percent || 0).toFixed(2)}</span>
                  <span>{Number(hybrid.full_pass_percent || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Average Pass Count</span>
                  <span>{Number(quantum.avg_pass_count || 0).toFixed(2)}</span>
                  <span>{Number(hybrid.avg_pass_count || 0).toFixed(2)}</span>
                </div>

                <div style={styles.tableRow}>
                  <span>Latency</span>
                  <span>{Number(quantum.avg_latency || 0).toFixed(2)} ms</span>
                  <span>{Number(hybrid.avg_latency || 0).toFixed(2)} ms</span>
                </div>
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

  cardGrid: {
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
    height: "300px",
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
};