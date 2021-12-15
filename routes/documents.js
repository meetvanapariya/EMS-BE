const router = require('express').Router();
const fs = require('fs');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const auth = require("../middleware/auth");

const Document = require('../models/documents.model');
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {successMessages , errorMessages }  = require('../utils/response-message');

const { uploadFile , getFileStream } = require('../middleware/s3');



// router.route('/upload').post(upload.single('image'),(req,res) =>{
//     const { user_id } = req.body;
//     if (!(user_id)) {
//         return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
//     }
//     // console.log(req.file.originalname);
//     let data = fs.readFileSync(req.file.path);
//     let base64 = data.toString('base64');
//     let image = new Buffer.from(base64);
//     const newDocument = new Document({
//         user_id : user_id,
//         document_name : req.file.originalname,
//         document_type : req.file.mimetype,
//         document_description : '',
//         document_img : image
//     })
//     newDocument.save() 
//     .then(() => {
//         fs.unlinkSync(req.file.path)
//         return jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
//     }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
  
// });




router.route('/upload').post(upload.single('image'),async (req,res) =>{
    const file = req.file;
    const { user_id , description} = req.body;
    if (!(user_id)) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    const resultAwsUpload = await uploadFile(file);
    const newDocument = new Document({
        user_id : user_id,
        document_name : req.file.originalname,
        document_type : req.file.mimetype,
        document_description : description,
        document_img : resultAwsUpload.Key,
        s3_location : resultAwsUpload.Location,
        folder_name : 'document/'
    })
    newDocument.save() 
    .then(() => {
        fs.unlinkSync(req.file.path)
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
});


router.route('/get/:userid').get((req,res) =>{
    const user_id = req.params.userid;
    if (user_id === '') {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    Document.find({user_id : user_id})
    .then(docs => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError, docs, successMessages.Fetch);
    }) .catch(err => jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{}));
});


router.route('/:key').get(auth ,(req,res) =>{
   const key = req.params.key;
   if(key !== ''){
    const readStream = getFileStream(key);
    readStream.pipe(res);
   }else{
    jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{})
   }
   
});

module.exports = router;