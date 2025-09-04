import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function BookingCheckout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [passengerCount, setPassengerCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  const [booking, setBooking] = useState(null);

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
          console.log(data.booking);

          const count = data.booking.quantity || 0;
          setPassengerCount(count);
          setBooking(data.booking);

          // Initialize passenger data array with empty objects
          setPassengers(
            Array(count)
              .fill()
              .map(() => ({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                province: "",
                zipCode: "",
              }))
          );
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

  // Handle form input changes
  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Passenger data:", passengers);
    // Add your submission logic here
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/bookings/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ passengers }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating booking:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    } else {
      //   const data = await response.json();
      setPassengerCount(0);
      setPassengers([]);
      setBooking(null);
      navigate(`/payment/${id}`);
    }
  };

  return (
    <form
      className="col-12 col-lg-10 mx-lg-auto d-md-flex"
      onSubmit={handleSubmit}
    >
      <div className="col-12 col-md-8 my-3">
        {passengers.map((passenger, index) => (
          <div
            key={index}
            className="row text-dark mx-auto mb-3  manage-flight-wrapper"
          >
            <div className="col-12 text-white p-2 d-flex manage-flight-header">
              <h3 className="px-4">Traveller Information {index + 1}</h3>
            </div>
            <div className="bg-light col-12 p-4 manage-flight-body">
              <div className="d-flex flex-wrap align-items-end justify-content-between gap-2">
                <div className="col-12 d-md-flex gap-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label m-0 fw-semibold">
                      First Name
                    </label>
                    <input
                      className="form-control border rounded"
                      type="text"
                      placeholder="First Name"
                      value={passenger.firstName}
                      onChange={(e) =>
                        handleInputChange(index, "firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label m-0 fw-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="form-control border rounded"
                      value={passenger.lastName}
                      onChange={(e) =>
                        handleInputChange(index, "lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="col-12 d-md-flex gap-2">
                  <div className="col-12 col-md-6 text-start">
                    <label className="form-label m-0 fw-semibold">
                      Email Address
                    </label>
                    <input
                      placeholder="Email Address"
                      type="email"
                      className="form-control"
                      value={passenger.email}
                      onChange={(e) =>
                        handleInputChange(index, "email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6 text-start">
                    <label className="form-label m-0 fw-semibold">
                      Phone Number
                    </label>
                    <input
                      placeholder="Phone Number"
                      type="tel"
                      className="form-control"
                      value={passenger.phone}
                      onChange={(e) =>
                        handleInputChange(index, "phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-md-12 text-start">
                  <label className="form-label m-0 fw-semibold">Address</label>
                  <input
                    placeholder="Address"
                    type="text"
                    className="form-control"
                    value={passenger.address}
                    onChange={(e) =>
                      handleInputChange(index, "address", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="col-12 d-md-flex gap-2">
                  <div className="col-12 col-md-4 text-start">
                    <label className="form-label m-0 fw-semibold">City</label>
                    <input
                      placeholder="City"
                      type="text"
                      className="form-control"
                      value={passenger.city}
                      onChange={(e) =>
                        handleInputChange(index, "city", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4 text-start">
                    <label className="form-label m-0 fw-semibold">
                      Province
                    </label>
                    <input
                      placeholder="Province"
                      type="text"
                      className="form-control"
                      value={passenger.province}
                      onChange={(e) =>
                        handleInputChange(index, "province", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-12 col-md-4 text-start">
                    <label className="form-label m-0 fw-semibold">
                      ZIP/Postal Code
                    </label>
                    <input
                      placeholder="ZIP/Postal Code"
                      type="text"
                      className="form-control"
                      value={passenger.zipCode}
                      onChange={(e) =>
                        handleInputChange(index, "zipCode", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {passengerCount > 0 && (
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
                      {booking.quantity} Passenger(s)
                    </small>
                    <div className="text-gradient fw-bold">
                      ₱{booking?.flightId?.price} X {booking.quantity}{" "}
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
      )}
    </form>
  );
}
