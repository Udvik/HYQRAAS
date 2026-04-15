import { useEffect, useState } from "react";
import api from "./api/client";
import GeneratorForm from "./components/GeneratorForm";
import ResultCard from "./components/ResultCard";
import StatsCharts from "./components/StatsCharts";
import HistoryTable from "./components/HistoryTable";
import OTPDemo from "./components/OTPDemo";
import LotteryDemo from "./components/LotteryDemo";


export default function App() {
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get("/stats"),
        api.get("/history"),
      ]);

      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Dashboard data load failed:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleGenerate = async (payload) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/generate-key", payload);
      setResult(response.data);

      await loadDashboardData();
    } catch (err) {
      console.error(err);
      setError("Failed to generate key. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>HyQRaaS Dashboard</h1>
          <p style={styles.subtitle}>
            Hybrid Quantum-Classical Randomness-as-a-Service
          </p>
        </div>

        <GeneratorForm onGenerate={handleGenerate} loading={loading} />

        {error && <p style={styles.error}>{error}</p>}

        <ResultCard result={result} />
        <StatsCharts stats={stats} />
        <HistoryTable history={history} />
        <OTPDemo />
        <LotteryDemo />
      </div>
    </div>
  );
}

const styles = {
  page: {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
},
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
  margin: 0,
  fontSize: "36px",
  color: "#1e293b", // dark blue-gray
},
subtitle: {
  marginTop: "8px",
  color: "#64748b", // soft gray
  fontSize: "16px",
},
  error: {
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "16px",
  },
};