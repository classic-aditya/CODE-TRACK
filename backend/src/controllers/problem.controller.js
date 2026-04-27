const Problem = require("../models/problem.model")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")
const asyncHandler = require("../utils/asyncHandler")

function getUserId(req) {
  const uid = req.headers["x-user-id"]
  if (!uid) {
    throw new ApiError(401, "Unauthorized: missing user id")
  }
  return uid
}

const getAllProblems = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const filter = { userId: userId }

  if (req.query.difficulty) {
    filter.difficulty = req.query.difficulty.toLowerCase()
  }
  if (req.query.platform) {
    filter.platform = req.query.platform.toLowerCase()
  }
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { tags: { $regex: req.query.search, $options: "i" } }
    ]
  }

  const problems = await Problem.find(filter).sort({ createdAt: -1 })
  res.status(200).json(new ApiResponse(200, problems, "Problems fetched"))
})

const getProblemById = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const problem = await Problem.findOne({ _id: req.params.id, userId: userId })
  if (!problem) {
    throw new ApiError(404, "Problem not found")
  }
  res.status(200).json(new ApiResponse(200, problem, "Problem fetched"))
})

const createProblem = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const title = req.body.title
  const platform = req.body.platform
  const difficulty = req.body.difficulty
  const problemLink = req.body.problemLink
  const tags = req.body.tags
  const approach = req.body.approach
  const timeComplexity = req.body.timeComplexity
  const spaceComplexity = req.body.spaceComplexity

  if (!title || !platform || !difficulty) {
    throw new ApiError(400, "title, platform, and difficulty are required")
  }

  const newProblem = await Problem.create({
    userId,
    title,
    platform,
    difficulty,
    problemLink,
    tags,
    approach,
    timeComplexity,
    spaceComplexity
  })

  res.status(201).json(new ApiResponse(201, newProblem, "Problem created"))
})

const updateProblem = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const problem = await Problem.findOneAndUpdate(
    { _id: req.params.id, userId: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!problem) {
    throw new ApiError(404, "Problem not found")
  }
  res.status(200).json(new ApiResponse(200, problem, "Problem updated"))
})

const deleteProblem = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId: userId })

  if (!problem) {
    throw new ApiError(404, "Problem not found")
  }
  res.status(200).json(new ApiResponse(200, null, "Problem deleted"))
})

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
}
