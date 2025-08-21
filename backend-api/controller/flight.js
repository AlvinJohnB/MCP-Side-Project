const Flight = require("../model/Flight");

// Create a new flight
module.exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const result = await flight.save();
    return res.status(201).send({
      success: true,
      message: "Flight created successfully",
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: err.message });
  }
};

// Get all flights
module.exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    return res.status(200).json({
      success: true,
      data: flights
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search flights by origin, destination, and departureDate
module.exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.query;

    const flights = await Flight.find({
      origin,
      destination,
      departureTime: { $gte: new Date(departureDate) }
    });

    return res.status(200).json({
      success: true,
      data: flights
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Book a flight
module.exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengerDetails } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: "Flight not found" });
    }

    // For now, we just return flight + passenger info
    return res.status(200).json({
      success: true,
      message: "Flight booked successfully",
      data: { flight, passengerDetails }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
