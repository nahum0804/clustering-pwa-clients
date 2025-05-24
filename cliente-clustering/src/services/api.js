import axios from "axios";

const host = "172.24.114.141"; 
const api = axios.create({
  baseURL: `http://${host}:8001/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
    const token = "#";
  //const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
