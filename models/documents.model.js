const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
   user_id : {
       type : String,
   },
   document_name : {
    type : String
    },
    document_type : {
        type : String
    },
    document_description : {
        type : String
    },
    document_img : {
        type : String
    } ,
    s3_location :{
        type : String
    } ,
    folder_name :{
        type : String
    } , 
},{timestamps:true});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;