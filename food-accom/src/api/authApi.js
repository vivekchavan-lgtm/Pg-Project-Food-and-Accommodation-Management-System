import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_SPRING_API}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
