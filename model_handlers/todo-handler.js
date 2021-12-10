"use strict";

const logger = require("../utils/logger");
const jsonResponse = require("../utils/json-response");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const commonConstants = require("../constants/common-constants");
const query = require("../utils/query-creator");
const config = require("../config");
const Todo = require("../models/todo");
const passwordHash = require("password-hash");
const moment = require("moment");
const passwordHandler = require("../utils/password-handler");

/*
 * Used to create todo
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createTodo = function (requestParam, user, done) {
  const user_id = user.userInfo.user_id;
  requestParam.user_id = user_id;
  passwordHandler.newHash(requestParam.password, (hashedPW) => {
    requestParam.password = hashedPW;
  });
  query.insertSingle(dbConstants.dbSchema.todo, requestParam, function (
    error,
    todo
  ) {
    if (error) {
      logger("Error: can not create todo");
      done(error, null);
      return;
    }
    done(null, todo);
  });
};

/*
 * Used to Update todo
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateTodo = function (id, requestParam, done) {
  query.updateSingle(
    dbConstants.dbSchema.todo,
    requestParam,
    {
      todo_id: id,
    },
    (error, todo) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.todo);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

const getTodos = function (requestParam, user, done) {
  const user_id = user.userInfo.user_id;
  const userRole = user.userInfo.user_role;
  const comparisonColumnsAndValues = {};
  if (userRole != "Admin") {
    comparisonColumnsAndValues.user_id = user_id;
  }
  if (requestParam.user_id) {
    comparisonColumnsAndValues.user_id = requestParam.user_id;
  }
  if (requestParam.date) {
    comparisonColumnsAndValues.date = requestParam.date;
  } else {
    comparisonColumnsAndValues.date = moment().format("DD/MM/YYYY");
  }
  query.selectWithAnd(
    dbConstants.dbSchema.todo,
    comparisonColumnsAndValues,
    function (error, todo) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, todo);
    }
  );
};

const getTodo = function (id, requestParam, done) {
  query.selectWithAndOne(
    dbConstants.dbSchema.todo,
    { todo_id: id },
    {
      title: 1,
      description: 1,
      is_completed: 1,
      todo_id: 1,
    },
    function (error, todo) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, todo);
    }
  );
};
const deleteTodo = function (id, requestParam, done) {
  query.removeMultiple(dbConstants.dbSchema.todo, { todo_id: id }, function (
    error,
    todo
  ) {
    if (error) {
      done(error, null);
      return;
    }
    done(null, todo);
  });
};

module.exports = {
  createTodo,
  updateTodo,
  getTodos,
  getTodo,
  deleteTodo,
};
