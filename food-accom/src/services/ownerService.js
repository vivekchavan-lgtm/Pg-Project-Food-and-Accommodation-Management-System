import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Owners
export const getAllOwners = () => axios.get(`${API_URL}/admin/owners`);
export const getOwnerById = (id) => axios.get(`${API_URL}/admin/owners/${id}`);
export const getOwnersByType = (type) => axios.get(`${API_URL}/admin/owners/type/${type}`);

// Ratings
export const getOwnerRatings = (ownerId) => axios.get(`${API_URL}/ratings/${ownerId}`);
export const getAverageRating = (ownerId) => axios.get(`${API_URL}/ratings/${ownerId}/average`);
export const addRating = (ratingData) => axios.post(`${API_URL}/ratings`, ratingData);
