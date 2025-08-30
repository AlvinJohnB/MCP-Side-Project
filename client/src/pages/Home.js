import { useState, useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext";
import Swal from "sweetalert2";
import FlightSearchModal from "../components/FlightSearchModal";
import AppNavbar from "../components/Navbar";
import { Navigate } from "react-router-dom";

export default function Home() {
  const destinations = [
    {
      name: "Baguio",
      image: "https://alvinjohnb.github.io/MCP-Side-Project/images/Baguio.jpg",
      nickname: "The Summer Capital of the Philippines",
      description:
        "Nestled in the Cordillera mountains, Baguio offers a cool climate year-round, a welcome escape from the tropical heat. Known for Burnham Park, Mines View Park, and the Baguio Night Market, it blends natural beauty with vibrant local culture.",
    },

    {
      name: "Boracay",
      image: "https://alvinjohnb.github.io/MCP-Side-Project/images/Boracay.jpg",
      nickname: "White Sands and Island Vibes",
      description:
        "Famous for its powdery white sand and crystal-clear waters, Boracay’s White Beach is often ranked among the world’s best. The island now balances tourism with sustainability, offering a cleaner, calmer, and more regulated experience.",
    },
    {
      name: "Cebu",
      image: "https://alvinjohnb.github.io/MCP-Side-Project/images/Cebu.jpg",
      nickname: "The Queen City of the South",
      description:
        "Cebu is a dynamic mix of history, city life, and natural beauty. Discover Magellan’s Cross, Basilica del Santo Niño, and Kawasan Falls, Osmeña Peak, and world-class diving in Moalboal and Malapascua.",
    },
    {
      name: "Manila",
      image: "https://alvinjohnb.github.io/MCP-Side-Project/images/Manila.jpeg",
      nickname: "The Heartbeat of the Nation",
      description:
        "The capital and cultural melting pot of the Philippines. Explore Intramuros, Rizal Park, and Binondo. Manila is the country’s center for politics, commerce, education, and pop culture.",
    },
    {
      name: "Palawan",
      image: "https://alvinjohnb.github.io/MCP-Side-Project/images/Palawan.jpg",
      nickname: "Nature’s Last Frontier",
      description:
        "Palawan is postcard-perfect—turquoise waters, towering limestone cliffs, and hidden lagoons. El Nido, Coron, and the Puerto Princesa Underground River are must-sees for nature lovers.",
    },
    {
      name: "Siquijor",
      image:
        "https://alvinjohnb.github.io/MCP-Side-Project/images/Siquijor.jpg",
      nickname: "The Island of Mystique",
      description:
        "Siquijor is steeped in mysticism, folklore, and natural beauty. Known for healing traditions, quiet beaches, Cambugahay Falls, and old Spanish-era churches.",
    },
  ];

  const { user } = useContext(UserContext);
  const [flightSearchModalShow, setFlightSearchModalShow] = useState(false);
  const [flightResults, setFlightResults] = useState([]);

  const [airports, setAirports] = useState([]);

  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");

  const [originSuggestionShow, setOriginSuggestionShow] = useState(false);
  const [destinationSuggestionShow, setDestinationSuggestionShow] =
    useState(false);

  const [flightDate, setFlightDate] = useState("");

  const filteredOrigin = airports.filter(
    (airport) =>
      (airport.name.toLowerCase().includes(originQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(originQuery.toLowerCase())) &&
      airport.name.toLowerCase() !== destinationQuery.toLowerCase()
  );

  const filteredDestination = airports.filter(
    (airport) =>
      (airport.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(destinationQuery.toLowerCase())) &&
      airport.name.toLowerCase() !== originQuery.toLowerCase()
  );

  useEffect(() => {
    const fetchAirports = async () => {
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
        console.log("Error fetching airports:", response);
      }
      const data = await response.json();
      setAirports(Array.isArray(data) ? data : []);
    };
    fetchAirports();
  }, []);

  const getAirportId = (query) => {
    const airport = airports.find(
      (airport) =>
        airport.name.toLowerCase() === query.toLowerCase() ||
        airport.code.toLowerCase() === query.toLowerCase()
    );
    return airport ? airport._id : null;
  };

  const handleSearchFlight = async (e) => {
    e.preventDefault();

    if (!originQuery || !destinationQuery || !flightDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields",
      });
      return;
    }

    console.log(
      getAirportId(originQuery),
      getAirportId(destinationQuery),
      flightDate
    );

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/searchFlight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            origin: getAirportId(originQuery),
            destination: getAirportId(destinationQuery),
            departureDate: flightDate,
          }),
        }
      );

      const flights = await response.json();

      if (flights) {
        if (flights.length === 0) {
          return Swal.fire({
            icon: "info",
            title: "No Flights Found",
            text: "Sorry, we couldn't find any flights matching your criteria.",
          });
        }
        // console.log(flights);
        setFlightResults(flights);
        setFlightSearchModalShow(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: flights.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setOriginQuery("");
      setDestinationQuery("");
      setFlightDate("");
    }
  };

  return user === null ? (
    <Navigate to="/login" />
  ) : (
    <>
      <div className="container-fluid landing py-1 py-md-3">
        <AppNavbar />
        <div className="row mt-5">
          <div className="col-12 my-5">
            <h1>Discover places around</h1>
            <p>Find your next favorite spot, one adventure at a time</p>
          </div>
        </div>

        <div className="row text-dark col-lg-6 mx-auto flight-search-wrapper">
          <div className="col-12 text-white p-2 d-flex flight-search-header">
            <h3 className="px-4">Search Flights</h3>
          </div>
          <div className="bg-light col-12 p-4 flight-search-body">
            <form
              onSubmit={handleSearchFlight}
              className="d-flex flex-wrap align-items-end gap-2"
            >
              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">
                  Destination
                </label>
                <input
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value);
                    setDestinationSuggestionShow(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setDestinationSuggestionShow(false), 100)
                  }
                  className="form-control border rounded"
                  type="text"
                  placeholder="To"
                />

                {destinationSuggestionShow &&
                  filteredDestination.length > 0 && (
                    <div className="search-input-suggestion">
                      <ul className="position-absolute bg-light">
                        {filteredDestination.map((item) => (
                          <li
                            key={item._id}
                            className="p-2"
                            onMouseDown={() => {
                              setDestinationQuery(item.name);
                              setDestinationSuggestionShow(false);
                            }}
                          >
                            {item.name} - {item.code}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="col-12 position-relative col-md text-start">
                <label className="form-label m-0 fw-semibold">Origin</label>
                <input
                  type="text"
                  placeholder="From"
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value);
                    setOriginSuggestionShow(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setOriginSuggestionShow(false), 100)
                  }
                  className="form-control border rounded"
                />

                {originSuggestionShow && filteredOrigin.length > 0 && (
                  <div className="search-input-suggestion">
                    <ul className="position-absolute bg-light">
                      {filteredOrigin.map((item) => (
                        <li
                          key={item._id}
                          className="p-2"
                          onMouseDown={() => {
                            setOriginQuery(item.name);
                            setOriginSuggestionShow(false);
                          }}
                        >
                          {item.name} - {item.code}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="col-12 col-md text-start">
                <label className="form-label m-0 fw-semibold">When?</label>
                <input
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  type="date"
                  className="form-control"
                />
              </div>
              <div className="col-12 col-md">
                <button type="submit" className="btn btn-theme col-12">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <FlightSearchModal
        show={flightSearchModalShow}
        handleClose={() => setFlightSearchModalShow(false)}
        flights={flightResults}
      />

      {/* Destinations */}
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mb-5 fw-bold display-5 text-gradient">
              Our Available Destinations
              <span className="d-block fs-5 fw-normal text-secondary">
                Your next unforgettable escape!
              </span>
            </h2>
          </div>

          {destinations.map((destination, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow border-0 rounded-4 overflow-hidden destination-card">
                <div className="position-relative">
                  <img
                    src={destination.image}
                    className="card-img-top object-fit-cover"
                    alt={destination.name}
                    style={{ height: "220px" }}
                  />
                  <span className="badge bg-primary position-absolute top-0 end-0 m-3 px-3 py-2 fs-6 rounded-pill shadow">
                    {destination.name}
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-1">
                    {destination.nickname}
                  </h5>
                  <p className="card-text small text-secondary">
                    {destination.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center bg-light py-4">
        <p className="mb-0">
          &copy; 2025 BookingApp. All rights reserved. Designed by: Krisha
          Fabonan, Cherilyn Abe, Alvin John Bregana
        </p>
      </footer>
    </>
  );
}
