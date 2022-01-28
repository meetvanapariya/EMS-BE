// External
import moment from "moment";
import jwt from "jsonwebtoken";

// Internal
import { Holiday } from "../models/holidayModel.js";
import { Leave } from "../models/leaveModel.js";
import { User } from "../models/userModel.js";
import jsonResponse from "../utils/json-response.js";
import { errorMessages, successMessages } from "../utils/response-message.js";
import { JWT_SECRET } from "../config/environmentVariables.js";

export function getHolidays(req, res) {
  // this query will find all holidays which will be after today
  let today = new Date();

  Holiday.find({ holiday_date: { $gte: today } })
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
}

export function getBirthdays(req, res) {
  // this query will find all holidays which will be after today
  let today = moment()
    .utcOffset(0)
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  User.find({ user_birth_date: { $gte: today } })
    .sort({ user_birth_date: 1 })
    .then((birthday) => {
      let birthdayList = birthday.map(
        ({
          profile_image,
          user_birth_date,
          email,
          username,
          _id,
          first_name,
          last_name,
        }) => {
          let birthday = {
            profile_image,
            user_birth_date,
            email,
            username,
            _id,
            first_name,
            last_name,
          };
          return birthday;
        }
      );
      return jsonResponse(
        res,
        200,
        errorMessages.noError,
        { birthdayList },
        successMessages.Fetch
      );
    })
    .catch((error) => {
      return jsonResponse(res, 400, error.message, {}, {});
    });
}

export function getLeaves(req, res) {
  const { userId } = req.params;
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded.role == "Admin") {
    return jsonResponse(res, 403, errorMessages.invalidRole, {}, {});
  }
  const findQuery = decoded.role === "Admin" ? "Admin" : "Developer";
  let searchKey = {
    Admin: null,
    Developer: { user_id: userId },
  };

  Leave.find(searchKey[findQuery])
    .sort({ createdAt: -1 })
    .then((userLeave) => {
      return jsonResponse(
        res,
        200,
        errorMessages.noError,
        { userLeave },
        successMessages.Fetch
      );
    })
    .catch((error) => {
      return jsonResponse(res, 400, error.message, {}, {});
    });
}
