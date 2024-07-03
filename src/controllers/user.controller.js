const User = require("../model/user.model");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      res
        .status(400)
        .status({ status: "Error", message: "Email already exists!" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hash,
      role,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User Registration Complete",
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    logger.error("Error Occured in signup controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    const token = await jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: 600 * 5,
    });

    res.status(200).json({
      status: "success",
      message: "Login Successful",
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error("Error occured in login controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const findUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: `User with ID: ${userId} does not exist`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User Found",
      data: user,
    });
  } catch (error) {
    logger.error("Error occured in login controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  findUserById
};
