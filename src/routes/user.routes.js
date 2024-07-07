const {
  signup,
  login,
  findUserById,
  getAllUsers,
  updateUser,
  changePassword,
} = require("../controllers/user.controller");
const { validateLogin, validateSignup } = require("../validators/auth");
const { auth } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/:userId", auth, findUserById);
router.get("/", auth, getAllUsers);
router.put("/:userId", auth, updateUser);
router.put("/change-password/:userId", auth, changePassword);

module.exports = router;
