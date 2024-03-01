const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1 days",
  });
};

const loginController = async (req, res) => {
  // mengambil email dan password dari req.body

  const { email, password } = req.body;
  //   membuat jwt token untuk user
  try {
    const user = await User.login(email, password);
    const token = createToken(user.email);

    res
      .status(200)
      .json({ mssg: "admin login succesfully", email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePasswordController = async (req, res) => {
  const { email, password, newPassword } = req.body;
  try {
    await User.changePassword(email, password, newPassword);

    res.status(200).json({ mssg: "change password success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { loginController, changePasswordController };
