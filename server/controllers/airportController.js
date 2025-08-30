const Airport = require("../models/Airport");

module.exports.addAirport = async (req, res, next) => {
  try {
    const { name, location, code } = req.body;

    const existingAirport = await Airport.findOne({
      code,
      name,
    });

    if (existingAirport) {
      return res.status(409).send({ message: "Airport already exists!" });
    }

    const newAirport = new Airport({
      name,
      location,
      code,
    });

    await newAirport.save();

    return res.status(201).send({ message: "Airport added successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllAirports = async (req, res, next) => {
  try {
    const airports = await Airport.find();
    return res.status(200).send(airports);
  } catch (error) {
    next(error);
  }
};

module.exports.updateAirport = async (req, res, next) => {
  try {
    const { name, location, code } = req.body;
    const airportId = req.params.id;

    const airport = await Airport.findByIdAndUpdate(
      airportId,
      {
        name,
        location,
        code,
      },
      { new: true }
    );

    console.log(airport);

    if (!airport) {
      return res.status(404).send({ message: "Airport not found" });
    }

    return res
      .status(200)
      .send({ message: "Airport updated successfully", airport });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteAirport = async (req, res, next) => {
  try {
    const airportId = req.params.id;

    const airport = await Airport.findByIdAndDelete(airportId);

    if (!airport) {
      return res.status(404).send({ message: "Airport not found" });
    }

    return res.status(200).send({ message: "Airport deleted successfully" });
  } catch (error) {
    next(error);
  }
};
