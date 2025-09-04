const User = require("../models/User");
const Flight = require("../models/Flight");
const {
  createPaymentIntent,
  createPaymentMethod,
  attachPaymentMethodToIntent,
  retrievePaymentIntent,
} = require("../services/paymongoService");

module.exports.createBooking = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { flightId, quantity, totalPrice } = req.body;

    const user = await User.findById(id);
    const flight = await Flight.findById(flightId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const newBooking = {
      flightId,
      quantity,
      totalPrice,
    };

    user.bookings.push(newBooking);
    const updatedUser = await user.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: updatedUser.bookings[updatedUser.bookings.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { id: bookingId } = req.params;

    const user = await User.findById(id).populate({
      path: "bookings.flightId",
      populate: [{ path: "destination" }, { path: "origin" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = user.bookings.id(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserBookings = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate({
      path: "bookings.flightId",
      populate: [{ path: "destination" }, { path: "origin" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ bookings: user.bookings });
  } catch (error) {
    next(error);
  }
};

module.exports.updateBookingCreatePaymentIntent = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { id: bookingId } = req.params;
    const { passengers } = req.body;

    const user = await User.findById(id).populate({
      path: "bookings.flightId",
      populate: [{ path: "destination" }, { path: "origin" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = user.bookings.id(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!Array.isArray(passengers) || passengers.length !== booking.quantity) {
      return res.status(400).json({ message: "Invalid passenger data" });
    }

    booking.travellers = passengers;

    await user.save();

    const paymentIntent = await createPaymentIntent(
      booking.totalPrice,
      booking.flightId.flightNumber.toString(),
      `${booking.flightId.origin.code} to ${booking.flightId.destination.code} - ${booking.quantity} ticket(s)`
    );

    booking.paymentInformation = {
      paymentStatus: paymentIntent.attributes.status,
      paymentIntent: paymentIntent.id,
      clientKey: paymentIntent.attributes.client_key,
    };

    await user.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    next(error);
  }
};

module.exports.confirmBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { id: bookingId, method } = req.params;

    // Validate payment method is supported
    if (!["gcash", "paymaya", "card"].includes(method)) {
      return res.status(400).json({ message: "Unsupported payment method" });
    }

    const user = await User.findById(id).populate({
      path: "bookings.flightId",
      populate: [{ path: "destination" }, { path: "origin" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = user.bookings.id(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if we already have payment intent and client key
    if (
      !booking.paymentInformation ||
      !booking.paymentInformation.paymentIntent ||
      !booking.paymentInformation.clientKey
    ) {
      return res.status(400).json({
        message:
          "Payment intent not created. Please complete booking information first.",
      });
    }

    let userContact = {};

    if (method === "gcash" || method === "paymaya" || method === "card") {
      // Ensure traveler information exists
      if (!booking.travellers || booking.travellers.length === 0) {
        return res.status(400).json({
          message: "Traveler information is required",
        });
      }

      userContact = {
        name:
          booking.travellers[0].firstName +
          " " +
          booking.travellers[0].lastName,
        email: booking.travellers[0].email,
        phone: booking.travellers[0].phone,
        address: booking.travellers[0].address,
      };
    }

    // console.log("Creating payment method with:", { userContact, method });
    const paymentMethod = await createPaymentMethod(
      userContact,
      method,
      req.body?.cardDetails
    );

    if (!paymentMethod) {
      return res
        .status(400)
        .json({ message: "Payment method creation failed" });
    }
    // console.log("Payment method created:", paymentMethod.id);

    const paymentIntentId = booking.paymentInformation.paymentIntent;
    const clientKey = booking.paymentInformation.clientKey;

    // console.log("Attaching payment method with params:", {
    //   paymentIntentId,
    //   paymentMethodId: paymentMethod.id,
    //   clientKey,
    // });

    try {
      const attachedPayment = await attachPaymentMethodToIntent(
        paymentIntentId,
        paymentMethod.id,
        clientKey,
        booking._id
      );

      if (!attachedPayment) {
        return res
          .status(400)
          .json({ message: "Attaching payment method failed" });
      }

      booking.paymentInformation = {
        ...booking.paymentInformation,
        paymentMethod: paymentMethod.id,
        paymentStatus: attachedPayment.attributes.status,
      };

      await user.save();

      res.status(200).json({
        message: "Booking payment confirmed",
        booking,
        redirect_url: attachedPayment.attributes?.next_action?.redirect?.url
          ? attachedPayment.attributes.next_action.redirect.url
          : null,
      });
    } catch (attachError) {
      console.error("Payment attachment error:", attachError);
      return res.status(400).json({
        message: "Failed to attach payment method: " + attachError.message,
        paymentMethodId: paymentMethod.id, // Return the created payment method ID for debugging
      });
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    next(error);
  }
};

module.exports.verifyPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    console.log("Verifying payment status for ID:", id);

    const user = await User.findById(userId).populate("bookings");

    const booking = user.bookings.id(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const paymentIntent = await retrievePaymentIntent(
      booking.paymentInformation.paymentIntent
    );

    if (!paymentIntent) {
      return res.status(404).json({ message: "Payment intent not found" });
    }

    booking.paymentInformation.paymentStatus = paymentIntent.status;

    await user.save();

    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Payment verification error:", error);
    next(error);
  }
};
