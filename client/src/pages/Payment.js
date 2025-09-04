import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import gcash from "../images/gcash.png";
import maya from "../images/maya.png";

export default function Payment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryYear: "",
    expiryMonth: "",
    cvc: "",
    cardholderName: "",
  });

  // Fetch booking information when component mounts
  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bookings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBooking(data.booking);
        } else {
          const error = await response.json();
          console.error("Error fetching booking info:", error);
        }
      } catch (error) {
        console.error("Error fetching booking info:", error);
      }
    };

    fetchBookingInfo();
  }, []);

  const handlePaymentSubmit = async (method) => {
    // Handle payment submission logic here
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bookings/${id}/${method}/payment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
      }

      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch {
      Swal.fire("Error processing payment");
      console.error("Error processing payment");
    }
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    console.log(cardDetails);

    if (
      cardDetails.expiryYear.length !== 4 ||
      isNaN(cardDetails.expiryYear) ||
      cardDetails.expiryYear < new Date().getFullYear()
    ) {
      Swal.fire(
        "Invalid Expiry Year",
        "Please enter a valid 4-digit year.",
        "error"
      );
      return;
    }

    if (
      cardDetails.expiryMonth.length !== 2 ||
      isNaN(cardDetails.expiryMonth) ||
      cardDetails.expiryMonth < 1 ||
      cardDetails.expiryMonth > 12
    ) {
      Swal.fire(
        "Invalid Expiry Month",
        "Please enter a valid 2-digit month.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bookings/${id}/card/payment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cardDetails }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        console.log(error);
      }
      const data = await response.json();
      if (data.redirect_url === null) {
        navigate(`/payment/verify/${id}`);
        // console.log(data);
      } else {
        window.location.href = data.redirect_url;
        // console.log(data);
      }
    } catch {
      Swal.fire("Error processing payment");
    }
  };

  return (
    <form
      className="col-12 col-lg-10 mx-lg-auto d-md-flex"
      onSubmit={handleCardPayment}
    >
      <div className="col-12 col-md-8 my-3">
        <div className="row text-dark mx-auto mb-3  manage-flight-wrapper">
          <div className="col-12 text-white p-2 d-flex manage-flight-header">
            <h3 className="px-4">Payment Method</h3>
          </div>

          <div className="bg-light col-12 p-4 manage-flight-body">
            {/* Payment Method Select */}
            <div className="d-flex mb-3">
              <div className="col-6">
                <input
                  type="radio"
                  className="form-check-input mx-2"
                  name="paymentMethod"
                  value="card"
                  onChange={() => setPaymentMethod("card")}
                  checked={paymentMethod === "card"}
                />
                <i className="bi bi-credit-card me-2"></i>
                <strong>Credit Card</strong>
              </div>

              <div className="col-6">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="form-check-input mx-2"
                  value="digital_wallet"
                  onChange={() => setPaymentMethod("wallet")}
                  checked={paymentMethod === "wallet"}
                />
                <i className="bi bi-phone me-2"></i>
                <strong>Digital Wallet</strong>
              </div>
            </div>
            {paymentMethod === "card" ? (
              <div className="d-flex flex-wrap align-items-end justify-content-between gap-2">
                <div className="col-12 col-md-12">
                  <label className="form-label m-0 fw-semibold">
                    Card Number
                  </label>
                  <input
                    className="form-control border rounded"
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="row col-12">
                  <div className="col-12 col-md-9">
                    <label className="form-label m-0 fw-semibold">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="form-control border rounded"
                      value={cardDetails.cardholderName}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          cardholderName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-3 text-start">
                    <label className="form-label m-0 fw-semibold">CVC</label>
                    <input
                      placeholder="CVC"
                      type="text"
                      className="form-control"
                      value={cardDetails.cvc}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvc: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row col-12">
                  <div className="col-12 col-md-6 text-start">
                    <label className="form-label m-0 fw-semibold">
                      Expiry Month
                    </label>
                    <input
                      placeholder="Expiry Month (MM)"
                      type="tel"
                      className="form-control"
                      value={cardDetails.expiryMonth}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiryMonth: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6 text-start">
                    <label className="form-label m-0 fw-semibold">
                      Expiry Year
                    </label>
                    <input
                      placeholder="Expiry Year (YYYY)"
                      type="text"
                      className="form-control"
                      value={cardDetails.expiryYear}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiryYear: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-12 ">
                  <input type="checkbox" className="form-check-input me-2" />
                  <label className="form-label">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                <div
                  onClick={() => {
                    handlePaymentSubmit("gcash");
                  }}
                  className="card digital-wallet-card col-12 col-md-5 p-3 border shadow-sm"
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={gcash}
                        alt="GCash"
                        style={{ width: "60px", height: "auto" }}
                        className="me-2"
                      />
                      <h5 className="mb-0">GCash</h5>
                    </div>
                  </div>
                  <p className="text-muted small mb-2">
                    Pay securely with your GCash wallet
                  </p>
                </div>

                <div
                  onClick={() => {
                    handlePaymentSubmit("paymaya");
                  }}
                  className="card digital-wallet-card col-12 col-md-5 p-3 border shadow-sm"
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={maya}
                        alt="Maya"
                        style={{ width: "60px", height: "auto" }}
                        className="me-2"
                      />
                      <h5 className="mb-0">Maya</h5>
                    </div>
                  </div>
                  <p className="text-muted small mb-2">
                    Pay securely with your PayMaya wallet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4 mt-3 ms-md-3">
        <div className="card">
          <div className="card-header bg-theme">
            <h4 className="mb-0">
              <i className="bi bi-receipt me-2"></i>Booking Summary
            </h4>
          </div>
          <div className="card-body">
            <div className="booking-item mb-3 pb-3 border-bottom">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="mb-1">
                    {booking?.flightId?.origin.name} -{" "}
                    {booking?.flightId?.destination.name}
                  </h6>
                  <small className="text-muted">
                    {booking?.flightId?.origin.code} -{" "}
                    {booking?.flightId?.destination.code}
                    <br />
                    {booking?.quantity} Passenger(s)
                  </small>
                  <div className="text-gradient fw-bold">
                    ₱{booking?.flightId?.price} X {booking?.quantity}{" "}
                    Passenger(s)
                  </div>
                </div>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="d-flex text-gradient justify-content-between fw-bold fs-5">
                <span>Total:</span>
                <span>₱{booking?.totalPrice}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-theme w-100 mt-4">
              <i className="bi bi-lock me-2"></i>Proceed to Payment
            </button>

            <div className="text-center">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Secure 256-bit SSL encryption
              </small>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
