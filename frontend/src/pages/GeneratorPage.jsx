import { useState } from "react";
import GlassCard from "../components/GlassCard";
import { generateKey } from "../api/client";
import { useDashboard } from "../context/dashboard-context";

export default function GeneratorPage() {
  const [mode, setMode] = useState("hybrid");
  const [length, setLength] = useState(128);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const { refreshDashboardData } = useDashboard();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await generateKey(mode, Number(length));
      setResult(data);

      await refreshDashboardData();
    } catch (err) {
      console.error("Generate key error:", err);
      setError("Failed to generate key.");
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
    <div>
      <h1 style={styles.heading}>Key Generator</h1>
      <p style={styles.subheading}>
        Generate validated keys using classical, quantum, or hybrid randomness.
      </p>

      <div style={styles.grid}>
        <GlassCard title="Generate New Key">
          <div style={styles.formGroup}>
            <label style={styles.label}>Mode</label>
            <select
              style={styles.input}
              value={mode}  
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="hybrid" style={{ background: "#ffffff", color: "#000000" }}>
                Hybrid(Recommended)
              </option>
              
              <option value="quantum" style={{ background: "#ffffff", color: "#000000" }}>
                Quantum
              </option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Key Length</label>
            <input
              style={styles.input}
              type="number"
              min="1"
              max="128"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Key"}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </GlassCard>

        <GlassCard title="Generated Output">
          {result ? (
            <>
              <div style={styles.keyBox}>
                {result?.generated_key ??
                  result?.key ??
                  result?.key_hex ??
                  "No key returned"}
              </div>

              <div style={styles.metaGrid}>
                <div>
                  <span style={styles.metaLabel}>Source</span>
                  <span style={styles.metaValue}>
                    {result?.source ?? result?.mode ?? mode}
                  </span>
                </div>

                <div>
                  <span style={styles.metaLabel}>Health Score</span>
                  <span style={styles.metaValue}>
                    {score !== undefined ? score : "N/A"}
                  </span>
                </div>

                <div>
                  <span style={styles.metaLabel}>Status</span>
                  <span style={{ ...styles.metaValue, color: statusColor }}>
                    {label ?? "Generated"}
                  </span>
                </div>

                <div>
                  <span style={styles.metaLabel}>Latency</span>
                  <span style={styles.metaValue}>
                    {result?.latency_ms ?? "N/A"} ms
                  </span>
                </div>
              </div>

              <div style={styles.healthWrap}>
                <div style={styles.healthHeader}>
                  <span>Health Score</span>
                  <strong>{score !== undefined ? score : "N/A"}</strong>
                </div>
                <div style={styles.track}>
                  <div
                    style={{
                      ...styles.fill,
                      width: `${Math.max(0, Math.min(Number(score || 0), 100))}%`,
                      background:
                        color === "green"
                          ? "linear-gradient(90deg, #22c55e, #22d3ee)"
                          : color === "orange"
                            ? "linear-gradient(90deg, #f97316, #facc15)"
                            : "linear-gradient(90deg, #ef4444, #f97316)",
                    }}
                  />
                </div>
              </div>

              <p style={styles.explain}>
                {explanation ?? "Key generated successfully."}
              </p>
            </>
          ) : (
            <div style={styles.placeholder}>
              No key generated yet. Choose a mode and click Generate Key.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: "40px", marginBottom: "8px" },

  subheading: {
    color: "#cbd5e1",
    marginBottom: "24px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  formGroup: {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#cbd5e1",
    fontSize: "14px",
  },

  input: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
  },

  button: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "8px",
  },

  error: {
    marginTop: "12px",
    color: "#fca5a5",
    fontSize: "14px",
  },

  placeholder: {
    color: "#cbd5e1",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  keyBox: {
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "16px",
    wordBreak: "break-all",
    marginBottom: "18px",
    color: "#fff",
  },

  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  metaLabel: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "4px",
    textTransform: "uppercase",
  },

  metaValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#e2e8f0",
  },

  healthWrap: {
    marginBottom: "16px",
  },

  healthHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#e2e8f0",
  },

  track: {
    height: "16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },

  explain: {
    color: "#cbd5e1",
    lineHeight: 1.7,
  },
};