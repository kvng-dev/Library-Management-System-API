const {
  signup,
  login,
  findUserById,
} = require("../controllers/user.controller");
const { validateLogin, validateSignup } = require("../validators/auth");
const { auth } = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/:userId", auth, findUserById);

module.exports = router;
