import jwt, { decode } from "jsonwebtoken";
import { JWT_SECRET } from "../config/environmentVariables.js";
import jsonResponse from "../utils/json-response.js";
import { errorMessages } from "../utils/response-message.js";

export const canAccess = (req, res, next) => {
  if (!isAuthenticatedRole(req)) {
    return jsonResponse(res, 403, errorMessages.invalidRole, {});
  }
  next();
};

function isAuthenticatedRole(req) {
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
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("from role auth", decoded);
  console.log(
    "from role auth",
    req.params.userId == decoded.id || decoded.role == "Admin"
  );
  return req.params.userId == decoded.id || decoded.role == "Admin";
}
