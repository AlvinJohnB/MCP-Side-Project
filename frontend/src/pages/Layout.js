import React from "react";
import AppNavbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <div className="container-fluid hero-section py-1 py-md-3">
        <AppNavbar />
        <div className="row mt-5">
          <div className="col-12">
            <h1>{children.props.page}</h1>
            <p>{children.props.description}</p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
