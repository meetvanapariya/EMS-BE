"use strict";

const logger = require("../utils/logger");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const query = require("../utils/query-creator");
const config = require("../config");
const Project = require("../models/project");
let _ = require("underscore");

/*
 * Used to create project
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createProject = function (requestParam, user, done) {
  const created_by_id = user.userInfo.user_id;
  requestParam.created_by_id = created_by_id;
  if (requestParam.project_docs != undefined) {
    requestParam.project_docs = JSON.parse(requestParam.project_docs);
  }

  query.insertSingle(dbConstants.dbSchema.project, requestParam, function (
    error,
    project
  ) {
    if (error) {
      logger("Error: can not create project");
      done(error, null);
      return;
    }
    done(null, project);
  });
};

/*
 * Used to Update project
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateProject = function (id, requestParam, user, done) {
  const created_by_id = user.userInfo.user_id;
  requestParam.created_by_id = created_by_id;
  if (requestParam.project_docs != undefined) {
    requestParam.project_docs = JSON.parse(requestParam.project_docs);
  }
  query.updateSingle(
    dbConstants.dbSchema.project,
    requestParam,
    {
      project_id: id,
    },
    (error, project) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.project);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

const getProjects = function (user, done) {
  const created_by_id = user.userInfo.user_id;
  const comparisonColumnsAndValues = {};
  const userRole = user.userInfo.user_role;
  comparisonColumnsAndValues.status = { $ne: "delete" };
  if (userRole === "Developer") {
    comparisonColumnsAndValues.project_team_member_ids = {
      $regex: created_by_id,
    };
  } else if (userRole === "Team Leader") {
    comparisonColumnsAndValues.project_leader_ids = {
      $regex: created_by_id,
    };
  } else if (userRole === "PM") {
    comparisonColumnsAndValues.project_manager_id = created_by_id;
  }
  console.log(comparisonColumnsAndValues);
  query.selectWithAnd(
    dbConstants.dbSchema.project,
    comparisonColumnsAndValues,
    {},
    function (error, project) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, project);
    }
  );
};

const getProject = function (id, user, done) {
  const created_by_id = user.userInfo.user_id;
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.project_id = id;

  query.selectWithAndOne(
    dbConstants.dbSchema.project,
    comparisonColumnsAndValues,
    {},
    function (error, project) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, project);
    }
  );
};

const deleteProject = function (id, requestParam, done) {
  query.softDelete(
    dbConstants.dbSchema.project,
    { status: "delete" },
    {
      project_id: id,
    },
    (error, project) => {
      if (error) {
        logger("Error: can not delete ", dbConstants.dbSchema.project);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

module.exports = {
  createProject,
  updateProject,
  getProjects,
  getProject,
  deleteProject,
};
