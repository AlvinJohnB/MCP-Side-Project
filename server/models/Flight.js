const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, "Flight number is required"],
    unique: [true, "Flight number must be unique"],
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Airport",
    required: true,
  },
  departureDate: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
