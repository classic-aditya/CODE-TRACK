const express = require("express")
const router = express.Router()

const problemSetController = require("../controllers/problemset.controller")

router.get("/", problemSetController.getAllProblemSets)
router.get("/:id", problemSetController.getProblemSetById)
router.post("/", problemSetController.createProblemSet)
router.put("/:id", problemSetController.updateProblemSet)
router.delete("/:id", problemSetController.deleteProblemSet)
router.post("/:id/add-problem", problemSetController.addProblemToSet)
router.delete("/:id/remove-problem/:problemId", problemSetController.removeProblemFromSet)

module.exports = router
