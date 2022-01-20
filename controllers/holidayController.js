import { Holiday } from "../models/holidayModel.js";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";

// Add holiday request controller
export const addHoliday = async (req, res) => {
  const { holiday_name, holiday_date } = req.body;
  if (!(holiday_name && holiday_date)) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  const newHoliday = new Holiday({
    holiday_name,
    holiday_date,
  });
  newHoliday
    .save()
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Create
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

// Get holiday request controller
export const getHoliday = async (req, res) => {
  const user = req.user;
  const role = user.role;
  let today = new Date();
  let query = { isDelete: { $ne: true } };

  // this query will find all holidays which will be after today
  if (role !== "Admin") query.holiday_date = { $gte: today };

  Holiday.find(query)
    .sort({ holiday_date: 1 })
    .then((holidays) => {
      return jsonResponse(
        res,
        200,
        errorMessages.noError,
        { holidays },
        successMessages.Fetch
      );
    })
    .catch((error) => {
      return jsonResponse(res, 400, error.message, {}, {});
    });
};

// Get Upcomin gHoliday request controller
export const getUpcomingHoliday = async (req, res) => {
  const today = new Date();
  // this query will find all holidays which will be after today
  Holiday.find({
    holiday_date: { $gte: today },
    isDelete: { $ne: true },
  })
    .sort({ holiday_date: 1 })
    .then((upcomingHolidays) => {
      return jsonResponse(
        res,
        200,
        errorMessages.noError,
        { upcomingHolidays },
        successMessages.Fetch
      );
    })
    .catch((error) => {
      return jsonResponse(res, 400, error.message, {}, {});
    });
};

// Edit holiday request controller
export const editHoliday = async (req, res) => {
  const { holiday_id } = req.params;
  if (!holiday_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  await Holiday.findByIdAndUpdate({ _id: holiday_id }, req.body)
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Update
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

export const filterHoliday = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  var query = { user_id: user_id };
  if (req.body.from_date) query.from_date = { $gt: req.body.from_date };
  if (req.body.to_date) query.to_date = { $lt: req.body.to_date };
  if (req.body.status) query.status = { $eq: req.body.status };

  Leave.find(query)
    .then((leaves) => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        leaves,
        successMessages.Fetch
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

// delete holiday request controller
export const deleteHoliday = async (req, res) => {
  const { holiday_id } = req.params;
  try {
    // try to find and softDelete holiday with provided holiday_id from database
    const holiday = await Holiday.findByIdAndUpdate(
      { _id: holiday_id },
      { isDelete: true }
    );

    // if holiday not found in database then return error message to client
    if (!holiday) {
      return res.json({
        error: "Holiday not found",
        payload: {},
        message: "",
        status: 400,
      });
    }

    // if holiday is successfully soft deleted then return success message to client
    return res.json({
      error: "",
      payload: holiday,
      message: "Holiday deleted successfully.",
      status: 200,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      payload: {},
      message: "Please provide proper holiday id",
      status: 400,
    });
  }
};
