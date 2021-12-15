const router = require('express').Router();
const fs = require('fs');
const auth = require("../middleware/auth");

const Document = require('../models/documents.model');
const jsonResponse = require('../utils/json-response');
const responseCodes = require('../helpers/response-codes');
const {successMessages , errorMessages }  = require('../utils/response-message');

// const { uploadFile , getFileStream } = require('../middleware/s3');

const multer  = require('multer');

const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./uploads/document/')
    },
    filename : function(req,file,cb){
      cb(null,new Date().toISOString()+file.originalname);
    }
}) 

const upload = multer({storage:storage})


router.route('/upload').post(upload.array('image',5),(req,res) =>{
    const { user_id ,description} = req.body;
    const files = req.files;
    if (!(user_id)) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    let arr_files = files.map((file) =>{
        let data = {
            user_id : user_id,
            document_name : file.originalname,
            document_type : file.mimetype,
            document_description : description,
            document_img : file.path,
            s3_location : '',
            folder_name : 'document/'
        }
        return data;
    })
    // const newDocument = new Document(arr_files)
    Document.insertMany(arr_files) 
    .then(() => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
});



router.route('/get').get((req,res) =>{
    Document.find({is_delete : {$ne : true }}).sort({createdAt : -1}) 
    .then((docs) => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,docs, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
});

router.route('/get/:id').get((req,res) =>{
   const user_id  = req.params.id;
    Document.find({user_id : user_id, is_delete : {$ne : true }}).sort({createdAt : -1}) 
    .then((docs) => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,docs, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
});

router.route('/delete/').post((req,res) =>{
    const doc_id  = req.body.document_id;
    if (!(doc_id)) {
        return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
    }
    // console.log(doc_id);
    // return;
    Document.findByIdAndUpdate(doc_id , {is_delete : true}) 
    .then(() => {
      return jsonResponse(res, responseCodes.OK, errorMessages.noError, {}, successMessages.Delete);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
})

// router.route('/upload').post(upload.single('image'),async (req,res) =>{
//     const file = req.file;
//     const { user_id , description} = req.body;
//     if (!(user_id)) {
//         return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
//     }
//     const resultAwsUpload = await uploadFile(file);
//     const newDocument = new Document({
//         user_id : user_id,
//         document_name : req.file.originalname,
//         document_type : req.file.mimetype,
//         document_description : description,
//         document_img : resultAwsUpload.Key,
//         s3_location : resultAwsUpload.Location,
//         folder_name : 'document/'
//     })
//     newDocument.save() 
//     .then(() => {
//         fs.unlinkSync(req.file.path)
//         return jsonResponse(res, responseCodes.OK, errorMessages.noError,{}, successMessages.Create);
//     }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
// });


// router.route('/get/:userid').get((req,res) =>{
//     const user_id = req.params.userid;
//     if (user_id === '') {
//         return jsonResponse(res, responseCodes.BadRequest,errorMessages.missingParameter,{})
//     }
//     Document.find({user_id : user_id})
//     .then(docs => {
//         return jsonResponse(res, responseCodes.OK, errorMessages.noError, docs, successMessages.Fetch);
//     }) .catch(err => jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{}));
// });


// router.route('/:key').get(auth ,(req,res) =>{
//    const key = req.params.key;
//    if(key !== ''){
//     const readStream = getFileStream(key);
//     readStream.pipe(res);
//    }else{
//     jsonResponse(res, responseCodes.BadRequest,errorMessages.internalServer,{})
//    }
   
// });

module.exports = router;