const Flight = require('../model/flight');
module.exports.createFlight = async (req, res) => {
  try {
    const flightData = req.body;
    const newFlight = await flightService.createFlight(flightData);
    return res.status(201).json(newFlight);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all flights
module.exports.getFlights = async (req, res) => {
  try {
    const flights = await flightService.getFlights();
    return res.status(200).json(flights);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Book flight
module.exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengerDetails } = req.body;
    const bookingConfirmation = await flightService.bookFlight(flightId, passengerDetails);
    return res.status(200).json(bookingConfirmation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};