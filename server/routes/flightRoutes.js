const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");
const { verify, verifyAdmin } = require("../middlewares/authMiddleware");

router.post("/", verify, verifyAdmin, flightController.createFlight);
router.get("/", verify, flightController.getAllFlights);
router.patch("/:id", verify, verifyAdmin, flightController.updateFlight);
router.delete("/:id", verify, verifyAdmin, flightController.deleteFlight);

router.post("/searchFlight", verify, flightController.searchFlight);
router.get("/searchFlightById/:id", verify, flightController.searchFlightById);

module.exports = router;
