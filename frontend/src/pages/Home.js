import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import FlightSearchModal from "../components/FlightSearchModal";
import { Link } from "react-router-dom";

export default function Home() {
  const [flightSearchModalShow, setFlightSearchModalShow] = useState(true);
  const [flightResults, setFlightResults] = useState([]);

  const [destinations, setDestinations] = useState([]);
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
    const fetchDestinations = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/airports/getAllDestinations`
      );
      const data = await response.json();
      //   console.log(data.data);
      setDestinations(data.data);
    };

    const fetchAirports = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/airports`
      );
      const data = await response.json();
      console.log(data.data);
      setAirports(data.data);
    };
    fetchAirports();
    fetchDestinations();
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

    console.log(getAirportId(originQuery));
    console.log(getAirportId(destinationQuery));
    console.log(flightDate);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origin: getAirportId(originQuery),
            destination: getAirportId(destinationQuery),
            departureDate: flightDate,
          }),
        }
      );

      const flights = await response.json();

      if (flights.success) {
        if (flights.data.length === 0) {
          return Swal.fire({
            icon: "info",
            title: "No Flights Found",
            text: "Sorry, we couldn't find any flights matching your criteria.",
          });
        }
        console.log(flights.data);
        setFlightResults(flights.data);
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

  return (
    <>
      <div className="container-fluid landing py-1 py-md-3">
        <Navbar
          className="mx-auto col-lg-10 border rounded"
          bg="light"
          data-bs-theme="light"
        >
          <Container>
            <Navbar.Brand href="#home" className="fw-bold text-gradient">
              BookingApp
            </Navbar.Brand>
            <Nav className="justify-content-end">
              <Nav.Link href="#home">Cart</Nav.Link>
              <Nav.Link href="#home">Manage Bookings</Nav.Link>
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

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
                <button type="submit" className="btn btn-primary col-12">
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

          {destinations.map((destination) => (
            <div key={destination._id} className="col-md-6 col-lg-4 mb-4">
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
