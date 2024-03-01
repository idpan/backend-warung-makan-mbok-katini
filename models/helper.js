const db = require("../db_config");

const helper = (query, data) => {
  return new Promise((resolve, reject) => {
    // select all data from database
    db.query(query, data, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = helper;
