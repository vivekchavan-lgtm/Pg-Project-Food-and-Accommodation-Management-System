import { useState } from "react";
import { registerUser } from "../api/authApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    gender: "",
    city: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration Successful");
    } catch {
      alert("Email already exists");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="mobileNo" placeholder="Mobile" onChange={handleChange} />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <button>Register</button>
    </form>
  );
}
