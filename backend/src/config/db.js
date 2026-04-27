const mongoose = require("mongoose")

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("mongodb connected:", conn.connection.host)
  } catch (err) {
    console.error("mongodb connection failed:", err.message)
    throw err
  }
}

module.exports = connectDB
