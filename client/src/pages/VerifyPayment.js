import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyPayment() {
  const { id } = useParams();
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bookings/payment/verify/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const data = await response.json();
        setPaymentStatus(data.attributes.status);
        console.log(data);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    fetchPaymentStatus();
  }, [id]);

  return (
    <div
      className="container d-flex flex-column mt-5 align-items-center justify-content-start"
      style={{ minHeight: "52vh" }}
    >
      {paymentStatus === "succeeded" ? (
        <>
          <div className="mb-3">
            <i
              className="bi bi-check-circle-fill text-success"
              style={{ fontSize: "4rem" }}
            ></i>
          </div>
          <h2 className="text-success">Payment Successful!</h2>
          <p className="lead">Your payment has been processed and verified.</p>
          <div className="d-flex gap-3 mt-4">
            <button
              onClick={() => navigate(`/payment/${id}`)}
              className="btn btn-theme btn-lg"
            >
              Manage Booking
            </button>
            <button
              onClick={() => navigate(`/`)}
              className="btn btn-warning btn-lg"
            >
              Back to Home
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <i
              className="bi bi-hourglass-split text-warning"
              style={{ fontSize: "4rem" }}
            ></i>
          </div>
          <h2 className="text-warning">Payment Pending</h2>
          <p className="lead">
            “It looks like the payment didn’t go through. Don’t worry—you can
            retry using the same method or choose a different one.”
          </p>
          <button
            onClick={() => navigate(`/payment/${id}`)}
            className="btn btn-theme btn-lg"
          >
            Retry Payment
          </button>
        </>
      )}
    </div>
  );
}
