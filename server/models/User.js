const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be atleast 8 characters long"],
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  bookings: [
    {
      flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
      totalPrice: {
        type: Number,
        required: [true, "Total Price is required"],
      },
      travellers: [
        {
          firstName: {
            type: String,
          },
          lastName: {
            type: String,
          },
          email: {
            type: String,
          },
          phone: {
            type: String,
          },
          address: {
            type: String,
          },
          city: {
            type: String,
          },
          province: {
            type: String,
          },
          zipCode: {
            type: String,
          },
        },
      ],
      additionalInformation: {
        type: String,
      },
      bookingDate: {
        type: Date,
        default: Date.now,
      },
      paymentInformation: {
        paymentIntent: {
          type: String,
        },
        clientKey: {
          type: String,
        },
        paymentMethod: {
          type: String,
        },
        paymentStatus: {
          type: String,
        },
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
