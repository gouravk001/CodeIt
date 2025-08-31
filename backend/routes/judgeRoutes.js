const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware")
const { getLanguages, submitProblem, runCode } = require("../controllers/judgeController");
router.get("/getLanguages",getLanguages);
router.post("/submitCode",authMiddleware,submitProblem);
router.post("/runCode",authMiddleware,runCode);
module.exports = router;