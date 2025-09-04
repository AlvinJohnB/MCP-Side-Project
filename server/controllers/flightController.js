const Flight = require("../models/Flight");

module.exports.createFlight = async (req, res, next) => {
  try {
    const {
      flightNumber,
      origin,
      destination,
      departureDate,
      departureTime,
      price,
    } = req.body;

    const flight = new Flight({
      flightNumber,
      origin,
      destination,
      departureDate,
      departureTime,
      price,
    });

    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    next(error);
  }
};

module.exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find().populate("origin destination");
    res.status(200).json(flights);
  } catch (error) {
    next(error);
  }
};

module.exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json({ message: "Flight updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports.searchFlight = async (req, res, next) => {
  try {
    const { origin, destination, departureDate } = req.body;
    const flights = await Flight.find({
      origin,
      destination,
      departureDate,
    }).populate("origin destination");
    res.status(200).json(flights);
  } catch (error) {
    next(error);
  }
};

module.exports.searchFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id).populate(
      "origin destination"
    );
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json(flight);
  } catch (error) {
    next(error);
  }
};
