const express = require("express");
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problem.controller");

router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.post("/", createProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
