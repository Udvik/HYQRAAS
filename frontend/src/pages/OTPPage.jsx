import { useState } from "react";
import { generateOtp } from "../api/client";

export default function OTPPage() {
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
    <>
      <style>{`
        @keyframes floatOrbOne {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(-18px) translateX(10px) scale(1.05); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }

        @keyframes floatOrbTwo {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(14px) translateX(-14px) scale(1.06); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }

        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 rgba(34,211,238,0.15), 0 0 0 rgba(139,92,246,0.15); }
          50% { box-shadow: 0 0 30px rgba(34,211,238,0.22), 0 0 60px rgba(139,92,246,0.18); }
          100% { box-shadow: 0 0 0 rgba(34,211,238,0.15), 0 0 0 rgba(139,92,246,0.15); }
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(26px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmerMove {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        .otp-page-animate {
          animation: fadeSlideUp 0.8s ease forwards;
        }

        .otp-page-delay-1 {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease forwards;
          animation-delay: 0.12s;
        }

        .otp-page-delay-2 {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease forwards;
          animation-delay: 0.24s;
        }

        .otp-page-delay-3 {
          opacity: 0;
          animation: fadeSlideUp 0.8s ease forwards;
          animation-delay: 0.36s;
        }

        .otp-hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .otp-hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0,0,0,0.28);
          border-color: rgba(255,255,255,0.16);
        }
      `}</style>

      <div style={styles.page}>
        <div style={styles.bgOrbOne}></div>
        <div style={styles.bgOrbTwo}></div>
        <div style={styles.bgGrid}></div>

        <section style={styles.hero} className="otp-page-animate otp-hover-lift">
          <div style={styles.heroGlow}></div>

          <div style={styles.heroLeft}>
            <div style={styles.badge}>Secure OTP Experience</div>

            <h1 style={styles.heading}>
              OTP Demo
              <span style={styles.headingAccent}> • Live & Validated</span>
            </h1>

            <p style={styles.subheading}>
              Generate secure one-time passwords using validated randomness
              modes. The OTP generation, score, status, and explanation are all
              built directly into this premium interactive section.
            </p>

            <div style={styles.heroStats}>
              <div style={styles.heroStatCard} className="otp-page-delay-1 otp-hover-lift">
                <span style={styles.heroStatLabel}>Security</span>
                <strong style={styles.heroStatValue}>High</strong>
              </div>

              <div style={styles.heroStatCard} className="otp-page-delay-2 otp-hover-lift">
                <span style={styles.heroStatLabel}>Validation</span>
                <strong style={styles.heroStatValue}>Live</strong>
              </div>

              <div style={styles.heroStatCard} className="otp-page-delay-3 otp-hover-lift">
                <span style={styles.heroStatLabel}>Recommended</span>
                <strong style={styles.heroStatValue}>Hybrid</strong>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.phoneMock} className="otp-hover-lift">
              <div style={styles.phoneTopBar}></div>
              <div style={styles.phoneScreen}>
                <div style={styles.phoneBadge}>OTP Preview</div>
                <div style={styles.phoneOtp}>
                  {result?.otp ?? result?.code ?? result?.value ?? "482 913"}
                </div>
                <div style={styles.phoneMeta}>
                  Source: {result?.source_mode ?? result?.source ?? mode}
                </div>
                <div style={styles.phoneHealthWrap}>
                  <div style={styles.phoneHealthTrack}>
                    <div
                      style={{
                        ...styles.phoneHealthFill,
                        width: `${Math.max(0, Math.min(Number(score || 92), 100))}%`,
                        background:
                          color === "green"
                            ? "linear-gradient(90deg, #22c55e, #22d3ee, #8b5cf6)"
                            : color === "orange"
                            ? "linear-gradient(90deg, #f97316, #facc15, #fb7185)"
                            : "linear-gradient(90deg, #ef4444, #f97316, #fb7185)",
                      }}
                    ></div>
                    <div style={styles.phoneShimmer}></div>
                  </div>
                </div>
                <div style={styles.phoneHint}>
                  {explanation ?? "Validated randomness • strong entropy"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.infoGrid}>
          <div style={styles.infoCard} className="otp-page-delay-1 otp-hover-lift">
            <div style={styles.infoIcon}>⚡</div>
            <div>
              <h3 style={styles.infoTitle}>Fast Generation</h3>
              <p style={styles.infoText}>
                Generate OTPs instantly using your selected randomness source.
              </p>
            </div>
          </div>

          <div style={styles.infoCard} className="otp-page-delay-2 otp-hover-lift">
            <div style={styles.infoIcon}>🛡️</div>
            <div>
              <h3 style={styles.infoTitle}>Health Scored</h3>
              <p style={styles.infoText}>
                Every OTP is backed by score-based quality validation.
              </p>
            </div>
          </div>

          
        </section>

        <section style={styles.generatorSection} className="otp-page-delay-2">
          <div style={styles.generatorCard}>
            <div style={styles.generatorHeader}>
              <div>
                <div style={styles.generatorBadge}>Interactive Generator</div>
                <h2 style={styles.generatorTitle}>Generate OTP</h2>
                <p style={styles.generatorSubtitle}>
                  Choose a randomness mode and generate a validated one-time password.
                </p>
              </div>
            </div>

            <div style={styles.controlsRow}>
              <div style={styles.controlBlock}>
                <label style={styles.controlLabel}>Select Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={styles.select}
                >
                  
                  <option value="hybrid" style={{ background: "#ffffff", color: "#000000" }}>
                Hybrid
              </option>
              
              <option value="quantum" style={{ background: "#ffffff", color: "#000000" }}>
                Quantum
              </option>
                </select>
              </div>

              <div style={styles.controlBlock}>
                <label style={styles.controlLabel}>Action</label>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  style={styles.button}
                >
                  {loading ? "Generating..." : "Generate OTP"}
                </button>
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.resultGrid}>
              <div style={styles.resultMainCard} className="otp-hover-lift">
                <div style={styles.resultMainLabel}>Generated OTP</div>
                <div style={styles.resultMainValue}>
                  {result?.otp ?? result?.code ?? result?.value ?? "------"}
                </div>
                <div style={styles.modeChip}>
                  {result?.source_mode ?? result?.source ?? mode}
                </div>
              </div>

              <div style={styles.resultSideCard} className="otp-hover-lift">
                <div style={styles.resultMiniRow}>
                  <span style={styles.resultMiniLabel}>Health Score</span>
                  <strong style={styles.resultMiniValue}>
                    {score !== undefined ? score : "N/A"}
                  </strong>
                </div>

                <div style={styles.healthTrack}>
                  <div
                    style={{
                      ...styles.healthFill,
                      width: `${Math.max(0, Math.min(Number(score || 0), 100))}%`,
                      background:
                        color === "green"
                          ? "linear-gradient(90deg, #22c55e, #22d3ee)"
                          : color === "orange"
                          ? "linear-gradient(90deg, #f97316, #facc15)"
                          : "linear-gradient(90deg, #ef4444, #f97316)",
                    }}
                  ></div>
                </div>

                <div style={styles.resultMiniRow}>
                  <span style={styles.resultMiniLabel}>Status</span>
                  <strong style={{ ...styles.resultMiniValue, color: statusColor }}>
                    {label ?? "Generated"}
                  </strong>
                </div>
              </div>
            </div>

            <div style={styles.explanationBox} className="otp-hover-lift">
              <div style={styles.explanationTitle}>Validation Insight</div>
              <p style={styles.explanationText}>
                {explanation ?? "Generate an OTP to view validation details and score explanation."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100%",
    overflow: "hidden",
    paddingBottom: "12px",
  },

  bgOrbOne: {
    position: "absolute",
    top: "-80px",
    right: "-60px",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,211,238,0.20), transparent 65%)",
    filter: "blur(20px)",
    animation: "floatOrbOne 7s ease-in-out infinite",
    pointerEvents: "none",
  },

  bgOrbTwo: {
    position: "absolute",
    bottom: "40px",
    left: "-70px",
    width: "340px",
    height: "340px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 65%)",
    filter: "blur(24px)",
    animation: "floatOrbTwo 8s ease-in-out infinite",
    pointerEvents: "none",
  },

  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
    pointerEvents: "none",
  },

  hero: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.35fr 0.9fr",
    gap: "24px",
    padding: "34px",
    borderRadius: "30px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.90), rgba(30,41,59,0.85), rgba(17,24,39,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.26)",
    marginBottom: "22px",
    overflow: "hidden",
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
    background: "rgba(34,211,238,0.14)",
    color: "#67e8f9",
    fontWeight: "700",
    fontSize: "12px",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
    animation: "glowPulse 3.2s ease-in-out infinite",
  },

  heading: {
    fontSize: "48px",
    lineHeight: 1.1,
    marginBottom: "14px",
    color: "#f8fafc",
    fontWeight: "800",
  },

  headingAccent: {
    color: "#67e8f9",
    fontWeight: "700",
  },

  subheading: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "760px",
    marginBottom: "24px",
  },

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    maxWidth: "720px",
  },

  heroStatCard: {
    padding: "18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
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
    fontSize: "24px",
    color: "#f8fafc",
    fontWeight: "700",
  },

  heroRight: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  phoneMock: {
    width: "290px",
    padding: "14px",
    borderRadius: "30px",
    background:
      "linear-gradient(180deg, rgba(17,24,39,0.95), rgba(30,41,59,0.95))",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.32)",
  },

  phoneTopBar: {
    width: "90px",
    height: "8px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    margin: "0 auto 16px",
  },

  phoneScreen: {
    borderRadius: "24px",
    padding: "22px",
    background:
      "linear-gradient(160deg, rgba(34,211,238,0.10), rgba(139,92,246,0.12), rgba(15,23,42,0.88))",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  },

  phoneBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "#e2e8f0",
    fontSize: "11px",
    marginBottom: "18px",
  },

  phoneOtp: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "5px",
    marginBottom: "10px",
    textShadow: "0 0 20px rgba(34,211,238,0.28)",
  },

  phoneMeta: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "18px",
  },

  phoneHealthWrap: {
    marginBottom: "14px",
  },

  phoneHealthTrack: {
    height: "14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    position: "relative",
  },

  phoneHealthFill: {
    height: "100%",
    borderRadius: "999px",
  },

  phoneShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "40%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.38), transparent)",
    animation: "shimmerMove 2.4s linear infinite",
  },

  phoneHint: {
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  infoCard: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    padding: "20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
    backdropFilter: "blur(14px)",
  },

  infoIcon: {
    width: "52px",
    height: "52px",
    minWidth: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(34,211,238,0.20))",
    boxShadow: "0 0 18px rgba(34,211,238,0.12)",
  },

  infoTitle: {
    color: "#f8fafc",
    fontSize: "18px",
    marginBottom: "6px",
  },

  infoText: {
    color: "#cbd5e1",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  generatorSection: {
    position: "relative",
  },

  generatorCard: {
    padding: "26px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(8,15,30,0.92), rgba(30,41,59,0.88), rgba(17,24,39,0.92))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.20)",
  },

  generatorHeader: {
    marginBottom: "20px",
  },

  generatorBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "rgba(139,92,246,0.16)",
    color: "#ddd6fe",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "12px",
  },

  generatorTitle: {
    fontSize: "32px",
    color: "#f8fafc",
    marginBottom: "8px",
  },

  generatorSubtitle: {
    color: "#cbd5e1",
    lineHeight: 1.7,
  },

  controlsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },

  controlBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  controlLabel: {
    color: "#cbd5e1",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  select: {
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(34,211,238,0.20)",
  },

  error: {
    marginBottom: "16px",
    color: "#fca5a5",
    fontSize: "14px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "18px",
    marginBottom: "18px",
  },

  resultMainCard: {
    padding: "24px",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(34,211,238,0.10), rgba(139,92,246,0.10), rgba(255,255,255,0.04))",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
  },

  resultMainLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "12px",
  },

  resultMainValue: {
    fontSize: "46px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "6px",
    marginBottom: "16px",
    textShadow: "0 0 20px rgba(34,211,238,0.22)",
  },

  modeChip: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "#dbeafe",
    fontSize: "13px",
    fontWeight: "700",
  },

  resultSideCard: {
    padding: "20px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "16px",
  },

  resultMiniRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  resultMiniLabel: {
    color: "#94a3b8",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  resultMiniValue: {
    color: "#f8fafc",
    fontSize: "22px",
    fontWeight: "700",
  },

  healthTrack: {
    height: "16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  healthFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },

  explanationBox: {
    padding: "20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  explanationTitle: {
    color: "#67e8f9",
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  explanationText: {
    color: "#cbd5e1",
    lineHeight: 1.8,
    fontSize: "15px",
  },
};