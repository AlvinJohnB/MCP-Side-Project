const Flight = require("../model/Flight");
const Airport = require("../model/Airport");

// Create a new flight
module.exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const result = await flight.save();
    return res.status(201).send({
      success: true,
      message: "Flight created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

// Delete Flight
module.exports.deleteFlight = async (req, res) => {
  const flightId = req.params.flightId;

  if (!flightId) {
    return res
      .status(400)
      .send({ success: false, message: "Flight ID is required" });
  }

  try {
    const deletedFlight = await Flight.findByIdAndDelete(flightId);
    if (!deletedFlight) {
      return res
        .status(404)
        .send({ success: false, message: "Flight not found" });
    }

    return res.status(200).send({
      success: true,
      message: "Flight deleted successfully",
      data: deletedFlight,
    });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// USER SIDE

// Get all flights
module.exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    return res.status(200).json({
      success: true,
      data: flights,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search flights by origin, destination, and departureDate
module.exports.searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.body;

    const flights = await Flight.find({
      origin,
      destination,
      departureDate: departureDate,
    }).populate("origin destination");

    return res.status(200).json({
      success: true,
      data: flights,
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
      return res
        .status(404)
        .json({ success: false, message: "Flight not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Flight booked successfully",
      data: { flight, passengerDetails },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Airport CRUD
module.exports.getAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    return res.status(200).json({
      success: true,
      data: airports,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.AddAirport = async (req, res) => {
  try {
    const airport = new Airport(req.body);
    const result = await airport.save();
    return res.status(201).send({
      success: true,
      message: "Airport created successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports.EditAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const airport = await Airport.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!airport) {
      return res
        .status(404)
        .json({ success: false, message: "Airport not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Airport updated successfully",
      data: airport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.DeleteAirport = async (req, res) => {
  try {
    const { id } = req.params;

    const airport = await Airport.findByIdAndDelete(id);

    if (!airport) {
      return res
        .status(404)
        .json({ success: false, message: "Airport not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Airport deleted successfully",
      data: airport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.AddDestination = async (req, res) => {
  try {
    const airportId = req.params.id;
    const { image, name, nickname, description } = req.body;

    const airport = await Airport.findById(airportId);
    if (!airport) {
      return res
        .status(404)
        .json({ success: false, message: "Airport not found" });
    }

    airport.destinations.push({ image, name, nickname, description });
    await airport.save();

    return res.status(201).json({
      success: true,
      message: "Destination added successfully",
      data: airport,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getAllDestinations = async (req, res) => {
  try {
    const airports = await Airport.find({}, "destinations").lean();
    const destinations = airports.flatMap(
      (airport) => airport.destinations || []
    );
    return res.status(200).json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
