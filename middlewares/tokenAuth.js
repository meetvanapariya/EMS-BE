import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environmentVariables.js";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";

export const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return jsonResponse(
      res,
      responseCodes.Forbidden,
      errorMessages.accessTokenRequire,
      {}
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return jsonResponse(
      res,
      responseCodes.Unauthorized,
      errorMessages.accesstokenInvalid,
      {}
    );
  }

  return next();
};
