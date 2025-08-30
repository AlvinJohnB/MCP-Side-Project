const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../middlewares/authMiddleware");
const airportController = require("../controllers/airportController");

router.post("/", verify, verifyAdmin, airportController.addAirport);
router.get("/all", verify, airportController.getAllAirports);
router.patch("/:id", verify, verifyAdmin, airportController.updateAirport);
router.delete("/:id", verify, verifyAdmin, airportController.deleteAirport);

module.exports = router;
