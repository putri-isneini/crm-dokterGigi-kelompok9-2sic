// src/components/PublicLayout.jsx
import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: "100px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
    