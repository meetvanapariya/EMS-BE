import { Leave } from "../models/leaveModel.js";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";
import { User } from "../models/userModel.js";
import moment from "moment";

export const addLeave = async (req, res) => {
  const {
    user_id,
    email,
    username,
    leave_type,
    from_date,
    to_date,
    number_of_days,
    remaining_leave,
    leave_reason,
    approved_by_id,
    leave_day_type,
    status,
    user_role,
  } = req.body;
  if (
    !(
      user_id &&
      username &&
      leave_type &&
      from_date &&
      to_date &&
      leave_reason &&
      user_role
    )
  ) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  const newLeave = new Leave({
    user_id,
    email,
    username,
    leave_type,
    from_date,
    to_date,
    number_of_days,
    remaining_leave,
    leave_reason,
    approved_by_id,
    leave_day_type,
    status,
    user_role,
  });
  newLeave
    .save()
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.LeaveAdd
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

export const getLeave = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  Leave.find({ user_id: user_id })
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

export const editLeave = async (req, res) => {
  const { leave_id } = req.params;
  if (!leave_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  await Leave.findByIdAndUpdate({ _id: leave_id }, req.body)
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.LeaveEdit
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

export const deleteLeave = async (req, res) => {
  const { leave_id } = req.params;
  if (!leave_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  await Leave.remove({ _id: leave_id })
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.LeaveDelete
      );
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}));
};

export const filterLeave = async (req, res) => {
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

export const getCurrentLastLeave = async (req, res) => {
  const user = req.user;
  const user_id = user.id;

  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    );
  }
  const startDate = moment().toDate();
  const endDate = moment(startDate, "DD-MM-YYYY").add(15, "days").toDate();

  Leave.find({
    status: "approved",
    user_role: "Developer",
    user_id: user_id,
    from_date: { $gte: startDate, $lt: endDate },
  })
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


export const filterAdminLeave = (req, res) => {
  // const { username, from_date, to_date, status, leave_type } = req.params;
  var query = {};
  if (req.body.from_date) query.from_date = { $gt: req.body.from_date };
  if (req.body.to_date) query.to_date = { $lt: req.body.to_date };
  if (req.body.leave_type) query.leave_type = { $eq: req.body.leave_type };
  if (req.body.username) query.username = { $eq: req.body.username };
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

export const getLeaveCount = async (req, res) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id);
  let user_emp_date = user.employment_start_date;
  let probation_period = user.probation_period;
  let current_date = new Date();
  let diff_time = current_date - user_emp_date;
  let diff_days = diff_time / (1000 * 3600 * 24);
  console.log(diff_days);
  console.log(probation_period);
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        user,
        successMessages.Fetch
      );
   
};

