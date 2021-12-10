"use strict";

const logger = require("../utils/logger");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const query = require("../utils/query-creator");
const config = require("../config");
const Leave = require("../models/leave");
const passwordHash = require("password-hash");

/*
 * Used to create leave
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createLeave = function (requestParam, done) {
  query.insertSingle(dbConstants.dbSchema.leave, requestParam, function (
    error,
    leave
  ) {
    if (error) {
      logger("Error: can not create leave");
      done(error, null);
      return;
    }
    done(null, leave);
  });
};

/*
 * Used to Update leave
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateLeave = function (id, requestParam, done) {
  query.updateSingle(
    dbConstants.dbSchema.leave,
    requestParam,
    {
      leave_id: id,
    },
    (error, leave) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.leave);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

const getLeaves = function (requestParam, user, done) {
  const user_id = user.userInfo.user_id;
  const userRole = user.userInfo.user_role;
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.status = { $ne: "delete" };
  if (userRole != "Admin") {
    comparisonColumnsAndValues.user_id = user_id;
  }
  query.selectWithAnd(
    dbConstants.dbSchema.leave,
    comparisonColumnsAndValues,
    function (error, leave) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, leave);
    }
  );
};

const getLeave = function (id, requestParam, done) {
  query.selectWithAndOne(
    dbConstants.dbSchema.leave,
    { leave_id: id },
    {},
    function (error, leave) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, leave);
    }
  );
};
const deleteLeave = function (id, requestParam, done) {
  query.softDelete(
    dbConstants.dbSchema.leave,
    { status: "delete" },
    {
      leave_id: id,
    },
    (error, leave) => {
      if (error) {
        logger("Error: can not delete ", dbConstants.dbSchema.leave);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

module.exports = {
  createLeave,
  updateLeave,
  getLeaves,
  getLeave,
  deleteLeave,
};
