import express from "express";
const codes = {
	OK: 200,
	EntryCreated: 201,
	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	ResourceNotFound: 404,
	MethodNotAllowed: 405,
	Conflict: 409,
	TokenInvalid: 412,
	InternalServer: 500,
	Invalid:402,
	NotActive:406,
	S3Bucket:408,
	DBOperation:410
};

export default codes;