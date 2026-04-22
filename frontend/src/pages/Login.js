import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post("/login", { email, password });
        const user = { email };
        onAuthSuccess?.(user);
        setMessage(res.data?.message || "Login successful.");
        navigate("/dashboard");
      } else {
        const res = await api.post("/register", { name, email, password });
        const user = { name, email };
        onAuthSuccess?.(user);
        setMessage(res.data?.message || "Registration successful.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message ||
          "Unable to connect to the server. Make sure the backend is running on port 5000."
      );
    }
  };

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none"
};

return (
<div style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#eef2f7"
}}>

<div style={{
  width: "350px",
  padding: "30px",
  borderRadius: "15px",
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  textAlign: "center"
}}>

<h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
<p style={{color:"#777"}}>
{isLogin ? "Sign in to your account" : "Start forecasting your sales"}
</p>

{/* Toggle */}
<div style={{
  display: "flex",
  margin: "20px 0",
  background: "#dbe4ff",
  borderRadius: "12px",
  padding: "4px",
  border: "1px solid #b0c7ff"
}}>

<button 
onClick={()=>setIsLogin(true)}
style={{
  flex:1,
  padding:"10px",
  border:"none",
  borderRadius:"8px",
  background: isLogin ? "#1e3a8a" : "transparent",
  color: isLogin ? "#fff" : "#1e3a8a",
  fontWeight: isLogin ? "700" : "600",
  cursor:"pointer"
}}>
Login
</button>

<button 
onClick={()=>setIsLogin(false)}
style={{
  flex:1,
  padding:"10px",
  border:"none",
  borderRadius:"8px",
  background: !isLogin ? "#1e3a8a" : "transparent",
  color: !isLogin ? "#fff" : "#1e3a8a",
  fontWeight: !isLogin ? "700" : "600",
  cursor:"pointer"
}}>
Register
</button>

</div>

<form onSubmit={handleSubmit}>
  {/* Name (Register only) */}
  {!isLogin && (
    <input
      type="text"
      placeholder="Full Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={inputStyle}
      required={!isLogin}
    />
  )}

  <input
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={inputStyle}
    required
  />

  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={inputStyle}
    required
  />

  {message && (
    <div style={{
      marginBottom: "15px",
      color: message.toLowerCase().includes("success") ? "#16a34a" : "#dc2626",
      fontWeight: "600"
    }}>
      {message}
    </div>
  )}

  {/* Button */}
  <button
    type="submit"
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(to right, #4facfe, #8e2de2)",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer"
    }}
  >
    {isLogin ? "Sign In" : "Create Account"}
  </button>
</form>

</div>
</div>
);
}

export default Login;