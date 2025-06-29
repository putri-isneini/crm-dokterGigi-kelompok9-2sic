import React from "react";
import { Link } from "react-router-dom";


const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1 style={{ color: "#e91e63", fontSize: "3rem" }}>401 - Tidak Diizinkan</h1>
      <p style={{ fontSize: "1.2rem" }}>
        Anda tidak memiliki akses atau data login salah.
      </p>
      <Link to="/login" style={{ color: "#e91e63", textDecoration: "underline" }}>
        Kembali ke Login
      </Link>
    </div>
  );
};


export default Unauthorized;


