const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const flightRouter = require('./router/flight');
const userRouter = require('./router/user');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

const port = process.env.PORT || 4000;

app.use("/users", userRouter);
app.use("/flights", flightRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));