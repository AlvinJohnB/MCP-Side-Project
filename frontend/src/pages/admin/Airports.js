import { useState, useEffect, useMemo } from "react";
import { Notyf } from "notyf";

export default function Airports() {
  const [airports, setAirports] = useState([]);

  const [airport, setAirport] = useState({
    name: "",
    location: "",
    code: "",
  });

  const [destination, setDestination] = useState({
    name: "",
    nickname: "",
    description: "",
    image: null,
    airport: "",
  });

  const notyf = useMemo(() => new Notyf({
    duration: 2000,
    position: { x: "right", y: "top" }
  }), []);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/airports`
      );
      const data = await response.json();
      setAirports(data.data);
      //   console.log(data.data);
    } catch (error) {
      notyf.error("Failed to load airports");
      console.error(error);
    }
  };
    fetchAirports();
  }, [notyf]);

  const handleAddAirport = async (e) => {
    e.preventDefault();
    // Add airport logic here
    try {
      console.log(airport);
     const response = await 
      fetch(`${process.env.REACT_APP_API_URL}/flights/airports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airport),
  }
);
      const data = await response.json();

      if (response.ok) {
        notyf.success("Airport added successfully ✈️");
        setAirport({ name: "", location: "", code: "" }); 
      } else {
        notyf.error(data.message || "Failed to add airport ❌");
      }
    } catch (error) {
      notyf.error("Network error ❌");
      console.error(error);
    }
  };

  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = destination.image;

      if (destination.image) {
        const formData = new FormData();
        formData.append("image", destination.image);
        const imageRes = await fetch(process.env.REACT_APP_IMAGE_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const imageData = await imageRes.json();
        imageUrl = imageData.url;
      }

      const updatedDestination = { ...destination, image: imageUrl };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/flights/airports/destination/${destination.airport}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedDestination),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        notyf.success("Destination added successfully");
        setDestination({
          name: "",
          nickname: "",
          description: "",
          image: null,
          airport: "",
        });
      } else {
        console.log(data);
        notyf.error(data.message || "Failed to add destination ");
      }
    } catch (error) {
      // Handle network errors
      notyf.error("Error updating destination ");
      console.error("Error updating destination:", error);
    }
  };

  return (
    <div className="airports-container">
      <h1 className="airports-section-title">Airports</h1>
      <div className="airports-card">
        <h3>Add Airport</h3>
        <form onSubmit={handleAddAirport}>
          <input
            type="text"
            onChange={(e) => {
              setAirport({ ...airport, name: e.target.value });
            }}
            placeholder="Airport Name"
          />
          <input
            type="text"
            onChange={(e) => {
              setAirport({ ...airport, location: e.target.value });
            }}
            placeholder="Location"
          />
          <input
            type="text"
            onChange={(e) => {
              setAirport({ ...airport, code: e.target.value });
            }}
            placeholder="Code"
          />
          <button type="submit">Add Airport</button>
        </form>
      </div>

      <div className="airports-card">
        <h3>Destinations</h3>
        <form encType="multipart/form-data" onSubmit={handleAddDestination}>
          <input
            type="text"
            onChange={(e) => {
              setDestination({ ...destination, name: e.target.value });
            }}
            placeholder="Destination Name"
          />
          <input
            type="text"
            onChange={(e) => {
              setDestination({ ...destination, nickname: e.target.value });
            }}
            placeholder="Destination Nickname"
          />
          <input
            type="text"
            onChange={(e) => {
              setDestination({ ...destination, description: e.target.value });
            }}
            placeholder="Description"
          />
          <input
            type="file"
            onChange={(e) => {
              setDestination({ ...destination, image: e.target.files[0] });
            }}
          />
          <select
            onChange={(e) => {
              setDestination({ ...destination, airport: e.target.value });
            }}
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport._id} value={airport._id}>
                {airport.name}
              </option>
            ))}
          </select>
          <button type="submit">Add Destination</button>
        </form>
      </div>
    </div>
  );
}
