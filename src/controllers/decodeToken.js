const jwt = require("jsonwebtoken");

const fetchId = (token) => {
  const userId = jwt.decode(token, process.env.SECRETE);
  return userId?.user_id;
};

const RoleId = (token) => {
  const userId = jwt.decode(token, process.env.SECRETE);
  return userId?.role;
};

module.exports = { fetchId, RoleId };
