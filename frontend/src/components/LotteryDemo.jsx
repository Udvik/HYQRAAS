import { useState } from "react";
import { runLotteryDemo } from "../api/client";

export default function LotteryDemo() {
  const [mode, setMode] = useState("hybrid");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleRunLottery = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const participantList = participants
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");

      if (participantList.length < 2) {
        setError("Enter at least 2 participants separated by commas.");
        setLoading(false);
        return;
      }

      const data = await runLotteryDemo(mode, participantList);
      console.log("Lottery API response:", data);
      setResult(data);
    } catch (err) {
      console.error("Lottery generation error:", err);
      setError("Failed to run lottery demo.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const score = result?.health_score?.score ?? result?.score;
  const label = result?.health_score?.label ?? result?.label;
  const color = result?.health_score?.color ?? result?.color;
  const explanation =
    result?.health_score?.explanation ?? result?.explanation;

  const statusColor =
    color === "green"
      ? "#16a34a"
      : color === "orange"
      ? "#ea580c"
      : "#dc2626";

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Lottery Demo</h2>
      <p style={styles.subtitle}>
        Pick a random winner from a participant list using your randomness engine.
      </p>

      <div style={styles.controls}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={styles.select}
        >
          <option value="classical">Classical</option>
          <option value="quantum">Quantum</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <button
          onClick={handleRunLottery}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Selecting..." : "Run Lottery"}
        </button>
      </div>

      <textarea
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
        placeholder="Enter participant names separated by commas. Example: Asha, Rahul, Priya, Kiran"
        style={styles.textarea}
      />

      {error && <div style={styles.error}>{error}</div>}

      {result && (
        <div style={styles.resultCard}>
          <div style={styles.winnerBox}>
            <div style={styles.winnerLabel}>Winner</div>
            <div style={styles.winnerName}>
              {result?.winner ?? result?.selected ?? "Winner selected"}
            </div>
          </div>

          <div style={styles.grid}>
            <div>
              <span style={styles.label}>Source</span>
              <span style={styles.text}>
                {result?.source ?? result?.mode ?? mode}
              </span>
            </div>

            <div>
              <span style={styles.label}>Health Score</span>
              <span style={styles.text}>
                {score !== undefined ? score : "N/A"}
              </span>
            </div>

            <div>
              <span style={styles.label}>Status</span>
              <span style={{ ...styles.status, color: statusColor }}>
                {label ?? "Generated"}
              </span>
            </div>
          </div>

          <div style={styles.explanation}>
            {explanation ?? "Lottery result generated successfully."}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginTop: "24px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "24px",
    color: "#1f2937",
  },

  subtitle: {
    margin: "0 0 18px",
    color: "#6b7280",
    fontSize: "14px",
  },

  controls: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    minWidth: "150px",
  },

  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
  },

  error: {
    marginTop: "4px",
    color: "#dc2626",
    fontSize: "14px",
  },

  resultCard: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  winnerBox: {
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "1px solid #bfdbfe",
    borderRadius: "12px",
    padding: "18px",
    marginBottom: "18px",
    textAlign: "center",
  },

  winnerLabel: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#2563eb",
    marginBottom: "8px",
    fontWeight: "700",
  },

  winnerName: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },

  label: {
    display: "block",
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
    textTransform: "uppercase",
  },

  text: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1f2937",
  },

  status: {
    fontSize: "15px",
    fontWeight: "700",
  },

  explanation: {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
    background: "#ffffff",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #e5e7eb",
  },
};