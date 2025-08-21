const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const Flight = mongoose.models.Flight || mongoose.model('Flight', flightSchema);

module.exports = Flight;