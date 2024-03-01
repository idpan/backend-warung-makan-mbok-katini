const helper = require("./helper");

const all = () => {
  const selecAllQuery = "SELECT * FROM contact";
  return helper(selecAllQuery);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

module.exports = { all, update };
