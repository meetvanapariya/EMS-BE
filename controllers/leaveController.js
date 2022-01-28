import { Leave } from "../models/leaveModel.js";
import jsonResponse from "../utils/json-response.js";
import responseCodes from "../helpers/response-codes.js";
import { successMessages, errorMessages } from "../utils/response-message.js";
import { User } from "../models/userModel.js";
import moment from "moment";

export const addLeave = async (req, res) => {
  const {
    user_id,
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
    date,
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
    date,
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
  console.log("req", req.body);
  var query = {};
  if (req.body.leave_type) query.leave_type = { $eq: req.body.leave_type };
  if (req.body.username) query.username = { $eq: req.body.username };
  if (req.body.status) query.status = { $eq: req.body.status };

  var from_date = req.body.from_date;
  var to_date = req.body.to_date;
  from_date || to_date
    ? (query.date = {
        $elemMatch:
          from_date && to_date
            ? { $gte: from_date, $lte: to_date }
            : from_date
            ? { $gte: from_date }
            : to_date && { $lte: to_date },
      })
    : "";

  console.log("query", query);
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
  let is_probation_period_over = user.is_probation_period_over;
  let current_date = new Date();
  let total_wroking_time = current_date - user_emp_date;
  let total_working_days = total_wroking_time / (1000 * 3600 * 24);
  let after_probation_over_working_days = total_working_days - (30 * probation_period);
  let current_year_first_date = new Date(new Date().getFullYear(), 0, 1);
  var leaves_after_probation_over = 0 ;
  var userLeaveList = [];
  var response ; 
  // if user completed probation period
  if(after_probation_over_working_days >= 1){
    //check total users worked days
    let total_working_days_inc_probation = (current_date - user_emp_date ) / (1000 * 3600 * 24);
    let total_leaves = Math.ceil(total_working_days_inc_probation / 30);
    //total leaves of users
    leaves_after_probation_over = total_leaves - probation_period;
    
    //approved leave from past to cal final aval leave
    userLeaveList = await Leave.find({ user_id: user_id , leave_type : {$ne : "loss_of_pay"} , status : {$in : ["approved","partial_approved"]} });
    let count = 0;
    const days = userLeaveList.map(leave => count+=parseInt(leave.number_of_days) );
    let ava_leave = 0;
    ava_leave = leaves_after_probation_over - days[0];
    if(is_probation_period_over === true){
      ava_leave = 0;
    }
    response = {
        "total_leave" : leaves_after_probation_over,
        "used_leave" : days[0],
        "available_leave" : ava_leave ,
    }
    await User.findByIdAndUpdate({ _id: user_id },{ total_leaves : ava_leave });
  }else{
    return jsonResponse(res, responseCodes.Invalid, '', {})
  }
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        response,
        successMessages.Fetch
      );
};



const monthsBtwnDates = (startDate, endDate) => {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
    return Math.max(
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        endDate.getMonth() -
        startDate.getMonth(),
      0
      
)};