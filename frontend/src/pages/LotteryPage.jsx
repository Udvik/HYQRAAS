import { useState } from "react";
import { runLottery } from "../api/client";

export default function LotteryPage() {
  const [mode, setMode] = useState("hybrid");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    if (!participants.trim()) return;

    try {
      setLoading(true);
      setResult(null);

      const list = participants.split(",").map((p) => p.trim());

      const data = await runLottery(mode, list);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const winner = result?.winner;

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes glow {
          0% { box-shadow: 0 0 0 rgba(139,92,246,0.2); }
          50% { box-shadow: 0 0 40px rgba(34,211,238,0.25); }
          100% { box-shadow: 0 0 0 rgba(139,92,246,0.2); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes winnerPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>

        <div style={styles.container}>
          <h1 style={styles.title}>🎰 Lottery Demo</h1>
          <p style={styles.subtitle}>
            Select a winner using validated randomness — fair, secure, and transparent.
          </p>

          <div style={styles.card}>
            <div style={styles.controls}>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={styles.select}
              >
                <option value="quantum">Quantum</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <button onClick={handleRun} style={styles.button}>
                {loading ? "Selecting..." : "Run Lottery"}
              </button>
            </div>

            <textarea
              placeholder="Enter participants (comma separated)"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              style={styles.textarea}
            />

            {winner && (
              <div style={styles.resultBox}>
                <div style={styles.winnerLabel}>Winner</div>
                <div style={styles.winner}>{winner}</div>
                <div style={styles.meta}>
                  Mode: {mode.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    position: "relative",
    overflow: "hidden",
  },

  orb1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #22d3ee, transparent)",
    top: "-50px",
    right: "-50px",
    borderRadius: "50%",
    filter: "blur(40px)",
    animation: "float 6s ease-in-out infinite",
  },

  orb2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #8b5cf6, transparent)",
    bottom: "-60px",
    left: "-60px",
    borderRadius: "50%",
    filter: "blur(50px)",
    animation: "float 8s ease-in-out infinite",
  },

  container: {
    maxWidth: "800px",
    margin: "auto",
    textAlign: "center",
    animation: "fadeUp 0.8s ease",
  },

  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "30px",
    borderRadius: "20px",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    animation: "glow 4s infinite",
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "center",
  },

  select: {
    padding: "10px",
    borderRadius: "10px",
    background: "#0f172a",
    color: "#fff",
  },

  button: {
    padding: "10px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    borderRadius: "12px",
    background: "#020617",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.1)",
    marginBottom: "20px",
  },

  resultBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(34,211,238,0.1)",
    animation: "winnerPop 0.6s ease",
  },

  winnerLabel: {
    fontSize: "14px",
    color: "#94a3b8",
  },

  winner: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#22d3ee",
  },

  meta: {
    fontSize: "13px",
    color: "#cbd5e1",
  },
};