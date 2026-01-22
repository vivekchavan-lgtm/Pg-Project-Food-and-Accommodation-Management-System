import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const registerUser = (data) =>
  axios.post(`${API_URL}/register`, data);

export const loginUser = (credentials) =>
  axios.post(`${API_URL}/login`, credentials);
