const Problem = require("../models/problem.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getUserId = (req) => {
  const uid = req.headers["x-user-id"];
  if (!uid) throw new ApiError(401, "Unauthorized: missing user id");
  return uid;
};

// GET /api/problems
const getAllProblems = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { difficulty, platform, search } = req.query;
  const filter = { userId };
  if (difficulty) filter.difficulty = difficulty.toLowerCase();
  if (platform) filter.platform = platform.toLowerCase();
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }
  const problems = await Problem.find(filter).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, problems, "Problems fetched"));
});

// GET /api/problems/:id
const getProblemById = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const problem = await Problem.findOne({ _id: req.params.id, userId });
  if (!problem) throw new ApiError(404, "Problem not found");
  res.status(200).json(new ApiResponse(200, problem, "Problem fetched"));
});

// POST /api/problems
const createProblem = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { title, platform, difficulty, problemLink, tags, approach,timeComplexity, spaceComplexity } = req.body;
  if (!title || !platform || !difficulty){
    throw new ApiError(400, "title, platform, and difficulty are required")
  };
  const problem = await Problem.create({ 
    userId, title, platform, difficulty, problemLink, tags, approach, timeComplexity, spaceComplexity
  });
  res.status(201).json(new ApiResponse(201, problem, "Problem created"));
});

// PUT /api/problems/:id
const updateProblem = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const problem = await Problem.findOneAndUpdate( 
    {_id: req.params.id, userId }, 
    req.body, 
    { new: true, runValidators: true });
  if (!problem) throw new ApiError(404, "Problem not found");
  res.status(200).json(new ApiResponse(200, problem, "Problem updated"));
});

// DELETE /api/problems/:id
const deleteProblem = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId });
  if (!problem) throw new ApiError(404, "Problem not found");
  res.status(200).json(new ApiResponse(200, null, "Problem deleted"));
});

module.exports = { getAllProblems, getProblemById, createProblem, updateProblem, deleteProblem };
