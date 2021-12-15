// const router = require('express').Router();
// const fs = require('fs');
// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })

// const jsonResponse = require('../utils/json-response');
// const responseCodes = require('../helpers/response-codes');
// const {successMessages , errorMessages }  = require('../utils/response-message');


// router.route('/profile/:key').get((req,res) =>{
//     const key = req.params.key;
//     if(key !== ''){
//      const readStream = getFileStream(key);
//      readStream.pipe(res);
//     }else{
//      jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{})
//     }
    
//  });
 
//  module.exports = router;