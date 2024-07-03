const { check, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    const errorObj = {};
    errors.array().forEach((e) => {
      errorObj[e.path] = (errorObj[e.path] || []).concat([e.msg]);
    });

    return res.status(400).json({
      status: "error",
      message: "Validation Failed",
      data: errorObj,
    });
  }
  next();
};

const validateLogin = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be within a range of 6 - 20 characters!"),
  validate,
];

const validateSignup = [
  check("username").notEmpty().withMessage("Username is required"),
  check("role").notEmpty().withMessage("Role is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be within a range of 6 - 20 characters!"),
  validate,
];

module.exports = {
  validateSignup,
  validateLogin,
};
