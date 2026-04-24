import { useState } from "react";
import { runLottery } from "../api/client";

export default function LotteryPage() {
  const [mode, setMode] = useState("hybrid");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleRun = async () => {
    const list = participants
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (list.length < 2) {
      setError("Enter at least 2 participants separated by commas.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await runLottery(mode, list);
      console.log("Lottery API response:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to run lottery demo.");
    } finally {
      setLoading(false);
    }
  };

  const winner = result?.winner;
  const score = result?.health_score?.score ?? result?.score;
  const label = result?.health_score?.label ?? result?.label;
  const color = result?.health_score?.color ?? result?.color;
  const explanation =
    result?.health_score?.explanation ??
    result?.explanation ??
    "Run the lottery to view validation details.";

  const statusColor =
    color === "green" ? "#22c55e" : color === "orange" ? "#f97316" : "#ef4444";

  const participantCount = participants
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean).length;

  return (
    <>
      <style>{`
        @keyframes floatOne {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(-22px) translateX(12px) scale(1.08); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }

        @keyframes floatTwo {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(18px) translateX(-18px) scale(1.06); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes winnerPop {
          0% { transform: scale(0.65) rotate(-2deg); opacity: 0; }
          60% { transform: scale(1.08) rotate(1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes shimmerMove {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 rgba(34,211,238,0.15); }
          50% { box-shadow: 0 0 36px rgba(34,211,238,0.24), 0 0 70px rgba(139,92,246,0.16); }
          100% { box-shadow: 0 0 0 rgba(34,211,238,0.15); }
        }

        .lottery-fade {
          animation: fadeUp 0.75s ease forwards;
        }

        .lottery-hover {
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }

        .lottery-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 48px rgba(0,0,0,0.28);
          border-color: rgba(255,255,255,0.18);
        }

        .winner-pop {
          animation: winnerPop 0.7s ease forwards;
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
        <div style={styles.gridBg}></div>

        <section style={styles.hero} className="lottery-fade lottery-hover">
          <div style={styles.heroGlow}></div>

          <div style={styles.heroLeft}>
            <div style={styles.badge}>Fair Selection Demo</div>
            <h1 style={styles.title}>Lottery Demo</h1>
            <p style={styles.subtitle}>
              Select a winner using validated randomness. The system returns the
              winner along with health score, mode, status, and validation insight.
            </p>

            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <span style={styles.heroStatLabel}>Participants</span>
                <strong style={styles.heroStatValue}>{participantCount}</strong>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatLabel}>Mode</span>
                <strong style={styles.heroStatValue}>{mode}</strong>
              </div>
              <div style={styles.heroStat}>
                <span style={styles.heroStatLabel}>Recommended</span>
                <strong style={styles.heroStatValue}>Hybrid</strong>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.wheelCard} className="lottery-hover">
              <div style={styles.wheelOuter}>
                <div style={styles.wheelInner}>🎯</div>
              </div>
              <p style={styles.wheelText}>Validated Fair Draw</p>
            </div>
          </div>
        </section>

        <section style={styles.mainGrid}>
          <div style={styles.inputCard} className="lottery-fade lottery-hover">
            <div style={styles.sectionBadge}>Interactive Lottery</div>
            <h2 style={styles.sectionTitle}>Run Fair Selection</h2>
            <p style={styles.sectionText}>
              Enter participant names separated by commas and choose the
              randomness mode used to select the winner.
            </p>

            <div style={styles.controls}>
              <div style={styles.controlBlock}>
                <label style={styles.label}>Randomness Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={styles.select}
                >
                  <option value="quantum" style={{ background: "#ffffff", color: "#000000" }}>Quantum</option>
                  <option value="hybrid" style={{ background: "#ffffff", color: "#000000" }}>Hybrid</option>
                </select>
              </div>

              <div style={styles.controlBlock}>
                <label style={styles.label}>Action</label>
                <button
                  onClick={handleRun}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    opacity: loading ? 0.75 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Selecting..." : "Run Lottery"}
                </button>
              </div>
            </div>

            <textarea
              placeholder="Example: Asha, Rahul, Priya, Kiran"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              style={styles.textarea}
            />

            {error && <div style={styles.error}>{error}</div>}
          </div>

          <div style={styles.resultCard} className="lottery-fade lottery-hover">
            <div style={styles.sectionBadge}>Result Output</div>
            <h2 style={styles.sectionTitle}>Winner & Score</h2>

            {winner ? (
              <div className="winner-pop">
                <div style={styles.winnerBox}>
                  <div style={styles.winnerLabel}>Winner</div>
                  <div style={styles.winner}>{winner}</div>
                  <div style={styles.modeChip}>
                    Mode: {result?.source_mode ?? result?.source ?? mode}
                  </div>
                </div>

                <div style={styles.scoreGrid}>
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreLabel}>Health Score</span>
                    <strong style={styles.scoreValue}>
                      {score !== undefined ? score : "N/A"}
                    </strong>
                  </div>

                  <div style={styles.scoreBox}>
                    <span style={styles.scoreLabel}>Status</span>
                    <strong style={{ ...styles.scoreValue, color: statusColor }}>
                      {label ?? "Generated"}
                    </strong>
                  </div>
                </div>

                <div style={styles.healthTrack}>
                  <div
                    style={{
                      ...styles.healthFill,
                      width: `${Math.max(0, Math.min(Number(score || 0), 100))}%`,
                      background:
                        color === "green"
                          ? "linear-gradient(90deg,#22c55e,#22d3ee,#8b5cf6)"
                          : color === "orange"
                          ? "linear-gradient(90deg,#f97316,#facc15)"
                          : "linear-gradient(90deg,#ef4444,#f97316)",
                    }}
                  >
                    <div style={styles.shimmer}></div>
                  </div>
                </div>

                <div style={styles.explanationBox}>
                  <div style={styles.explanationTitle}>Validation Insight</div>
                  <p style={styles.explanationText}>{explanation}</p>
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🎲</div>
                <p>Run the lottery to reveal a winner and view score details.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "34px",
    position: "relative",
    overflow: "hidden",
  },

  orb1: {
    position: "absolute",
    width: "360px",
    height: "360px",
    background: "radial-gradient(circle, rgba(34,211,238,0.30), transparent 65%)",
    top: "-100px",
    right: "-80px",
    borderRadius: "50%",
    filter: "blur(28px)",
    animation: "floatOne 7s ease-in-out infinite",
    pointerEvents: "none",
  },

  orb2: {
    position: "absolute",
    width: "360px",
    height: "360px",
    background: "radial-gradient(circle, rgba(139,92,246,0.32), transparent 65%)",
    bottom: "-90px",
    left: "-90px",
    borderRadius: "50%",
    filter: "blur(32px)",
    animation: "floatTwo 8s ease-in-out infinite",
    pointerEvents: "none",
  },

  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
    pointerEvents: "none",
  },

  hero: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.35fr 0.8fr",
    gap: "24px",
    padding: "34px",
    borderRadius: "30px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.86), rgba(17,24,39,0.94))",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 20px 46px rgba(0,0,0,0.24)",
    marginBottom: "22px",
    overflow: "hidden",
    zIndex: 2,
  },

  heroGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(34,211,238,0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(236,72,153,0.10), transparent 32%)",
    pointerEvents: "none",
  },

  heroLeft: {
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(34,211,238,0.15)",
    color: "#67e8f9",
    fontWeight: "800",
    fontSize: "12px",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    animation: "glowPulse 3.2s ease-in-out infinite",
  },

  title: {
    fontSize: "48px",
    marginBottom: "12px",
    color: "#f8fafc",
    fontWeight: "850",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "760px",
    marginBottom: "22px",
  },

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    maxWidth: "700px",
  },

  heroStat: {
    padding: "17px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
  },

  heroStatLabel: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  heroStatValue: {
    fontSize: "23px",
    color: "#f8fafc",
    textTransform: "capitalize",
  },

  heroRight: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  wheelCard: {
    width: "250px",
    padding: "22px",
    borderRadius: "28px",
    background:
      "linear-gradient(160deg, rgba(34,211,238,0.12), rgba(139,92,246,0.14), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.09)",
    textAlign: "center",
  },

  wheelOuter: {
    width: "150px",
    height: "150px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    padding: "12px",
    background:
      "conic-gradient(from 90deg, #22d3ee, #8b5cf6, #ec4899, #f97316, #22d3ee)",
    boxShadow: "0 0 32px rgba(34,211,238,0.22)",
  },

  wheelInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "52px",
  },

  wheelText: {
    color: "#dbeafe",
    fontWeight: "700",
  },

  mainGrid: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "22px",
  },

  inputCard: {
    padding: "26px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(8,15,30,0.92), rgba(30,41,59,0.88), rgba(17,24,39,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 42px rgba(0,0,0,0.20)",
  },

  resultCard: {
    padding: "26px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(8,15,30,0.92), rgba(30,41,59,0.88), rgba(17,24,39,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 42px rgba(0,0,0,0.20)",
  },

  sectionBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(139,92,246,0.16)",
    color: "#ddd6fe",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  sectionTitle: {
    fontSize: "31px",
    color: "#f8fafc",
    marginBottom: "8px",
  },

  sectionText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    marginBottom: "18px",
  },

  controls: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },

  controlBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#cbd5e1",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  select: {
    padding: "14px 16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.10)",
    outline: "none",
  },

  button: {
    padding: "14px 18px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#8b5cf6,#22d3ee)",
    color: "#fff",
    border: "none",
    fontWeight: "800",
    boxShadow: "0 12px 26px rgba(34,211,238,0.20)",
  },

  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "15px",
    borderRadius: "18px",
    background: "rgba(2,6,23,0.72)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.10)",
    resize: "vertical",
    outline: "none",
    lineHeight: 1.6,
  },

  error: {
    marginTop: "14px",
    color: "#fca5a5",
    fontSize: "14px",
  },

  winnerBox: {
    padding: "24px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(139,92,246,0.12), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.09)",
    textAlign: "center",
    marginTop: "16px",
    marginBottom: "18px",
  },

  winnerLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px",
  },

  winner: {
    fontSize: "42px",
    fontWeight: "850",
    color: "#22d3ee",
    marginBottom: "14px",
    textShadow: "0 0 22px rgba(34,211,238,0.24)",
  },

  modeChip: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "#dbeafe",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "16px",
  },

  scoreBox: {
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  scoreLabel: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  scoreValue: {
    fontSize: "25px",
    color: "#f8fafc",
  },

  healthTrack: {
    height: "16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: "18px",
  },

  healthFill: {
    height: "100%",
    borderRadius: "999px",
    position: "relative",
    overflow: "hidden",
    transition: "width 0.5s ease",
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "42%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
    animation: "shimmerMove 2.2s linear infinite",
  },

  explanationBox: {
    padding: "18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  explanationTitle: {
    color: "#67e8f9",
    fontWeight: "800",
    marginBottom: "8px",
  },

  explanationText: {
    color: "#cbd5e1",
    lineHeight: 1.8,
    fontSize: "14px",
  },

  emptyState: {
    minHeight: "360px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.12)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#cbd5e1",
    textAlign: "center",
    padding: "24px",
    marginTop: "18px",
  },

  emptyIcon: {
    fontSize: "58px",
    marginBottom: "14px",
  },
};