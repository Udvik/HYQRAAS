import { useState } from "react";

export default function GeneratorForm({ onGenerate, loading }) {
  const [mode, setMode] = useState("hybrid");
  const [keyLength, setKeyLength] = useState(64);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      mode,
      key_length: Number(keyLength),
    });
  };

  return (
    <div style={styles.card}>
      <h2>Generate Key</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={styles.input}>
            <option value="classical">Classical</option>
            <option value="quantum">Quantum</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>

        <label>
          Key Length (bytes):
          <input
            type="number"
            min="1"
            max="2048"
            value={keyLength}
            onChange={(e) => setKeyLength(e.target.value)}
            style={styles.input}
          />
        </label>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    display: "block",
    marginTop: "6px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
},
};