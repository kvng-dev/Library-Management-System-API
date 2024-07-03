const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }
    const [scheme, token] = authHeader.split(" ");

    if (scheme.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token provided",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);

    return res.status(401).json({
      status: "error",
      message: "Invalid token provided",
    });
  }
};

const librarianAuth = async(req, res, next) => {

  if(req.user && req.user.role === 'librarian') {
    next()
  } else {
    return res.status(403).json({
      status: "error",
      message: "Forbidden: Librarian access only",
    });
  }
}

module.exports = {auth, librarianAuth};
