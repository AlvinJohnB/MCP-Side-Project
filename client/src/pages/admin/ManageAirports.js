import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import UserContext from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function ManageAirports() {
  const { user } = useContext(UserContext);
  const [airport, setAirport] = useState({
    name: "",
    location: "",
    code: "",
  });

  const [selectedAirport, setSelectedAirport] = useState(null);

  const [airports, setAirports] = useState([]);

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

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleAddAirport = async (e) => {
    e.preventDefault();
    // Handle form submission
    // console.log(airport);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/airports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(airport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add airport");
      }

      const data = await response.json();
      Swal.fire("Success", data.message, "success");
      setAirports([...airports, airport]);
    } catch (error) {
      console.error("Error adding airport:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleUpdateAirport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/airports/${selectedAirport._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(selectedAirport),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update airport");
      }

      const data = await response.json();
      Swal.fire("Success", data.message, "success");
      fetchAirports();
    } catch (error) {
      console.error("Error updating airport:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDeleteAirport = async (airport) => {
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
        await fetch(`${process.env.REACT_APP_API_URL}/airports/${airport}`, {
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
          fetchAirports();
        });
      }
    });
  };

  if (user && user.isAdmin === false) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {selectedAirport !== null ? (
        <div className="row text-dark col-lg-10 mx-auto manage-flight-wrapper">
          <div className="col-12 text-white p-2 d-flex manage-flight-header">
            <h3 className="px-4">Update Airport</h3>
          </div>
          <div className="bg-light col-12 p-4 manage-flight-body">
            <form
              onSubmit={handleUpdateAirport}
              className="d-flex flex-wrap align-items-end gap-2"
            >
              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Name
                </label>
                <input
                  className="form-control border rounded"
                  type="text"
                  placeholder="Airport Name"
                  value={selectedAirport.name}
                  onChange={(e) =>
                    setSelectedAirport({
                      ...selectedAirport,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Location
                </label>
                <input
                  type="text"
                  placeholder="Location"
                  className="form-control border rounded"
                  value={selectedAirport.location}
                  onChange={(e) =>
                    setSelectedAirport({
                      ...selectedAirport,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Code
                </label>
                <input
                  placeholder="Airport Code"
                  type="text"
                  className="form-control"
                  value={selectedAirport.code}
                  onChange={(e) =>
                    setSelectedAirport({
                      ...selectedAirport,
                      code: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-12 col-md">
                <button type="submit" className="btn btn-theme col-5 me-2">
                  Update Airport
                </button>
                <button
                  onClick={() => setSelectedAirport(null)}
                  className="btn btn-warning col-5"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="row text-dark col-lg-10 mx-auto manage-flight-wrapper">
          <div className="col-12 text-white p-2 d-flex manage-flight-header">
            <h3 className="px-4">Add Airport</h3>
          </div>
          <div className="bg-light col-12 p-4 manage-flight-body">
            <form
              onSubmit={handleAddAirport}
              className="d-flex flex-wrap align-items-end gap-2"
            >
              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Name
                </label>
                <input
                  className="form-control border rounded"
                  type="text"
                  placeholder="Airport Name"
                  value={airport.name}
                  onChange={(e) =>
                    setAirport({ ...airport, name: e.target.value })
                  }
                />
              </div>

              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Location
                </label>
                <input
                  type="text"
                  placeholder="Location"
                  className="form-control border rounded"
                  value={airport.location}
                  onChange={(e) =>
                    setAirport({ ...airport, location: e.target.value })
                  }
                />
              </div>

              <div className="col-12 col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Airport Code
                </label>
                <input
                  placeholder="Airport Code"
                  type="text"
                  className="form-control"
                  value={airport.code}
                  onChange={(e) =>
                    setAirport({ ...airport, code: e.target.value })
                  }
                />
              </div>
              <div className="col-12 col-md">
                <button type="submit" className="btn btn-theme col-12">
                  Add Airport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="col-10 py-5 mx-auto">
        <h1>Airports</h1>
        <div className="row">
          {airports.map((airport) => (
            <div className="col-md-4 mb-4" key={airport.code}>
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">{airport.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {airport.code}
                  </h6>
                  <p className="card-text">{airport.location}</p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => setSelectedAirport(airport)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAirport(airport._id)}
                    className="btn btn-danger"
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
