const jwt = require("jsonwebtoken");
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {errorMessages }  = require('../utils/response-message');

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return jsonResponse(res, responseCodes.Forbidden, errorMessages.accessTokenRequire, {} );
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    res.locals.user = decoded;
  } catch (err) {
    return jsonResponse(res, responseCodes.Unauthorized, errorMessages.accesstokenInvalid, {} );
  }
  return next();
};

module.exports = verifyToken;
