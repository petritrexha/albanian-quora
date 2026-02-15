import { Link } from "react-router-dom";
import "../styles/theme.css";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>AQ</div>

      <input
        type="text"
        placeholder="Search questions..."
        style={styles.search}
      />

      <div>
        <Link to="/create">
          <button style={styles.askBtn}>Ask</button>
        </Link>
        <button style={styles.loginBtn}>Login</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "var(--navbar-bg)",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
  },
  search: {
    width: "40%",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
  },
  askBtn: {
    backgroundColor: "var(--primary-btn)",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    marginRight: "10px",
  },
  loginBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
};
