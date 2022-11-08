const commom = require("../common/common.js");
const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
  const token = commom.parseCookies(request);
  if (!token) return response.redirect('/login')

  try {
    const verified = jwt.verify(token.token, 'demo123_key');
    request.data_user = verified
    next();
  } catch (err) {
    return response.redirect('/login')
  }
};

module.exports = {
  verifyToken,
};
