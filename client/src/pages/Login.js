import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, getUserDetails } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(email, password);

    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Login successful:", data);
        localStorage.setItem("access", data.access);
        getUserDetails(data.access);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  return user !== null ? (
    <Navigate to="/" />
  ) : (
    <div className="container-fluid auth-wrapper">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 my-5 p-lg-5">
          <div className="card card-modern login-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient">Welcome Back</h2>
                <p className="text-muted">
                  Sign in to your account to continue your journey
                </p>
              </div>

              <form id="loginForm" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="loginEmail"
                    className="form-label fw-semibold"
                  >
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      id="loginEmail"
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="loginPassword"
                    className="form-label fw-semibold"
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      id="loginPassword"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none text-primary">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-3 fw-semibold"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>Log In
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold text-gradient"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
