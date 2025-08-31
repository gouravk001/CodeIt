const jwt = require("jsonwebtoken");
const User= require("../models/User.js");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized: No token");

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).send("Unauthorized: User not found");

    req.user = user; 
    next(); 
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = {authMiddleware}