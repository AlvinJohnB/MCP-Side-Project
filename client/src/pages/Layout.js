import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import AppNavbar from "../components/Navbar";
import { Navigate } from "react-router-dom";

export default function Layout({ children }) {
  const { user } = useContext(UserContext);

  //   if (user === null) {
  //     return <Navigate to="/login" />;
  //   }

  return (
    <>
      <div className="container-fluid hero-section py-1 py-md-3">
        <AppNavbar />
        <div className="row mt-5">
          <div className="col-12 ">
            <h1>{children.props.heading}</h1>
            <p>{children.props.description}</p>
          </div>
        </div>
      </div>

      {/* Destinations */}
      <div className="container-fluid bg-light py-5">{children}</div>

      <footer className="text-center bg-light py-4">
        <p className="mb-0">
          &copy; 2025 BookingApp. All rights reserved. Designed by: Krisha
          Fabonan, Cherilyn Abe, Alvin John Bregana
        </p>
      </footer>
    </>
  );
}
