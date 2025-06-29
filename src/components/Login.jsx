import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();


    // Validasi login
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
      navigate("/dashboard");
    } else {
      // Salah → ke halaman 401
      navigate("/unauthorized");
    }
  };


  // Warna pink dari Home
  const primaryPink = "#ff69b4";


  const styles = {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#fff0f5",
    },
    container: {
      width: "100%",
      maxWidth: "400px",
      padding: "40px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 6px 16px rgba(255, 105, 180, 0.2)",
    },
    title: {
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "24px",
      color: primaryPink,
      fontWeight: "bold",
    },
    formGroup: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "8px",
      fontWeight: "600",
      color: "#444",
    },
    input: {
      padding: "12px",
      fontSize: "15px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      borderRadius: "6px",
      border: "none",
      backgroundColor: primaryPink,
      color: "#fff",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Login ke Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};


export default Login;


