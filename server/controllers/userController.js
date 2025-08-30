const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;

    if (
      typeof email !== "string" ||
      email.indexOf("@") === -1 ||
      email.indexOf(".") === -1
    ) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({ message: "Email already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be at least 8 characters long" });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    if (typeof fullName !== "string" || fullName.trim().length < 5) {
      return res
        .status(400)
        .send({ message: "Full name must be at least 5 characters" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    const result = await newUser.save();

    return res.status(201).send({
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const result = await User.findOne({ email: req.body.email });

    if (!result) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordCorrect = bcryptjs.compareSync(
      req.body.password,
      result.password
    );

    if (isPasswordCorrect) {
      const accessToken = authMiddleware.createAccessToken(result);
      return res.status(200).send({ access: accessToken });
    } else {
      return res.status(400).send({ message: "Incorrect email or password" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getUserDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
