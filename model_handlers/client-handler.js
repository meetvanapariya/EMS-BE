"use strict";

const logger = require("../utils/logger");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const query = require("../utils/query-creator");
const config = require("../config");
const Client = require("../models/client");
const passwordHash = require("password-hash");

/*
 * Used to create client
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createClient = function (requestParam, done) {
  if (requestParam.client_docs != undefined) {
    requestParam.client_docs = JSON.parse(requestParam.client_docs);
  }
  query.insertSingle(dbConstants.dbSchema.client, requestParam, function (
    error,
    client
  ) {
    if (error) {
      logger("Error: can not create client");
      done(error, null);
      return;
    }
    done(null, client);
  });
};

/*
 * Used to Update client
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateClient = function (id, requestParam, done) {
  if (requestParam.client_docs != undefined) {
    requestParam.client_docs = JSON.parse(requestParam.client_docs);
  }

  query.updateSingle(
    dbConstants.dbSchema.client,
    requestParam,
    {
      client_id: id,
    },
    (error, client) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.client);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

const getClients = function (requestParam, done) {
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.status = { $ne: "delete" };
  query.selectWithAnd(
    dbConstants.dbSchema.client,
    comparisonColumnsAndValues,
    {
      _id: 0,
      _v: 0,
      updated_at: 0,
    },
    function (error, client) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, client);
    }
  );
};

const getClient = function (id, requestParam, done) {
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.client_id = id;
  query.selectWithAndOne(
    dbConstants.dbSchema.client,
    comparisonColumnsAndValues,
    {
      _id: 0,
      _v: 0,
      updated_at: 0,
    },
    function (error, client) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, client);
    }
  );
};
const deleteClient = function (id, requestParam, done) {
  query.softDelete(
    dbConstants.dbSchema.client,
    { status: "delete" },
    {
      client_id: id,
    },
    (error, client) => {
      if (error) {
        logger("Error: can not delete ", dbConstants.dbSchema.client);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

module.exports = {
  createClient,
  updateClient,
  getClients,
  getClient,
  deleteClient,
};
