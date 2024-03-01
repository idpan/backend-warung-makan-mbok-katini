const helper = require("./helper");
const bcrypt = require("bcrypt");

const login = async (email, password) => {
  // check apakah email atau password tidak dikirim
  if (!email || !password) {
    throw Error("email and password must be filled in !!");
  }
  // ambil data user sesuai email dari database
  const user = await find(email);
  // check apakah email yang dikirim sesuai dengan yang ada di database
  if (!user) {
    throw Error("incorect email");
  }
  // check apakah password yang dikirim sesuai dengan yang ada di database
  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    throw Error("incorect password");
  }

  return user;
};
const find = async (email) => {
  const findUserQuery = "SELECT * from user WHERE email = ?";
  const [user] = await helper(findUserQuery, email);
  return user;
};
const changePassword = async (email, currentPassword, newPassword) => {
  // get user data from database
  const user = await find(email);
  //compare gifted password with password in database
  const isMatchPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isMatchPassword) {
    throw Error("incorect current password");
  }
  // hash new password
  const salt = await bcrypt.genSalt(10);
  console.log("new password ", newPassword);
  console.log("salt ", salt);

  const hash = await bcrypt.hash(newPassword, salt);
  console.log("hash ", hash);
  // change current password with new password
  const updateQuery = `UPDATE user SET password = ?  `;
  await helper(updateQuery, hash);
};
module.exports = { login, find, changePassword };
