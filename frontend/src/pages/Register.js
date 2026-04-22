import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register({ onAuthSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", {
        name,
        email,
        password,
      });
      const user = { name, email };
      onAuthSuccess?.(user);
      setMessage("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message ||
          "Registration failed. Please make sure the backend is running."
      );
    }
  };

  return (
    <div style={{background:"white", minHeight:"100vh", padding:"20px"}}>
      <div style={{textAlign:"center", marginTop:"50px", background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding:"50px", borderRadius:"15px", maxWidth:"400px", margin:"50px auto", boxShadow:"0 10px 30px rgba(0,0,0,0.3)"}}>

        <h2 style={{color:"white", marginBottom:"30px", fontSize:"28px"}}>Register</h2>

        {message && <p style={{color: message.includes("successful") ? "#4CAF50" : "#FF6B6B", marginBottom:"20px", fontWeight:"bold"}}>{message}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{width:"100%", padding:"12px", marginBottom:"15px", border:"none", borderRadius:"8px", fontSize:"16px", boxSizing:"border-box"}}
            required
          /><br/>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{width:"100%", padding:"12px", marginBottom:"15px", border:"none", borderRadius:"8px", fontSize:"16px", boxSizing:"border-box"}}
            required
          /><br/>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width:"100%", padding:"12px", marginBottom:"20px", border:"none", borderRadius:"8px", fontSize:"16px", boxSizing:"border-box"}}
            required
          /><br/>

          <button
            type="submit"
            style={{width:"100%", padding:"12px", background:"#FF6B6B", color:"white", border:"none", borderRadius:"8px", fontSize:"18px", fontWeight:"bold", cursor:"pointer", transition:"0.3s", marginTop:"10px"}}
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
}

export default Register;