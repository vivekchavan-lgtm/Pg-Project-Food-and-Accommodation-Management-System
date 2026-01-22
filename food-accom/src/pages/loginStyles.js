const loginStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 16,
    padding: "32px 28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  title: {
    marginBottom: 6,
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
  },
  button: {
    marginTop: 10,
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14,
  },
  link: {
    color: "#667eea",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default loginStyles;
