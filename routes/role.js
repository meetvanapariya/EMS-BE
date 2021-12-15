const router = require('express').Router();
const Role = require('../models/role.model');
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {successMessages , errorMessages }  = require('../utils/response-message');

router.route('/add').post((req,res)=>{
    const {role_name , permission_read , permission_write , permission_access} = req.body;
    const newRole = new Role({
        role_name,
        permission_read,
        permission_write,
        permission_access
    });
    newRole.save()
    .then(() => {
        jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
    })
    .catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
});

module.exports = router;