const ProblemSet = require("../models/problemset.model");
const Problem = require("../models/problem.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getUserId = (req) => {
  const uid = req.headers["x-user-id"];
  if (!uid) throw new ApiError(401, "Unauthorized: missing user id");
  return uid;
};

// GET /api/problem-sets
const getAllProblemSets = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const sets = await ProblemSet.find({ userId }).populate("problems").sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, sets, "Problem sets fetched"));
});

// GET /api/problem-sets/:id
const getProblemSetById = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const set = await ProblemSet.findOne({ _id: req.params.id, userId }).populate("problems");
  if (!set) throw new ApiError(404, "Problem set not found");
  res.status(200).json(new ApiResponse(200, set, "Problem set fetched"));
});

// POST /api/problem-sets
const createProblemSet = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { name, description, problems } = req.body;
  if (!name) throw new ApiError(400, "name is required");
  const set = await ProblemSet.create({ userId, name, description, problems: problems || [] });
  res.status(201).json(new ApiResponse(201, set, "Problem set created"));
});

// PUT /api/problem-sets/:id
const updateProblemSet = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const set = await ProblemSet.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true, runValidators: true });
  if (!set) throw new ApiError(404, "Problem set not found");
  res.status(200).json(new ApiResponse(200, set, "Problem set updated"));
});

// DELETE /api/problem-sets/:id
const deleteProblemSet = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const set = await ProblemSet.findOneAndDelete({ _id: req.params.id, userId });
  if (!set) throw new ApiError(404, "Problem set not found");
  res.status(200).json(new ApiResponse(200, null, "Problem set deleted"));
});

// POST /api/problem-sets/:id/add-problem
const addProblemToSet = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { problemId } = req.body;
  if (!problemId) throw new ApiError(400, "problemId is required");
  const problem = await Problem.findOne({ _id: problemId, userId });
  if (!problem) throw new ApiError(404, "Problem not found");
  const set = await ProblemSet.findOneAndUpdate(
    { _id: req.params.id, userId },
    { $addToSet: { problems: problemId } },
    { new: true }
  ).populate("problems");
  if (!set) throw new ApiError(404, "Problem set not found");
  res.status(200).json(new ApiResponse(200, set, "Problem added to set"));
});

// DELETE /api/problem-sets/:id/remove-problem/:problemId
const removeProblemFromSet = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const set = await ProblemSet.findOneAndUpdate(
    { _id: req.params.id, userId },
    { $pull: { problems: req.params.problemId } },
    { new: true }
  ).populate("problems");
  if (!set) throw new ApiError(404, "Problem set not found");
  res.status(200).json(new ApiResponse(200, set, "Problem removed from set"));
});

module.exports = { getAllProblemSets, getProblemSetById, createProblemSet, updateProblemSet, deleteProblemSet, addProblemToSet, removeProblemFromSet };
