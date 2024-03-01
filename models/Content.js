const helper = require("./helper");

const all = () => {
  const query = "SELECT * FROM content";
  return helper(query);
};

const update = (updateQuery, value) => {
  return helper(updateQuery, value);
};

module.exports = { all, update };
