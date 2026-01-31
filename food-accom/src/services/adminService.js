import axios from "axios";

// .NET Admin Service URL
const API_URL = "http://localhost:8080/api/admin";

export const getAllUsers = () => axios.get(`${API_URL}/users`);
export const getAllOwners = () => axios.get(`${API_URL}/owners`);
export const getPendingOwners = () => axios.get(`${API_URL}/owners/pending`);
export const approveOwner = (id) => axios.put(`${API_URL}/owners/${id}/approve`);
export const rejectOwner = (id) => axios.put(`${API_URL}/owners/${id}/reject`);
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`);
export const disableUser = (id) => axios.put(`${API_URL}/users/${id}/disable`);
export const getStats = () => axios.get(`${API_URL}/stats`);
