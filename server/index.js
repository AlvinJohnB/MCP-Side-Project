require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const airportRoutes = require("./routes/airportRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const { errorHandler } = require("./middlewares/errorHandler");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/users", userRoutes);
app.use("/airports", airportRoutes);
app.use("/flights", flightRoutes);
app.use("/bookings", bookingRoutes);

// Error Handling Middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  });
}

// exports an object containing the value of the "app" variable only used for grading
module.exports = { app, mongoose };
