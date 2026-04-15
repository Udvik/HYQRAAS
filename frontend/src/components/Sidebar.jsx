import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "Generator", path: "/generator" },
  { name: "Analytics", path: "/analytics" },
  { name: "OTP Demo", path: "/otp" },
  { name: "Lottery Demo", path: "/lottery" },
  { name: "History", path: "/history" },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoWrap}>
        <div style={styles.logo}>H</div>
        <div>
          <h2 style={styles.title}>HyQRaaS</h2>
          <p style={styles.sub}>Quantum Randomness Suite</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div style={styles.footerCard}>
        <div style={styles.footerBadge}>Recommended</div>
        <h4 style={styles.footerTitle}>Hybrid Mode</h4>
        <p style={styles.footerText}>
          Highest trust, multi-source entropy, and stable output quality.
        </p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "270px",
    minHeight: "100vh",
    padding: "24px 18px",
    background: "rgba(8, 15, 30, 0.78)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "sticky",
    top: 0,
  },

  logoWrap: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    padding: "8px 6px 14px",
  },

  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    color: "#fff",
    boxShadow: "0 0 24px rgba(139,92,246,0.45)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
  },

  sub: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    padding: "14px 16px",
    borderRadius: "14px",
    color: "#dbeafe",
    fontWeight: "500",
    transition: "0.25s ease",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid transparent",
  },

  activeLink: {
    background: "linear-gradient(135deg, rgba(139,92,246,0.28), rgba(34,211,238,0.2))",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 0 18px rgba(34,211,238,0.12)",
    transform: "translateX(4px)",
  },

  footerCard: {
    marginTop: "auto",
    padding: "16px",
    borderRadius: "18px",
    background: "linear-gradient(180deg, rgba(139,92,246,0.18), rgba(34,211,238,0.12))",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  footerBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(34,211,238,0.18)",
    color: "#67e8f9",
    fontSize: "11px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  footerTitle: {
    fontSize: "18px",
    marginBottom: "8px",
  },

  footerText: {
    fontSize: "13px",
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
};