import axios from "axios";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

const api = axios.create({
  baseURL: "https://codeit-tqhd.onrender.com",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      navigate("/signIn");
    }
    return Promise.reject(error);
  }
);

export default api;
