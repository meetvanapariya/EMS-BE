"use strict";

const logger = require("../utils/logger");
const errors = require("../utils/dz-errors");
const dbConstants = require("../constants/db-constants");
const query = require("../utils/query-creator");
const Holiday = require("../models/holiday");
const config = require("../config");

/*
 * Used to create holiday
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createHoliday = (requestParam, done) =>{
    query.insertSingle(dbConstants.dbSchema.holiday, requestParam, function(
        error,
        holiday
        ){
        if(error){
            logger('Error: can not create holiday');
            done(error, null);
            return;
        }
        done(null, holiday);
    })
}

/**
 * get Holiday in the database.
 *
 */
const getHolidays = (requestParam, done) => {
    const comparisonColumnsAndValues = {};
    comparisonColumnsAndValues.status = { $ne: "delete" };
    query.selectWithAnd(
      dbConstants.dbSchema.holiday,
      comparisonColumnsAndValues,
      function (error, holiday) {
        if (error) {
          done(error, null);
          return;
        }
        done(null, holiday);
      }
    );
}

/*
 * Used to Update holiday
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateHoliday = (id, requestParam, done) => {
    query.updateSingle(
        dbConstants.dbSchema.holiday,
        requestParam,
        {holiday_id: id},
        (error, holiday) => {
            if (error) {
                logger("Error: can not update ", dbConstants.dbSchema.holiday);
                done(errors.dbOperationError(true), {});
                return;
              }
              done(null, {});
        }
    );
};

const deleteHoliday = (id, requestParam, done) => {
    query.removeMultiple(
        dbConstants.dbSchema.holiday,
        {holiday_id: id},
        (error, holiday) => {
          if (error) {
            logger("Error: can not delete ", dbConstants.dbSchema.holiday);
            done(error, null);
            return;
          }
          done(null, holiday);
        }
      );
} 

module.exports = {
    createHoliday,
    getHolidays,
    updateHoliday,
    deleteHoliday,
}