const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const bookRoutes = require("./book.routes")

router.use("/users", userRoutes);
router.use("/books", bookRoutes)
router.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to the Library Management System API" });
});

router.all("*", (req, res) => {
  res.status(400).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

module.exports = router;
