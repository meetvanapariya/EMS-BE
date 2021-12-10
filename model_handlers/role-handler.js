'use strict'

const logger = require('../utils/logger');
const jsonResponse = require('../utils/json-response');
const errors = require('../utils/dz-errors');
const dbConstants = require('../constants/db-constants');
const commonConstants = require('../constants/common-constants');
const query = require('../utils/query-creator');
const config = require('../config');
const Role = require('../models/role');
const passwordHash = require('password-hash');
const moment = require('moment');
const passwordHandler = require('../utils/password-handler');


/*
 * Used to create role
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
 const createRole = function(requestParam,done){
 	passwordHandler.newHash(requestParam.password, (hashedPW) => {
		requestParam.password = hashedPW;
	}); 
	query.insertSingle(dbConstants.dbSchema.role,requestParam,function (error, role) {
		if (error) {
			logger('Error: can not create role');
			done(error, null) ;
			return;
		}
		done(null, role);
	});
 }; 

/*
 * Used to Update role
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
 const updateRole = function(id,requestParam,done){
 	query.updateSingle(dbConstants.dbSchema.role, requestParam, {
        role_id: id,
      }, (error, role) => {
        if (error) {
          logger('Error: can not update ', dbConstants.dbSchema.role);
          done(errors.dbOperationError(true), {});
          return;
        }
        done(null, {});
      }); 
 }; 

const getRoles=function(requestParam,done){
	query.selectWithAnd(dbConstants.dbSchema.role, function (error,role) {
		if (error) { 
			done(error, null);	
			return;
		}
		done(null, role);		
 	}); 
}; 

const getRole=function(id,requestParam,done){
	query.selectWithAndOne(dbConstants.dbSchema.role,{'role_id':id },  {
	role_name: 1,
	role_id:1,
  },function (error,role) {
		if (error) { 
			done(error, null);	
			return; 
		}
		done(null, role);		
 	}); 
};
const deleteRole=function(id,requestParam,done){
	query.removeMultiple(dbConstants.dbSchema.role, {'role_id':id },function (error,role) {
		if (error) { 
			done(error, null);	
			return;
		}
		done(null, role);		
 	}); 
};

 module.exports = { 
  createRole,
  updateRole,
  getRoles,
  getRole,
  deleteRole
};