const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  code: {
    type: String,
    required: true,
    unique: [true, "Airport code must be unique"],
  },
  destinations: [
    {
      image: { type: String, default: null },
      name: { type: String, required: true },
      nickname: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});

const Airport = mongoose.model("Airport", airportSchema);

module.exports = Airport;
