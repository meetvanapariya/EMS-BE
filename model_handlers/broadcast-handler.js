"use strict";

const logger = require("../utils/logger");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const query = require("../utils/query-creator");
const Broadcast = require('../models/broadcast');
const config = require("../config");


/**
 * get Broadcast in the database.
 *
 */
const getBroadcast = (requestParam, done) => {
    const comparisonColumnsAndValues = {};
    comparisonColumnsAndValues.status = { $ne: "delete" };
    query.selectWithAnd(
      dbConstants.dbSchema.broadcast,
      comparisonColumnsAndValues,
      function (error, broadcast) {
        if (error) {
          done(error, null);
          return;
        }
        done(null, broadcast);
      }
    );
}

/*
 * Used to create Broadcast
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const creatBroadcast = (requestParam, done) =>{ 
    query.insertSingle(dbConstants.dbSchema.broadcast, requestParam, function(
        error,
        broadcast
        ){
        if(error){
            logger('Error: can not create broadcast msg');
            done(error, null);
            return;
        }
        done(null, broadcast);
    })
}


/*
 * Used to Update Broadcast
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateBroadcast = (id, requestParam, done) => {
   query.updateSingle(
    dbConstants.dbSchema.broadcast,
    requestParam,
    {broadcast_id: id},
    (error, broadcast) => {
        if (error) {
            logger("Error: can not update ", dbConstants.dbSchema.broadcast);
            done(errors.dbOperationError(true), {});
            return;
          }
          done(null, {});
    }
);
};

/*
 * Used to delete Broadcast
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const deleteBroadcast = (id, requestParam, done) => {
   query.removeMultiple(
    dbConstants.dbSchema.broadcast,
    {broadcast_id: id},
    (error, broadcast) => {
      if (error) {
        logger("Error: can not delete ", dbConstants.dbSchema.broadcast);
        done(error, null);
        return;
      }
      done(null, broadcast);
    }
  );
}

module.exports = {
    getBroadcast,
    creatBroadcast,
    updateBroadcast,
    deleteBroadcast,
}