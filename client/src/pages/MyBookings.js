import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Card, Container, Row, Col, Button, Badge } from "react-bootstrap";
import moment from "moment";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bookings/myBookings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings);
        console.log(data.bookings);
      } catch (error) {
        console.error(error);
        Swal.fire("Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    try {
      return moment(dateString).format("MMM DD, YYYY");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container className="my-5">
      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <h3>
            <i className="bi bi-emoji-frown text-secondary me-2"></i>
            You have no bookings yet
          </h3>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/flights")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Book a Flight
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} className="g-4">
          {bookings.map((booking) => (
            <Col key={booking._id}>
              <Card className="h-100 shadow border-0 booking-card">
                <Card.Header
                  className="d-flex justify-content-between align-items-center text-white"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #084298)",
                  }}
                >
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-ticket-detailed me-2"></i> Flight{" "}
                    {booking.flightId.flightNumber}
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="flight-route d-flex align-items-center justify-content-between mb-4">
                    <div className="text-center">
                      <div className="city-code fw-bold fs-4">
                        <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                        {booking.flightId.origin.code}
                      </div>
                      <div className="city-name text-muted">
                        {booking.flightId.origin.name}
                      </div>
                    </div>

                    <div className="flight-path flex-grow-1 px-3">
                      <div className="flight-line position-relative">
                        <hr style={{ borderTop: "2px dashed #ccc" }} />
                        <span className="position-absolute top-50 start-50 translate-middle bg-white px-2">
                          <i className="bi bi-airplane-engines text-primary"></i>
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="city-code fw-bold fs-4">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {booking.flightId.destination.code}
                      </div>
                      <div className="city-name text-muted">
                        {booking.flightId.destination.name}
                      </div>
                    </div>
                  </div>
                  <div className="flight-details p-3 bg-light rounded mb-3">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-date me-2 text-primary"></i>
                          <div>
                            <div className="text-muted small">Date</div>
                            <div className="fw-bold">
                              {formatDate(booking.flightId.departureDate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock-history me-2 text-primary"></i>
                          <div>
                            <div className="text-muted small">Time</div>
                            <div className="fw-bold">
                              {booking.flightId.departureTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-date small text-muted mb-1">
                    <i className="bi bi-cash-coin me-1 text-success"></i> PHP{" "}
                    {booking.flightId.price.toFixed(2)}
                  </div>
                  <div className="booking-date small text-muted mb-1">
                    <i className="bi bi-calendar-check me-1 text-info"></i>{" "}
                    Booked on: {formatDate(booking.bookingDate)}
                  </div>
                  <div className="booking-date small text-muted">
                    <i className="bi bi-people-fill me-1 text-secondary"></i>{" "}
                    Quantity: {booking.quantity}
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 pt-0 pb-3 px-4">
                  <Button
                    variant="outline-primary"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={() =>
                      navigate(`/flight-details/${booking.flightId._id}`)
                    }
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    <span>View Details</span>
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
