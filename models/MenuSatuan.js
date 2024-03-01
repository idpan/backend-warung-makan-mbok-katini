const helper = require("./helper");

const all = () => {
  const query = "SELECT * FROM menu_satuan";
  return helper(query);
};
const find = (menuSatuanId) => {
  const findQuery = "SELECT * FROM menu_satuan WHERE menu_satuan_id = ?";
  return helper(findQuery, menuSatuanId);
};

const create = (value) => {
  const createQuery = "INSERT INTO menu_satuan SET ?";
  return helper(createQuery, value);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

const deleteMenuSatuan = (menuSatuanId) => {
  const deleteQuery = "DELETE FROM menu_satuan WHERE menu_satuan_id = ?";
  return helper(deleteQuery, menuSatuanId);
};

module.exports = { all, update, deleteMenuSatuan, find, create };
