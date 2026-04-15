import { useState } from "react";
import { generateOtp } from "../api/client";

export default function OTPDemo() {
  const [mode, setMode] = useState("hybrid");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await generateOtp(mode);
      console.log("OTP API response:", data);
      setResult(data);
    } catch (err) {
      console.error("OTP generation error:", err);
      setError("Failed to generate OTP.");
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
      <h2 style={styles.title}>OTP Demo</h2>
      <p style={styles.subtitle}>
        Generate a 6-digit OTP using your randomness engine.
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
          onClick={handleGenerate}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Generating..." : "Generate OTP"}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {result && (
        <div style={styles.resultCard}>
          <div style={styles.otpValue}>
            {result?.otp ?? result?.code ?? result?.value ?? "OTP"}
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
            {explanation ?? "OTP generated successfully."}
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
    marginBottom: "18px",
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

  error: {
    marginTop: "10px",
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

  otpValue: {
    fontSize: "34px",
    fontWeight: "700",
    letterSpacing: "6px",
    color: "#111827",
    marginBottom: "18px",
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