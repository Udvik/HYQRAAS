import { useEffect, useState } from "react";
import { getStats, getHistory, getAnalytics } from "../api/client";
import { DashboardContext } from "./dashboard-context";

export function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, historyData, analyticsData] = await Promise.all([
        getStats(),
        getHistory(),
        getAnalytics(),
      ]);

      setStats(statsData);
      setHistory(Array.isArray(historyData) ? historyData : historyData?.history || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        history,
        analytics,
        loading,
        refreshDashboardData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}