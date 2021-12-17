import express from "express";
const router = express.Router();

import {
  uploadImages,
  getImages,
  getSingleImages,
  deleteSingleImages
} from "../controllers/documentController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";


import multer from 'multer';
const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./uploads/document/')
    },
    filename : function(req,file,cb){
      cb(null,new Date().toISOString()+file.originalname);
    }
}) 
const upload = multer({storage:storage})

router.post(
    "/upload",
    upload.array('image',5),
    uploadImages
);

router.get(
  "/get",
  getImages
);

router.get(
  "/get/:id",
  getSingleImages
);

router.post(
  "/delete",
  deleteSingleImages
);

export default router;