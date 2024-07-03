require("dotenv").config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET
}