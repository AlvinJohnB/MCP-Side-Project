const express = require('express');
const router = express.Router();
const flightController = require('../controller/flight');
const { verify } = require('../auth');

router.post("/create", verify, flightController.createFlight);
router.get("/",  flightController.getFlights);
router.get("/search",  flightController.searchFlights);
router.post("/book", verify, flightController.bookFlight);


module.exports = router;
