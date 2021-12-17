import express from "express";
// importing signup controller.
// import jsonResponse from '../utils/json-response';
// import responseCodes from '../helpers/response-codes';
// import {successMessages , errorMessages }  from '../utils/response-message';

import {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateProfilePic,
  forgetPassword,
  resetPassword
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import {
  userRegisterValidators,
  userLoginValidators,
} from "../validators/auth.js";
import { runValidate } from "../validators/index.js";

const router = express.Router();


import multer from 'multer';
const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,'./uploads/profile/')
    },
    filename : function(req,file,cb){
      cb(null,new Date().toISOString()+file.originalname);
    }
}) 
const upload = multer({storage:storage})


router.post(
  "/register",
  userRegisterValidators,
  runValidate,
  registerUser
);
router.post(
  "/login",
  userLoginValidators,
  runValidate,
  loginUser
);

router.get(
  "/get/:userId", 
  getUser
);

router.get(
  "/all",
  verifyToken,
  getAllUsers
);

router.patch(
  "/delete/:userId", 
  deleteUser
);
router.patch(
  "/update/:userId", 
  updateUser
);


router.post(
  "/profile",
  upload.single('profile-pic'),
  updateProfilePic
);

router.post(
  "/forget-password",
  forgetPassword
);

router.post(
  "/reset-password",
  resetPassword
);
export default router;
