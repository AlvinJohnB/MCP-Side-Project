const Flight = require("../model/Flight");

//ADMIN SIDE
// Add Flight
module.exports.addFlight = (req, res) => {
  Flight.findOne({ flightNumber: req.body.flightNumber })
    .then((existingFlight) => {
      if (existingFlight) {
        return res.status(409).send({ message: "Flight already exists" });
      }

      const newFlight = new Flight({
        flightNumber: req.body.flightNumber,
        origin: req.body.origin,
        destination: req.body.destination,
        departureTime: req.body.departureTime,
        arrivalTime: req.body.arrivalTime,
        price: req.body.price,
        airline: req.body.airline,
        isActive: true,
      });

      return newFlight.save()
        .then((result) => {
          return res.status(201).send({
            success: true,
            message: "Flight added successfully",
            data: result,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).send({ success: false, message: error.message });
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    });
};

// Edit/Update flight
module.exports.updateFlight = (req, res) => {
  const flightId = req.params.flightId;

  let updates = {
    flightNumber: req.body.flightNumber,
    origin: req.body.origin,
    destination: req.body.destination,
    departureTime: req.body.departureTime,
    arrivalTime: req.body.arrivalTime,
    price: req.body.price,
    airline: req.body.airline,
  };

  return Flight.findByIdAndUpdate(flightId, updates, { new: true })
    .then((updatedFlight) => {
      if (!updatedFlight) {
        return res.status(404).send({ message: "Flight not found" });
      }
      return res.status(200).send({
        success: true,
        message: "Flight updated successfully",
        data: updatedFlight,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    });
};

// Archive flight 
module.exports.archiveFlight = (req, res) => {
  const flightId = req.params.flightId;

  return Flight.findById(flightId)
    .then((flight) => {
      if (!flight) {
        return res.status(404).send({ message: "Flight not found" });
      }

      if (!flight.isActive) {
        return res.status(200).send({ message: "Flight already archived" });
      }

      flight.isActive = false;
      return flight.save().then(() =>
        res.status(200).send({ success: true, message: "Flight archived successfully" })
      );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    });
};

// Activate flight 
module.exports.activateFlight = (req, res) => {
  const flightId = req.params.flightId;

  return Flight.findById(flightId)
    .then((flight) => {
      if (!flight) {
        return res.status(404).send({ message: "Flight not found" });
      }

      if (flight.isActive) {
        return res.status(200).send({ message: "Flight is already active" });
      }

      flight.isActive = true;
      return flight.save().then(() =>
        res.status(200).send({ success: true, message: "Flight activated successfully" })
      );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    });
};

// Delete Flight 
module.exports.deleteFlight = (req, res) => {
  const flightId = req.params.flightId;

  if (!flightId) {
    return res.status(400).send({ success: false, message: "Flight ID is required" });
  }

  Flight.findByIdAndDelete(flightId)
    .then((deletedFlight) => {
      if (!deletedFlight) {
        return res.status(404).send({ success: false, message: "Flight not found" });
      }

      return res.status(200).send({
        success: true,
        message: "Flight deleted successfully",
        data: deletedFlight,
      });
    })
    .catch((error) => {
      console.error("Error deleting flight:", error);
      return res.status(500).send({ success: false, message: "Server error" });
    });
};

// USER SIDE

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
