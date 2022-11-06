const commom = require("../common/common.js");
const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
  const token = commom.parseCookies(request);
  if (!token) return response.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token.token, 'demo123_key');
    next();
  } catch (err) {
    return response.status(400).send("Invalid Token");
  }
};

module.exports = {
  verifyToken,
};
