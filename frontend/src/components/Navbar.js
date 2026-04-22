import React from "react";
import { Link } from "react-router-dom";

function Navbar({ authUser, onLogout }) {
  return (
    <div style={{
      background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding:"20px",
      boxShadow:"0 5px 15px rgba(0,0,0,0.3)",
      display:"flex",
      gap:"30px"
    }}>
      
      {authUser ? (
        <>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none", fontSize: "16px", fontWeight: "bold" }}>
            Dashboard
          </Link>
          <Link to="/upload" style={{ color: "white", textDecoration: "none", fontSize: "16px", fontWeight: "bold" }}>
            Upload Data
          </Link>
          <span style={{ color: "white", fontSize: "16px", fontWeight: "600", marginLeft: "auto" }}>
            {authUser.name || authUser.email}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "white",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
            background: "rgba(255,255,255,0.2)",
            padding: "8px 15px",
            borderRadius: "8px"
          }}
        >
          Login / Register
        </Link>
      )}

    </div>
  );
}

export default Navbar;