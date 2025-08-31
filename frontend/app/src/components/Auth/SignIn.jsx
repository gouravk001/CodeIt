import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import api from "../../utils/axiosInstance";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-row h-screen  w-screen items-center justify-center bg-zinc-800 text-white">
    <form onSubmit={handleSubmit} className="flex flex-col border-white border-2 h-fit p-10 rounded-2xl gap-6">
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value.trim())} className="border-white border-3 p-2 rounded-2xl box-border" />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value.trim())} className="border-white border-3 p-2 rounded-2xl box-border"/>
      <button type="submit" className="border-white border-3 p-2 rounded-2xl box-border cursor-pointer">Login</button>
      <div className="w-full text-center cursor-pointer" onClick={()=>{
        navigate("/signUp")
      }}>SignUp</div>
    </form>
    <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
    </div>
  );
}
