import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [flightNumber, setFlightNumber] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [airline, setAirline] = useState("");
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: ""
  });

  // Fetch flights from Mongo backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/flights`)
      .then((res) => res.json())
      .then((data) => setFlights(data))
      .catch((err) => console.error("Error fetching flights:", err));
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update flight
  const handleSave = () => {
    if (selectedFlight) {
      // Update existing flight
      fetch(`${process.env.REACT_APP_API_URL}flights/update/${selectedFlight._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then((updated) => {
          setFlights(
            flights.map((f) => (f._id === updated._id ? updated : f))
          );
          closeModal();
        })
        .catch((err) => console.error("Error updating flight:", err));
    } else {
      // Add new flight
   fetch(`${process.env.REACT_APP_API_URL}/flights/add`, {
     method: "POST",
     headers: {
     "Content-Type": "application/json",
     Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
      },
     body: JSON.stringify({
     flightNumber,
     origin,
     destination,
     departureTime,
     arrivalTime,
     price,
     airline,
     }),
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
      }
   };

  // Delete flight
  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/flights/delete/${id}`, 
       { method: "DELETE" })
      .then(() => setFlights(flights.filter((f) => f._id !== id)))
      .catch((err) => console.error("Error deleting flight:", err));
  };

  // Open modal for edit/new
  const openModal = (flight = null) => {
    setSelectedFlight(flight);
    setFormData(
      flight || {
        airline: "",
        flightNumber: "",
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        price: ""
      }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFlight(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Flights Admin Dashboard</h2>
      <button className="btn btn-primary mb-3" onClick={() => openModal()}>
        Add Flight
      </button>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Airline</th>
            <th>Flight No.</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.length > 0 ? (
            flights.map((flight) => (
              <tr key={flight._id}>
                <td>{flight.airline}</td>
                <td>{flight.flightNumber}</td>
                <td>{flight.origin}</td>
                <td>{flight.destination}</td>
                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                <td>{flight.price}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openModal(flight)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(flight._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No flights found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedFlight ? "Edit Flight" : "Add Flight"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="airline"
                    placeholder="Airline"
                    value={formData.airline}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="flightNumber"
                    placeholder="Flight Number"
                    value={formData.flightNumber}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="origin"
                    placeholder="Origin"
                    value={formData.origin}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="destination"
                    placeholder="Destination"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                  <input
                    type="datetime-local"
                    className="form-control mb-2"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                  />
                  <input
                    type="datetime-local"
                    className="form-control mb-2"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

