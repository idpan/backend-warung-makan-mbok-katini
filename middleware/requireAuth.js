const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "authentication token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(email);
    const dataUser = await User.find(email);
    req.user = dataUser.email;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
