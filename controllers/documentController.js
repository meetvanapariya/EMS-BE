import { Document } from "../models/documentModel.js";
import jsonResponse from '../utils/json-response.js';
import responseCodes from '../helpers/response-codes.js';
import {successMessages , errorMessages }  from '../utils/response-message.js';


// uploadImages POST request controller
export const uploadImages = async (req, res) => {
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
};
  
// getImages POST request controller
export const getImages = async (req, res) => {
    Document.find({is_delete : {$ne : true }}).sort({createdAt : -1}) 
    .then((docs) => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,docs, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
};
  
// getSingleImages POST request controller
export const getSingleImages = async (req, res) => {
    const user_id  = req.params.id;
    Document.find({user_id : user_id, is_delete : {$ne : true }}).sort({createdAt : -1}) 
    .then((docs) => {
        return jsonResponse(res, responseCodes.OK, errorMessages.noError,docs, successMessages.Create);
    }).catch(err => jsonResponse(res, responseCodes.Invalid, err , {}))
};
  
// deleteSingleImages POST request controller
export const deleteSingleImages = async (req, res) => {
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
};
  
