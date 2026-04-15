import OTPDemo from "../components/OTPDemo";

export default function OTPPage() {
  return (
    <div>
      <h1 style={styles.heading}>OTP Demo</h1>
      <p style={styles.subheading}>
        Generate secure one-time passwords using validated randomness modes.
      </p>
      <OTPDemo />
    </div>
  );
}

const styles = {
  heading: { fontSize: "40px", marginBottom: "8px" },
  subheading: { color: "#cbd5e1", marginBottom: "24px" },
};