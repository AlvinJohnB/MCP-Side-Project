import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";

export default function Flight() {
  const navigate = useNavigate();
  const [flight, setflight] = useState(null);
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFlight = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/searchFlightById/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await response.json();
      setflight(data);
      console.log(data);
    };
    fetchFlight();
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bookings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            flightId: flight._id,
            quantity,
            totalPrice: flight.price * quantity,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setQuantity(1);
        setflight(null);
        navigate(`/bookings/${data.booking._id}`);
        // console.log(data);
      } else {
        const error = await response.json();
        console.error("Error creating booking:", error);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <>
      <div className="row text-dark col-12 col-lg-6 mx-auto manage-flight-wrapper">
        <div className="col-12 text-white p-2 d-flex manage-flight-header">
          <h3 className="px-4"></h3>
        </div>
        <div className="bg-light col-12 p-4 manage-flight-body">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="cart-item-card card mb-4">
                <div className="row g-0">
                  <div className="col-md-12">
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-gradient">
                        {flight?.origin?.name || ""}{" "}
                        <span className="mx-2" role="img" aria-label="arrow">
                          &#8594;
                        </span>{" "}
                        {flight?.destination?.name || ""}
                      </h5>
                      <p className="card-text">
                        {flight?.origin?.code || ""}{" "}
                        <span className="mx-2" role="img" aria-label="arrow">
                          &#8594;
                        </span>{" "}
                        {flight?.destination.code || ""}
                        <br />
                        {moment(flight?.departureDate).format(
                          "MMMM D, YYYY"
                        )} -{" "}
                        {moment(flight?.departureTime, "HH:mm").format(
                          "h:mm A"
                        )}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-muted">Price per ticket:</span>
                          <h4 className="price-display mb-0">
                            ₱ {Math.floor(flight?.price).toFixed(2)}
                          </h4>
                        </div>
                        <div className="d-flex align-items-center quantity-controls">
                          <button
                            className="btn btn-outline-secondary btn-sm me-2"
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity === 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="fw-bold mx-2">{quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm me-3"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                          {/* <button className="btn btn-outline-danger btn-sm">
                            <i className="bi bi-trash"></i>
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cart-summary-card card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      {flight?.origin.code}{" "}
                      <span className="mx-2" role="img" aria-label="arrow">
                        &#8594;
                      </span>{" "}
                      {flight?.destination.code}{" "}
                      {quantity > 1
                        ? `(${quantity} ${quantity > 1 ? "tickets" : "ticket"})`
                        : ""}
                    </span>
                    <span>
                      ₱{Math.floor(flight?.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="fw-bold">Total</h5>
                    <h5 className="fw-bold price-display">
                      ₱{Math.floor(flight?.price * quantity).toFixed(2)}
                    </h5>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      onClick={handleCheckout}
                      className="btn btn-theme btn-lg rounded-pill"
                    >
                      <i className="bi bi-credit-card me-2"></i>Proceed to
                      Checkout
                    </button>
                    <button
                      className="btn btn-theme-outline rounded-pill"
                      onClick={() => navigate(-1)}
                    >
                      <i className="bi bi-arrow-left me-2"></i>Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
