import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function FlightSearchModal({ show, handleClose, flights }) {
  const navigate = useNavigate();

  const handleSelectFlight = (flightId) => {
    navigate(`/flight/${flightId}`);
    handleClose();
  };

  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Flight Search Results</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {flights.length === 0 && <p className="text-muted">No flights found</p>}
        {flights.map((flight) => (
          <div key={flight._id} className="card shadow-sm mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-2">
                  {flight.origin.code}{" "}
                  <span className="mx-2" role="img" aria-label="arrow">
                    &#8594;
                  </span>{" "}
                  {flight.destination.code}
                </h5>
                <p className="card-text mb-0 text-muted">
                  Origin: {flight.origin.name}
                </p>
                <p className="card-text mb-0 text-muted">
                  Destination: {flight.destination.name}
                </p>
                <p className="card-text mb-0 text-muted">
                  Date: {moment(flight.departureDate).format("MMMM D, YYYY")}
                  {" @ "}
                  {moment(flight.departureTime, "HH:mm").format("h:mm A")}
                </p>
              </div>
              <div className="text-end">
                <div className="fw-bold">
                  Flight No:{" "}
                  <span className="text-primary">{flight.flightNumber}</span>
                </div>
                <div className="fw-bold mb-2">
                  Price:{" "}
                  <span className="text-success">PHP {flight.price}</span>
                </div>
                <Button
                  onClick={() => handleSelectFlight(flight._id)}
                  variant="outline-primary"
                  size="sm"
                >
                  Select Flight
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
