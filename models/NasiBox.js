const helper = require("./helper");

const all = () => {
  const query = "SELECT * FROM nasi_box";
  return helper(query);
};
const find = (nasiBoxId) => {
  const findQuery = "SELECT * FROM nasi_box WHERE nasi_box_id = ?";
  return helper(findQuery, nasiBoxId);
};

const create = (value) => {
  const createQuery = "INSERT INTO nasi_box SET ?";
  return helper(createQuery, value);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

const deleteNasiBox = (nasiBoxId) => {
  const deleteQuery = "DELETE FROM nasi_box WHERE nasi_box_id = ?";
  return helper(deleteQuery, nasiBoxId);
};

module.exports = { all, update, deleteNasiBox, find, create };
