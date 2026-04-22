import React, { useState } from "react";
import api from "../api";

function UploadData(){
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage(`Upload successful! ${response.data.rows} rows processed.`);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    }
  };

  return(
    <div style={{background:"white", minHeight:"100vh", padding:"20px"}}>
      <div style={{textAlign:"center", marginTop:"50px", background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding:"50px", borderRadius:"15px", maxWidth:"400px", margin:"50px auto", boxShadow:"0 10px 30px rgba(0,0,0,0.3)"}}>

        <h2 style={{color:"white", marginBottom:"30px", fontSize:"28px"}}>Upload Sales Data</h2>

        {message && <p style={{color: message.includes("successful") ? "#4CAF50" : "#FF6B6B", marginBottom:"20px", fontWeight:"bold"}}>{message}</p>}

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{display:"block", margin:"20px auto", padding:"10px", border:"2px solid white", borderRadius:"8px", cursor:"pointer"}}
            required
          /><br/>

          <button
            type="submit"
            style={{width:"80%", padding:"12px", background:"#FF6B6B", color:"white", border:"none", borderRadius:"8px", fontSize:"18px", fontWeight:"bold", cursor:"pointer", transition:"0.3s"}}
          >
            Upload
          </button>
        </form>

      </div>
    </div>
  )
}

export default UploadData;