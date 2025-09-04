import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Flight from "./Flight";
import BookingCheckout from "./pages/BookingCheckout";

import Layout from "./pages/Layout";
import ManageFlights from "./pages/admin/ManageFlights";
import ManageAirports from "./pages/admin/ManageAirports";
import Payment from "./pages/Payment";
import VerifyPayment from "./pages/VerifyPayment";
import MyBookings from "./pages/MyBookings";

function App() {
  const [user, setUser] = useState(null);

  const getUserDetails = (token) => {
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user details");
          }
        })
        .then((data) => {
          setUser(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user details");
          }
        })
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, getUserDetails }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          <Route
            path="/flight/:id"
            element={
              <Layout>
                <Flight
                  heading="Cart"
                  description="Review your selected destination"
                />
              </Layout>
            }
          />

          <Route
            path="/payment/:id"
            element={
              <Layout>
                <Payment
                  heading="Secure Payment"
                  description="Your information is protected with 256-bit encryption."
                />
              </Layout>
            }
          />

          <Route
            path="/payment/verify/:id"
            element={
              <Layout>
                <VerifyPayment heading="Payment Status" description="" />
              </Layout>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <Layout>
                <MyBookings
                  heading="My Bookings"
                  description="View and manage your bookings."
                />
              </Layout>
            }
          />

          <Route
            path="/bookings/:id"
            element={
              <Layout>
                <BookingCheckout
                  heading="Secure Checkout"
                  description="Complete your booking in just a few steps."
                />
              </Layout>
            }
          />

          <Route
            path="/admin/manage-flights"
            element={
              <Layout>
                <ManageFlights
                  heading="Manage Flights"
                  description="Manage your flights here."
                />
              </Layout>
            }
          />

          <Route
            path="/admin/manage-airports"
            element={
              <Layout>
                <ManageAirports
                  heading="Manage Airports"
                  description="Manage airports here."
                />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
