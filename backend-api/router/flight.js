const express = require('express');
const router = express.Router();
const flightController = require('../controller/flight');
const { verify, verifyAdmin } = require('../auth');


// Admin routes
router.post("/add", verify, verifyAdmin, flightController.addFlight);
router.put("/update/:flightId", verify, verifyAdmin, flightController.updateFlight);
router.put("/archive/:flightId", verify, verifyAdmin, flightController.archiveFlight);
router.put("/activate/:flightId", verify, verifyAdmin, flightController.activateFlight);
router.delete("/delete/:flightId", verify, verifyAdmin, flightController.deleteFlight); 

//  USER SIDE
router.get("/",  flightController.getFlights);
router.get("/search",  flightController.searchFlights);
router.post("/book", verify, flightController.bookFlight);


module.exports = router;
