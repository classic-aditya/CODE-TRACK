const ProblemSet = require("../models/problemset.model")
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

const getAllProblemSets = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const sets = await ProblemSet.find({ userId: userId }).populate("problems").sort({ createdAt: -1 })
  res.status(200).json(new ApiResponse(200, sets, "Problem sets fetched"))
})

const getProblemSetById = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const set = await ProblemSet.findOne({ _id: req.params.id, userId: userId }).populate("problems")
  if (!set) {
    throw new ApiError(404, "Problem set not found")
  }
  res.status(200).json(new ApiResponse(200, set, "Problem set fetched"))
})

const createProblemSet = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const name = req.body.name
  const description = req.body.description
  const problems = req.body.problems

  if (!name) {
    throw new ApiError(400, "name is required")
  }

  const set = await ProblemSet.create({
    userId,
    name,
    description,
    problems: problems || []
  })

  res.status(201).json(new ApiResponse(201, set, "Problem set created"))
})

const updateProblemSet = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const set = await ProblemSet.findOneAndUpdate(
    { _id: req.params.id, userId: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!set) {
    throw new ApiError(404, "Problem set not found")
  }
  res.status(200).json(new ApiResponse(200, set, "Problem set updated"))
})

const deleteProblemSet = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const set = await ProblemSet.findOneAndDelete({ _id: req.params.id, userId: userId })
  if (!set) {
    throw new ApiError(404, "Problem set not found")
  }
  res.status(200).json(new ApiResponse(200, null, "Problem set deleted"))
})

const addProblemToSet = asyncHandler(async function(req, res) {
  const userId = getUserId(req)
  const problemId = req.body.problemId

  if (!problemId) {
    throw new ApiError(400, "problemId is required")
  }

  const problem = await Problem.findOne({ _id: problemId, userId: userId })
  if (!problem) {
    throw new ApiError(404, "Problem not found")
  }

  const set = await ProblemSet.findOneAndUpdate(
    { _id: req.params.id, userId: userId },
    { $addToSet: { problems: problemId } },
    { new: true }
  ).populate("problems")

  if (!set) {
    throw new ApiError(404, "Problem set not found")
  }

  res.status(200).json(new ApiResponse(200, set, "Problem added to set"))
})

const removeProblemFromSet = asyncHandler(async function(req, res) {
  const userId = getUserId(req)

  const set = await ProblemSet.findOneAndUpdate(
    { _id: req.params.id, userId: userId },
    { $pull: { problems: req.params.problemId } },
    { new: true }
  ).populate("problems")

  if (!set) {
    throw new ApiError(404, "Problem set not found")
  }
  res.status(200).json(new ApiResponse(200, set, "Problem removed from set"))
})

module.exports = {
  getAllProblemSets,
  getProblemSetById,
  createProblemSet,
  updateProblemSet,
  deleteProblemSet,
  addProblemToSet,
  removeProblemFromSet
}
