const User = require("../model/user.model");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res
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

const getAllUsers = async (req, res) => {
  try {
    const { user } = req;

    if (user.role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized Access",
      });
    }

    const users = await User.find();

    return res.status(200).json({
      status: "success",
      count: users.length,
      message: "Fetched Books successfully",
      data: users,
    });
  } catch (error) {
    logger.error("Error occured in get all users controller", error);
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


const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = { ...req.body };

    if ("role" in updateData) {
      if (req.user.role !== "Admin") {
        delete updateData.role;
        return res.status(403).json({
          status: "error",
          message: "Only Admin can update roles.",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: `User with Id: ${userId} not found.`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: `User with first name: ${updatedUser.firstName} updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    logger.error("Error occured in update user controller", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { user } = req; // Assume req.user contains the currently authenticated user
    const { currentPassword, newPassword } = req.body;

    // Validate request body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password and new password are required",
      });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Validate new password length
    if (newPassword.length < 6 || newPassword.length > 20) {
      return res.status(400).json({
        status: "error",
        message: "New password must be between 6 and 20 characters",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Error occurred in change password controller", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  findUserById,
  updateUser,
  changePassword,
};
