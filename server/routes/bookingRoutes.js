const express = require("express");
const router = express.Router();
const { verify } = require("../middlewares/authMiddleware");
const bookingController = require("../controllers/bookingController");

router.patch("/", verify, bookingController.createBooking);
router.get("/myBookings", verify, bookingController.getUserBookings);
router.get("/:id", verify, bookingController.getBookingById);

router.patch(
  "/:id",
  verify,
  bookingController.updateBookingCreatePaymentIntent
);

router.patch(
  "/:id/:method/payment",
  verify,
  bookingController.confirmBookingPayment
);

router.get(
  "/payment/verify/:id",
  verify,
  bookingController.verifyPaymentStatus
);

module.exports = router;
