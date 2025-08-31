const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    console.log(req.user);
    return res.status(403).send("Forbidden: Admins only");
  }
  next();
};

module.exports = { adminMiddleware };
