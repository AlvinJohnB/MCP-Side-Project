import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // Redirect to login after 1 second (so user sees logout message briefly)
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>You have been logged out</h2>
        <p>Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default Logout;
