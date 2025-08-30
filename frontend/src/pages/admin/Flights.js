import { useEffect, useState } from "react";
import { Notyf } from "notyf";

export default function Flights() {
  const [airports, setAirports] = useState([]);

  const [flight, setFlight] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    price: "",
  });

  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
  });


  useEffect(() => {
    const fetchAirports = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/airports`
      );
      const data = await response.json();
      setAirports(data.data);
      //   console.log(data.data);
    };
    fetchAirports();
  }, []);

  const handleAddFlight = async (e) => {
    e.preventDefault();

    try {// console.log(flight);
       const response = await fetch(
      `${process.env.REACT_APP_API_URL}/flights/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flight),
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        notyf.success("Flight added successfully");
        setFlight({
          flightNumber: "",
          origin: "",
          destination: "",
          departureDate: "",
          departureTime: "",
          price: "",
        }); // clear form
      } else {
        notyf.error(data.message || "Failed to add flight");
      }
    } catch (error) {
      console.error(error);
      notyf.error("Network error");
    }
  };

  return (
    <div className="flights-container">
      <h1>Flight</h1>
      <h3>Add Flight</h3>
      <form onSubmit={handleAddFlight} className="flights-card">
        <input
          value={flight.flightNumber}
          onChange={(e) =>
            setFlight({ ...flight, flightNumber: e.target.value })
          }
          type="text"
          placeholder="Flight Number"
        />
        <select
          value={flight.origin}
          onChange={(e) => setFlight({ ...flight, origin: e.target.value })}
        >
          <option value="">Select Origin</option>
          {airports.map((airport) => (
            <option key={airport._id} value={airport._id}>
              {airport.name}
            </option>
          ))}
        </select>

        <select
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
        <input
          value={flight.departureDate}
          onChange={(e) =>
            setFlight({ ...flight, departureDate: e.target.value })
          }
          type="date"
          placeholder="Departure Date"
        />
        <input
          value={flight.departureTime}
          onChange={(e) =>
            setFlight({ ...flight, departureTime: e.target.value })
          }
          type="time"
        />
        <input
          value={flight.price}
          onChange={(e) => setFlight({ ...flight, price: e.target.value })}
          type="number"
          placeholder="Price"
        />
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
}
