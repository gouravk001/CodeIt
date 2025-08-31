const express = require("express");
const { createProblem, getAllProblems, getProblem } = require("../controllers/problemController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const router = express.Router();
router.post("/create",authMiddleware,adminMiddleware,createProblem);
router.get("/getAll",getAllProblems);
router.get("/getProblem/:id",authMiddleware,getProblem);
module.exports = router;
