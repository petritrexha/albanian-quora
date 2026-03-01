import axios from "axios";

const api = axios.create({
  // UPDATE THIS LINE WITH YOUR NEW BACKEND IP
  baseURL: "http://20.103.169.185",
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