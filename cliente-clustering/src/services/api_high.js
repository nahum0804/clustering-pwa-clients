import axios from "axios";

const apiC = axios.create({
    baseURL: "http://172.24.104.248:8000/api", // Cambia esto a la URL de tu API
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