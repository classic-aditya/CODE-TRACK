require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log("server started on port " + PORT)
    })
  } catch (err) {
    console.error("couldn't connect to db:", err.message)
    process.exit(1)
  }
}

startServer()
