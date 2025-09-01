import axios from "axios";
import { useNavigate } from "react-router-dom";


const api = axios.create({
  baseURL: "https://codeit-tqhd.onrender.com",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signIn";
    }
    return Promise.reject(error);
  }
);

export default api;
