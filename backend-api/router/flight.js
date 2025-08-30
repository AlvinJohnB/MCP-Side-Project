const express = require("express");
const router = express.Router();
const flightController = require("../controller/flight");
const { verify } = require("../auth");

router.post("/create", flightController.createFlight);
router.get("/", flightController.getFlights);
router.post("/search", flightController.searchFlights);
router.post("/book", verify, flightController.bookFlight);

// Airports CRUD
router.get("/airports", flightController.getAirports);
router.post("/airports", flightController.AddAirport);
router.patch("/airports/:id", flightController.EditAirport);
router.delete("/airports/:id", flightController.DeleteAirport);

router.patch("/airports/destination/:id", flightController.AddDestination);
router.get("/airports/getAllDestinations", flightController.getAllDestinations);

module.exports = router;
