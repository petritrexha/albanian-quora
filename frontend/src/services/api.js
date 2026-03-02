import axios from "axios";

const api = axios.create({
  baseURL: "http://20.103.169.185/api", // Add /api back here
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;