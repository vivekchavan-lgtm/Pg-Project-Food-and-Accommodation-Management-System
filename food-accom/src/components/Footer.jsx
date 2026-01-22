export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © {new Date().getFullYear()} Food & PG Finder. All rights reserved.
        </p>

        <div style={styles.links}>
          <a href="#" style={styles.link}>Privacy</a>
          <a href="#" style={styles.link}>Terms</a>
          <a href="#" style={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "auto",
    padding: "16px 20px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #ddd",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  links: {
    display: "flex",
    gap: 14,
  },
  link: {
    fontSize: 14,
    color: "#667eea",
    textDecoration: "none",
    fontWeight: 500,
  },
};
