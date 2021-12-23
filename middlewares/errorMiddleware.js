import { NODE_ENV } from "../config/environmentVariables.js";
import jsonResponse from '../utils/json-response.js';
import responseCodes from '../helpers/response-codes.js';
import {successMessages , errorMessages }  from '../utils/response-message.js';


export const notFound = (req, res, next) => {
  jsonResponse(res, responseCodes.ResourceNotFound,'End point not found', {});
  // next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
  });
};
