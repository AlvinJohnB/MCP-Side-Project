const FlightModel = require("../models/Flight");

// Search flights
module.exports.searchFlights = async (origin, destination, departureDate) => {
  try {
    const flights = await FlightModel.find({
      origin: origin,
      destination: destination,
      departureTime: { $gte: new Date(departureDate) }
    });
    return flights;
  } catch (error) {
    throw new Error("Error searching for flights: " + error.message);
  }
};

// Book flight
module.exports.bookFlight = async (flightId, passengerDetails) => {
  try {
    const flight = await FlightModel.findById(flightId);
    if (!flight) {
      throw new Error("Flight not found");
    }

    // Booking logic would go here (update availability, save passenger, etc.)
    return {
      flight,
      passengerDetails
    };
  } catch (error) {
    throw new Error("Error booking flight: " + error.message);
  }
};
