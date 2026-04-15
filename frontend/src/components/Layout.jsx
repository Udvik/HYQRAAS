import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={styles.app}>
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
  },

  main: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    padding: "28px",
  },

  content: {
    position: "relative",
    zIndex: 2,
  },

  bgOrb1: {
    position: "absolute",
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.35), transparent 65%)",
    top: "-80px",
    right: "-80px",
    filter: "blur(18px)",
    animation: "floatOne 7s ease-in-out infinite",
    zIndex: 1,
  },

  bgOrb2: {
    position: "absolute",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,211,238,0.28), transparent 65%)",
    bottom: "-80px",
    left: "-80px",
    filter: "blur(18px)",
    animation: "floatTwo 8s ease-in-out infinite",
    zIndex: 1,
  },
};