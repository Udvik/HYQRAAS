import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsCharts({ stats }) {
  if (!stats || !stats.by_mode) return null;

  const chartData = Object.entries(stats.by_mode).map(([mode, values]) => ({
    mode,
    avg_health_score: values.avg_health_score,
    avg_latency_ms: values.avg_latency_ms,
    count: values.count,
  }));

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Average Health Score by Mode</h2>
        <div style={styles.chartBox}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mode" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_health_score" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.heading}>Average Latency by Mode</h2>
        <div style={styles.chartBox}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mode" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_latency_ms" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    marginTop: "24px",
  },
  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  heading: {
    marginTop: 0,
    marginBottom: "16px",
  },
  chartBox: {
    width: "100%",
    height: "300px",
  },
};