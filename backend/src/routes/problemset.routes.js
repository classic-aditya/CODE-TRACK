const express = require("express");
const router = express.Router();
const {
  getAllProblemSets,
  getProblemSetById,
  createProblemSet,
  updateProblemSet,
  deleteProblemSet,
  addProblemToSet,
  removeProblemFromSet,
} = require("../controllers/problemset.controller");

router.get("/", getAllProblemSets);
router.get("/:id", getProblemSetById);
router.post("/", createProblemSet);
router.put("/:id", updateProblemSet);
router.delete("/:id", deleteProblemSet);
router.post("/:id/add-problem", addProblemToSet);
router.delete("/:id/remove-problem/:problemId", removeProblemFromSet);

module.exports = router;
