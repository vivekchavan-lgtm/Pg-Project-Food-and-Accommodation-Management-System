const registerStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Brand Gradient
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#fff",
    borderRadius: 18,
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
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  fullWidth: {
    gridColumn: "1 / -1",
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
  },
  select: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "#43cea2",
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
    color: "#185a9d",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default registerStyles;
