import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import UserContext from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function ManageFlights() {
  const { user } = useContext(UserContext);

  const [airports, setAirports] = useState([]);
  const [flight, setFlight] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    price: "",
    flightNumber: "",
  });

  const [selectedFlight, setSelectedFlight] = useState(null);

  const [flights, setFlights] = useState([]);

  const fetchAirports = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/airports/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch airports");
      }
      const data = await response.json();
      // console.log("Airports fetched:", data);
      setAirports(data);
    } catch (error) {
      console.error("Error fetching airports:", error);
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/flights`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }
      const data = await response.json();
      setFlights(data);
      console.log("Flights fetched:", data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    fetchAirports();
    fetchFlights();
  }, []);

  const handleAddFlight = async (e) => {
    e.preventDefault();
    // console.log("Adding flight:", flight);

    if (
      !flight.origin ||
      !flight.destination ||
      !flight.departureDate ||
      !flight.departureTime ||
      !flight.price ||
      !flight.flightNumber
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (flight.origin === flight.destination) {
      Swal.fire({
        title: "Error!",
        text: "Origin and destination cannot be the same.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    await fetch(`${process.env.REACT_APP_API_URL}/flights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(flight),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add flight");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: "Flight added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        // console.log("Flight added successfully:", data);
        // Reset flight form
        fetchFlights();
        setFlight({
          origin: "",
          destination: "",
          departureDate: "",
          departureTime: "",
          price: "",
          flightNumber: "",
        });
      })
      .catch((error) => {
        console.error("Error adding flight:", error);
      });
  };

  const handleUpdateFlight = async (e) => {
    e.preventDefault();

    const data = {
      origin: selectedFlight.origin._id,
      destination: selectedFlight.destination._id,
      departureDate: selectedFlight.departureDate,
      departureTime: selectedFlight.departureTime,
      price: selectedFlight.price,
      flightNumber: selectedFlight.flightNumber,
    };

    await fetch(
      `${process.env.REACT_APP_API_URL}/flights/${selectedFlight._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update flight");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        Swal.fire({
          title: "Success!",
          text: "Flight updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setFlights((prevFlights) =>
          prevFlights.map((flight) =>
            flight._id === selectedFlight._id ? selectedFlight : flight
          )
        );
        setSelectedFlight(null);
      })
      .catch((error) => {
        console.error("Error updating flight:", error);
      });
  };

  const handleDeleteFlight = async (flightId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${process.env.REACT_APP_API_URL}/flights/${flightId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to delete airport");
          }
          const data = await response.json();
          Swal.fire("Success", data.message, "success");
          fetchFlights();
        });
      }
    });
  };

  if (user && user.isAdmin === false) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {selectedFlight !== null ? (
        <div className="row text-dark col-lg-10 mx-auto manage-flight-wrapper">
          <div className="col-12 text-white p-2 d-flex manage-flight-header">
            <h3 className="px-4">Update Flight</h3>
          </div>
          <div className="bg-light col-12 p-4 manage-flight-body">
            <form className="d-flex flex-wrap align-items-end gap-2">
              <div className="col-12 col-md text-start">
                <div>
                  <label className="form-label m-0 fw-semibold">Origin</label>
                  <select
                    className="form-select border rounded"
                    value={selectedFlight.origin._id || ""}
                    onChange={(e) =>
                      setSelectedFlight({
                        ...selectedFlight,
                        origin: { _id: e.target.value },
                      })
                    }
                  >
                    <option value="" disabled>
                      {selectedFlight.origin && selectedFlight.origin.name
                        ? selectedFlight.origin.name
                        : "Select Origin"}
                    </option>
                    {airports.map((airport) => (
                      <option key={airport._id} value={airport._id}>
                        {airport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label m-0 fw-semibold">
                    Destination
                  </label>
                  <select
                    className="form-select border rounded"
                    value={selectedFlight.destination._id || ""}
                    onChange={(e) =>
                      setSelectedFlight({
                        ...selectedFlight,
                        destination: { _id: e.target.value },
                      })
                    }
                  >
                    <option value="" disabled>
                      {selectedFlight.destination &&
                      selectedFlight.destination.name
                        ? selectedFlight.destination.name
                        : "Select Destination"}
                    </option>
                    {airports.map((airport) => (
                      <option key={airport._id} value={airport._id}>
                        {airport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 position-relative col-md text-start">
                <div>
                  <label className="form-label m-0 fw-semibold">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    placeholder="Flight Number"
                    className="form-control border rounded"
                    value={selectedFlight.flightNumber}
                    onChange={(e) =>
                      setSelectedFlight({
                        ...selectedFlight,
                        flightNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  {" "}
                  <label className="form-label m-0 fw-semibold">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="form-control border rounded"
                    value={selectedFlight.price}
                    onChange={(e) =>
                      setSelectedFlight({
                        ...selectedFlight,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Departure Date
                </label>
                <input
                  placeholder="Departure Date"
                  type="date"
                  className="form-control"
                  value={selectedFlight.departureDate}
                  onChange={(e) =>
                    setSelectedFlight({
                      ...selectedFlight,
                      departureDate: e.target.value,
                    })
                  }
                />
                <label className="form-label m-0 fw-semibold">
                  Departure Time
                </label>
                <input
                  placeholder="Departure Time"
                  type="time"
                  className="form-control"
                  value={selectedFlight.departureTime}
                  onChange={(e) =>
                    setSelectedFlight({
                      ...selectedFlight,
                      departureTime: e.target.value,
                    })
                  }
                />
              </div>
            </form>
            <div className="col-12 col-md mt-3 d-flex justify-content-between">
              <div className="col-6 me-2">
                <button
                  onClick={handleUpdateFlight}
                  className="btn btn-theme col-12"
                >
                  Update Flight
                </button>
              </div>

              <div className="col-6 me-2">
                <button
                  onClick={() => {
                    setSelectedFlight(null);
                  }}
                  className="btn btn-warning col-12"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row text-dark col-lg-10 mx-auto manage-flight-wrapper">
          <div className="col-12 text-white p-2 d-flex manage-flight-header">
            <h3 className="px-4">Add Flight</h3>
          </div>
          <div className="bg-light col-12 p-4 manage-flight-body">
            <form className="d-flex flex-wrap align-items-end gap-2">
              <div className="col-12 col-md text-start">
                <div>
                  <label className="form-label m-0 fw-semibold">Origin</label>
                  <select
                    className="form-select border rounded"
                    value={flight.origin}
                    onChange={(e) =>
                      setFlight({ ...flight, origin: e.target.value })
                    }
                  >
                    <option value="">Select Origin</option>
                    {airports.map((airport) => (
                      <option key={airport._id} value={airport._id}>
                        {airport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label m-0 fw-semibold">
                    Destination
                  </label>
                  <select
                    className="form-select border rounded"
                    value={flight.destination}
                    onChange={(e) =>
                      setFlight({ ...flight, destination: e.target.value })
                    }
                  >
                    <option value="">Select Destination</option>
                    {airports.map((airport) => (
                      <option key={airport._id} value={airport._id}>
                        {airport.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 position-relative col-md text-start">
                <div>
                  <label className="form-label m-0 fw-semibold">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    placeholder="Flight Number"
                    className="form-control border rounded"
                    value={flight.flightNumber}
                    onChange={(e) =>
                      setFlight({ ...flight, flightNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  {" "}
                  <label className="form-label m-0 fw-semibold">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    className="form-control border rounded"
                    value={flight.price}
                    onChange={(e) =>
                      setFlight({ ...flight, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Departure Date
                </label>
                <input
                  placeholder="Departure Date"
                  type="date"
                  className="form-control"
                  value={flight.departureDate}
                  onChange={(e) =>
                    setFlight({ ...flight, departureDate: e.target.value })
                  }
                />
                <label className="form-label m-0 fw-semibold">
                  Departure Time
                </label>
                <input
                  placeholder="Departure Time"
                  type="time"
                  className="form-control"
                  value={flight.departureTime}
                  onChange={(e) =>
                    setFlight({ ...flight, departureTime: e.target.value })
                  }
                />
              </div>
            </form>
            <div className="col-12 col-md mt-3">
              <button
                onClick={handleAddFlight}
                className="btn btn-theme col-12"
              >
                Add Flight
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="col-10 py-5 mx-auto">
        <h1>Flights</h1>
        <div className="row">
          {flights.map((flight) => (
            <div key={flight._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{flight.flightNumber}</h5>
                  <p className="card-text">
                    <strong>Origin:</strong> {flight.origin.name} -{" "}
                    {flight.origin.code}
                    <br />
                    <strong>Destination:</strong> {flight.destination.name} -{" "}
                    {flight.destination.code}
                    <br />
                    <strong>Departure:</strong> {flight.departureDate}{" "}
                    {flight.departureTime}
                    <br />
                    <strong>Price:</strong> PHP {flight.price}
                  </p>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={async () => {
                      handleDeleteFlight(flight._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
