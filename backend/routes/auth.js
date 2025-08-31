const express = require("express");
const router = express.Router();
const {login,signup, getUserProfile} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/signup",signup);
router.post("/login",login);
router.get("/profile",authMiddleware,getUserProfile);

module.exports = router;