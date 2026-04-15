import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import GeneratorPage from "./pages/GeneratorPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BenchmarkMetricsPage from "./pages/BenchmarkMetricsPage";
import OTPPage from "./pages/OTPPage";
import LotteryPage from "./pages/LotteryPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/benchmark-metrics" element={<BenchmarkMetricsPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/lottery" element={<LotteryPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Layout>
  );
}