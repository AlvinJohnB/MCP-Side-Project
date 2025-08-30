import { useState, useEffect } from "react";
import { Notyf } from "notyf";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const notyf = new Notyf();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      return notyf.error("Passwords do not match");
    }

    // Uncomment and update the API endpoint as needed
    fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmPassword, fullName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        notyf.success(data.message || "Registration successful!");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      })
      .catch((error) => {
        notyf.error("Error registering user");
        console.error("Error registering:", error.message);
      });
  };

  useEffect(() => {
    if (password === confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  }, [password, confirmPassword]);

  return (
    <div className="auth-wrapper container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-3 py-5 my-5">
          <div className="card card-modern">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient">Join BookingApp</h2>
                <p className="text-muted">
                  Create your account and start your adventure
                </p>
              </div>

              <form id="registerForm" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="regName" className="form-label fw-semibold">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      id="regName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="regEmail" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      id="regEmail"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="regPassword"
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
                      id="regPassword"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="regPassword"
                    className="form-label fw-semibold"
                  >
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      required
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="agreeTerms"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-decoration-none text-primary">
                        Terms of Service{" "}
                      </a>
                      and{" "}
                      <a href="#" className="text-decoration-none text-primary">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div> */}

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-3 fw-semibold"
                >
                  <i className="bi bi-person-plus me-2"></i>Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-decoration-none fw-semibold text-gradient"
                  >
                    Sign in here
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
