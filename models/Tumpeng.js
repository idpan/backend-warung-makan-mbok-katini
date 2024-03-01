const helper = require("./helper");

const all = () => {
  const query = "SELECT * FROM tumpeng";
  return helper(query);
};
const find = (tumpengId) => {
  const findQuery = "SELECT * FROM tumpeng WHERE tumpeng_id = ?";
  return helper(findQuery, tumpengId);
};

const create = (value) => {
  const createQuery = "INSERT INTO tumpeng SET ?";
  return helper(createQuery, value);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

const deleteTumpeng = (tumpengId) => {
  const deleteQuery = "DELETE FROM tumpeng WHERE tumpeng_id = ?";
  return helper(deleteQuery, tumpengId);
};

module.exports = { all, update, deleteTumpeng, find, create };
