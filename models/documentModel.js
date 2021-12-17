import mongoose from "mongoose";

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
    is_delete :{
        type:Boolean,
        default:false
    }
},{timestamps:true});

export const Document = mongoose.model("Document", documentSchema);