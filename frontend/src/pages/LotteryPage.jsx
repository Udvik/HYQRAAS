import LotteryDemo from "../components/LotteryDemo";

export default function LotteryPage() {
  return (
    <div>
      <h1 style={styles.heading}>Lottery Demo</h1>
      <p style={styles.subheading}>
        Demonstrate fair winner selection powered by validated randomness.
      </p>
      <LotteryDemo />
    </div>
  );
}

const styles = {
  heading: { fontSize: "40px", marginBottom: "8px" },
  subheading: { color: "#cbd5e1", marginBottom: "24px" },
};