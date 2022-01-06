import { Leave } from '../models/leaveModel.js'
import jsonResponse from '../utils/json-response.js'
import responseCodes from '../helpers/response-codes.js'
import { successMessages, errorMessages } from '../utils/response-message.js'

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
  } = req.body
  if (
    !(
      user_id &&
      email &&
      username &&
      leave_type &&
      from_date &&
      to_date &&
      leave_reason
    )
  ) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    )
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
    approved_by_id: '',
    leave_day_type,
    status,
  })
  newLeave
    .save()
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Create
      )
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}))
}

export const getLeave = async (req, res) => {
  const { user_id } = req.params
  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    )
  }
  Leave.find({ user_id: user_id })
    .then((leaves) => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        leaves,
        successMessages.Create
      )
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}))
}

export const editLeave = async (req, res) => {
  const { leave_id } = req.params
  if (!leave_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    )
  }
  await Leave.findByIdAndUpdate({ _id: leave_id }, req.body)
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Update
      )
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}))
}

export const filterLeave = async (req, res) => {
  const { user_id } = req.body
  if (!user_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    )
  }
  var query = { user_id: user_id }
  if (req.body.from_date) query.from_date = { $gt: req.body.from_date }
  if (req.body.to_date) query.to_date = { $lt: req.body.to_date }
  if (req.body.status) query.status = { $eq: req.body.status }

  Leave.find(query)
    .then((leaves) => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        leaves,
        successMessages.Fetch
      )
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}))
}

export const deleteLeave = async (req, res) => {
  const { leave_id } = req.params
  if (!leave_id) {
    return jsonResponse(
      res,
      responseCodes.BadRequest,
      errorMessages.missingParameter,
      {}
    )
  }
  await Leave.findByIdAndUpdate({ _id: leave_id }, { status: 'delete' })
    .then(() => {
      return jsonResponse(
        res,
        responseCodes.OK,
        errorMessages.noError,
        {},
        successMessages.Update
      )
    })
    .catch((err) => jsonResponse(res, responseCodes.Invalid, err, {}))
}
