import axios from "axios";

const apiC = axios.create({
  baseURL: "http://localhost:8001/api", 
  headers: {
    "Content-Type": "application/json",
  },
});


apiC.interceptors.request.use((config) => {
    const token = "#";
  //const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiC;
