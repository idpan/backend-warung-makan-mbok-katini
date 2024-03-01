const helper = require("./helper");

const all = () => {
  const query = "SELECT * FROM menu";
  return helper(query);
};
const find = (menuId) => {
  const findQuery = "SELECT * FROM menu WHERE id_menu = ?";
  return helper(findQuery, menuId);
};

const create = (value) => {
  const createQuery = "INSERT INTO menu SET ?";
  return helper(createQuery, value);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

const deleteMenu = (menuId) => {
  const deleteQuery = "DELETE FROM menu WHERE id_menu = ?";
  return helper(deleteQuery, menuId);
};

module.exports = { all, update, deleteMenu, find, create };
