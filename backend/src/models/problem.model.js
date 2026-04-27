const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    platform: {
      type: String,
      enum: ["leetcode", "codeforces", "geeksforgeeks"],
      required: [true, "Platform is required"],
      lowercase: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty is required"],
      lowercase: true
    },
    problemLink: {
      type: String,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    approach: {
      type: String,
      trim: true
    },
    timeComplexity: {
      type: String,
      trim: true
    },
    spaceComplexity: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
)

const Problem = mongoose.model("Problem", problemSchema)

module.exports = Problem
