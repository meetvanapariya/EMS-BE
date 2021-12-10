"use strict";

const logger = require("./../utils/logger");
const errors = require("./../utils/dz-errors");
const dbConstants = require("./../constants/db-constants");
const query = require("./../utils/query-creator");
let async = require("async");
let _ = require("underscore");
const config = require("./../config");
const User = require("./../models/user");
const passwordHash = require("password-hash");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = config.configSecret;

/*
 * Used to authenticate user
 *
 * @param {requestParam} - Object
 *
 * @param {Function} done - Callback function with error, payload params
 */
/*
const authenticateUser = (requestParam, done) => {
	const emailId = requestParam.email.trim();
	const regexEmailId = new RegExp(['^', emailId, '$'].join(''), 'i');
	query.joinWithAnd(dbConstants.dbSchema.user,dbConstants.dbSchema.role, {
		email: regexEmailId
	  }, {
		"name": 1,
		"email": 1,
		"user_id": 1,
		"user_role_id": 1,   	
		"role.role_name":1,
		"role.role_id":1,
		"status":1,
		"password":1,
	  },	  
	  {
        from: "roles",
        localField: "user_role_id",
        foreignField: "role_id",
        as: "role"
      },
	  (error, user) => {
		user = user[0];
		if (error) {
		  logger('Error: can not get ', dbConstants.dbSchema.user);
		  done(errors.dbOperationError(true), {});
		}
		if (user) {
		  if (user.status == 'active') {
			if (passwordHash.verify(requestParam.password, user.password)) {
				const userInfo =  {
					user_id: user.user_id,
					name: user.name,
					email:user.email,
					role_id:user.role[0].role_id,
					role:user.role[0].role_name,
				 };
				const token = jwt.sign(
						{ 
							"userInfo": userInfo
						}, 
						secret, 
						{ expiresIn: '1d' }
					);
				user.token = token;						
				done(null, JSON.parse(JSON.stringify(user, (key, value) => {
					return (value === null) ? "" : value
				})));
			} else {
			  logger("Error: password doesn't match.");
			  done(errors.invalidPassword(true), {});
			}
		  } else {
			logger('Error: user not verified.');
			done(errors.unverifiedUser(true), {});
		  }
		} else {
		  logger('Error: user not exist.');
		  done(errors.resourceNotFound(true), {});
		}
	  })
  };
  */
const authenticateUser = (requestParam, done) => {
  const user_nameId = requestParam.user_name.trim();
 
  const regexEmailId = new RegExp(["^", user_nameId, "$"].join(""), "i");
  
  query.selectWithAndOne(
    dbConstants.dbSchema.user,
    {
      user_name: regexEmailId,
    },
    {
      _id: 0,
      _v: 0,
      updated_at: 0,
    },
    (error, user) => {
      if (error) {
        logger("Error: can not get ", dbConstants.dbSchema.user);
        done(errors.dbOperationError(true), {});
      }
      if (user) {
        if (user.status == "active") {
          if (passwordHash.verify(requestParam.password, user.password)) {
            user.password = "";
            const userDetails = {};
            userDetails.user_id = user.user_id;
            userDetails.user_role = user.user_role;
            userDetails.user_name = user.user_name;
            userDetails.email = user.email;
            userDetails.status = user.status;
            userDetails._id = user._id;
            jwt.sign(
              { userInfo: userDetails },
              secret,
              { expiresIn: "1d" },
              (error, token) => {
                if (error) {
                  logger("Error: can not Token not generated");
                  done(errors.errorWithMessage(error), {});
                }
                const userDetails = {};
                userDetails.user_id = user.user_id;
                userDetails.user_role = user.user_role;
                userDetails.user_name = user.user_name;
                userDetails.email = user.email;
                userDetails.status = user.status;
                userDetails._id = user._id;
                userDetails.token = token;

                done(
                  null,
                  JSON.parse(
                    JSON.stringify(userDetails, (key, value) => {
                      return value === null ? "" : value;
                    })
                  )
                );
              }
            );
          } else {
            logger("Error: password doesn't match.");
            done(errors.invalidPassword(true), {});
          }
        } else {
          logger("Error: user not verified.");
          done(errors.unverifiedUser(true), {});
        }
      } else {
        logger("Error: user not exist.");
        done(errors.resourceNotFound(true), {});
      }
    }
  );
};

/*
 * Used to logout useet
 *
 * @param {requestParam} - Object
 *
 * @param {Function} done - Callback function with error, payload params
 */
const logoutUser = (token, done) => {
  jwt.destroy(token, (error, result) => {
    if (error) {
      logger("Error: can not get ", dbConstants.dbSchema.user);
      done(errors.dbOperationError(true), {});
    }
    done(null, result);
  });
};

/*
 * Used to forgot password
 *
 * @param {requestParam} - Object
 *
 * @param {Function} done - Callback function with error, payload params
 */
const forgotPassword = (requestParam, done) => {
  const emailId = requestParam.email.trim();
  const regexEmailId = new RegExp(["^", emailId, "$"].join(""), "i");
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        query.selectWithAndOne(
          dbConstants.dbSchema.user,
          { email: regexEmailId },
          {},
          (error, user) => {
            if (error) {
              logger("Error: can not get ", dbConstants.dbSchema.user);
              done(errors.dbOperationError(true), {});
            }
            if (user) {
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              query.updateSingle(
                dbConstants.dbSchema.user,
                user,
                {
                  user_id: user.user_id,
                },
                (error, updateUser) => {
                  if (error) {
                    logger("Error: can not update ", dbConstants.dbSchema.user);
                    done(errors.dbOperationError(true), {});
                    return;
                  }
                  done(error, token, user);
                }
              );
            } else {
              logger("Error: user not exist.");
              done(errors.resourceNotFound(true), {});
            }
          }
        );
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: config.smtpAuth.host,
          port: config.smtpAuth.port,
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.smtpAuth.authUser,
            pass: config.smtpAuth.authPassword,
          },
        });
        var mailOptions = {
          to: user.email,
          from: config.adminEmail,
          subject: config.mailContent.resetMail.subject,
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            config.fronendBaseUrl +
            "/resetpassword/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
            logger(
              "info",
              "An e-mail has been sent to " +
                user.email +
                " with further instructions."
            );
            done(errors.cannotSendEmail(true), {});
            return;
          }
          done(null, {});
        });
      },
    ],
    function (err) {
      if (err) return done(err);
      logger("Done");
      done(err, {});
    }
  );
};
/*
 * Used to reset user password
 *
 * @param {token} - String
 *
 * @param {requestParam} - Object
 *
 * @param {Function} done - Callback function with error, payload params
 */

const resetPassword = function (token, requestParam, done) {
  if (requestParam.password != undefined) {
    requestParam.password = passwordHash.generate(requestParam.password);
  }
  query.selectWithAndOne(
    dbConstants.dbSchema.user,
    {
      resetPasswordToken: requestParam.token || token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    {},
    function (error, user) {
      if (error) {
        done(error, null);
        return;
      }
      if (user) {
        user.password = requestParam.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        query.updateSingle(
          dbConstants.dbSchema.user,
          user,
          {
            user_id: user.user_id,
          },
          (error, user) => {
            if (error) {
              logger("Error: can not update ", dbConstants.dbSchema.user);
              done(errors.dbOperationError(true), {});
              return;
            }
            done(null, {});
          }
        );
      } else {
        logger("Error: user not exist.");
        done(errors.resourceNotFound(true), {});
      }
    }
  );
};
/*
 * Used to create user
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const createUser = function (requestParam, user, done) {
    if(user){
        const parent_user_id = user.userInfo.user_id;
        const userRole = requestParam.user_role;
        if (userRole != "Admin") {
            requestParam.parent_user_id = parent_user_id;
        }
    }
    if (requestParam.user_docs != undefined) {
        requestParam.user_docs = JSON.parse(requestParam.user_docs);
    }
    if (requestParam.password != undefined) {
        requestParam.password = passwordHash.generate(requestParam.password);
    }  
  query.insertSingle(dbConstants.dbSchema.user, requestParam, function (
    error,
    user
  ) {
    if (error) {
      logger("Error: can not create user");
      done(error, null);
      return;
    }
    done(null, user);
  });
};

/*
 * Used to Update user
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateUser = function (id, requestParam, user, done) {
  const parent_user_id = user.userInfo.user_id;
  if (requestParam.password != undefined) {
    requestParam.password = passwordHash.generate(requestParam.password);
  }

  if (requestParam.user_docs != undefined) {
    requestParam.user_docs = JSON.parse(requestParam.user_docs);
  }
  requestParam.parent_user_id = parent_user_id;

  query.updateSingle(
    dbConstants.dbSchema.user,
    requestParam,
    {
      user_id: id,
    },
    (error, user) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.user);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};
/*
 * Used to Update user
 * @param {requestParam} - request parameters from body
 * @param {Function} done - Callback function with error, data params
 */
const updateProfile = function (user, requestParam, done) {
  const user_id = user.userInfo.user_id;
  if (requestParam.password != undefined) {
    requestParam.password = passwordHash.generate(requestParam.password);
  }
  if (requestParam.user_docs != undefined) {
    requestParam.user_docs = JSON.parse(requestParam.user_docs);
  }
  query.updateSingle(
    dbConstants.dbSchema.user,
    requestParam,
    {
      user_id: user_id,
    },
    (error, user) => {
      if (error) {
        logger("Error: can not update ", dbConstants.dbSchema.user);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, {});
    }
  );
};

const getUsers = function (requestParam, user, done) {
  const parent_user_id = user.userInfo.user_id;
  const userRole = user.userInfo.user_role;
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.status = { $ne: "delete" };
  /*if (userRole != "Admin") {
    if (userRole != "Developer") {
      comparisonColumnsAndValues.parent_user_id = parent_user_id;
    } else {
      comparisonColumnsAndValues.user_id = parent_user_id;
    }
  }*/
  query.selectWithAnd(
    dbConstants.dbSchema.user,
    comparisonColumnsAndValues,
    {
      password: 0,
      _id: 0,
      _v: 0,
      updated_at: 0,
    },
    function (error, user) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, user);
    }
  );
};

const getUser = function (id, user, done) {
  const comparisonColumnsAndValues = {};
  comparisonColumnsAndValues.user_id = id;
  query.selectWithAndOne(
    dbConstants.dbSchema.user,
    comparisonColumnsAndValues,
    {
      password: 0,
      _id: 0,
      _v: 0,
      updated_at: 0,
    },
    function (error, user) {
      if (error) {
        done(error, null);
        return;
      }
      done(null, user);
    }
  );
};

const deleteUser = function (id, requestParam, done) {
  query.softDelete(
    dbConstants.dbSchema.user,
    { status: "delete" },
    {
      user_id: id,
    },
    (error, user) => {
      if (error) {
        logger("Error: can not delete ", dbConstants.dbSchema.user);
        done(errors.dbOperationError(true), {});
        return;
      }
      done(null, user);
    }
  );
};

module.exports = {
  authenticateUser,
  createUser,
  updateUser,
  getUsers,
  getUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  updateProfile,
};
