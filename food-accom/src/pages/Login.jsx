import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });

    login(res.data);

    if (res.data.role === "ADMIN") navigate("/admin");
    else if (res.data.role === "OWNER") navigate("/owner");
    else navigate("/home");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}
