const mongoose = require("mongoose")

const problemSetSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
      }
    ]
  },
  { timestamps: true }
)

const ProblemSet = mongoose.model("ProblemSet", problemSetSchema)

module.exports = ProblemSet
