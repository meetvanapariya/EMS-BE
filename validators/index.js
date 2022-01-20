import pkg from "express-validator";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";
const { validationResult } = pkg;

export const runValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    jsonResponse(res, responseCodes.Invalid, errors.array()[0].msg, {});
  } else {
    next();
  }
};
