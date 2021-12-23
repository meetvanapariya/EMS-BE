import { Holiday } from "../models/holidayModel.js";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";

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

export const getHoliday = async (req, res) => {
  //   const { user_id } = req.params;
  //   if (!user_id) {
  //     return jsonResponse(
  //       res,
  //       responseCodes.BadRequest,
  //       errorMessages.missingParameter,
  //       {},
  //     );
  //   }
  Holiday.find()
    .then((holidays) => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        holidays,
        successMessages.Create
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

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
