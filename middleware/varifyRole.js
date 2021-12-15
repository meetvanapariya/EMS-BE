const User = require('../models/user.model');
const Role = require('../models/role.model');
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {errorMessages }  = require('../utils/response-message');

const verifyRole = (req, res, next) => {
    // console.log(req);
    try {
        if(res.locals.user.user_id){
            // console.log(req.originalUrl);
            User.findOne({user_id: res.locals.user.user_id},{user_role:1})
           .then(user => {
               if(user.user_role){
                   Role.findOne({role_name : user.user_role})
                   .then(role => {
                       if(role.permission_access !== true){
                          return jsonResponse(res, responseCodes.Forbidden, errorMessages.invalidRole, {} );
                       }else{
                           return next();
                       }
                   })
               }else{
                   return jsonResponse(res, responseCodes.Forbidden, errorMessages.noRole, {} );
               }
           })
           .catch(err => jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{}));
       }else{
           return jsonResponse(res, responseCodes.Forbidden, errorMessages.noRole, {} );
       }     
    }catch(err){
        return jsonResponse(res, responseCodes.Unauthorized, errorMessages.accesstokenInvalid, {} );
    }
  };
  
  module.exports = verifyRole;