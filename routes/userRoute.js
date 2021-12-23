import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateProfilePic,
  forgetPassword,
  resetPassword,
  logOut
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import {
  userRegisterValidators,
  userLoginValidators,
  userLogoutValidators
} from "../validators/auth.js";
import { runValidate } from "../validators/index.js";

import multer from "multer";
import { canAccess } from "../middlewares/roleAuth.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profile/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });



router.get("/get/:userId", verifyToken, canAccess, getUser);
router.get("/all", verifyToken,canAccess, getAllUsers);

router.patch("/delete/:userId", verifyToken, canAccess, deleteUser);
router.patch("/update/:userId", verifyToken, canAccess, upload.single("profile-pic") ,updateUser);

router.post("/profile", upload.single("profile-pic"), updateProfilePic);
router.post("/register", userRegisterValidators, runValidate, registerUser);
router.post("/login", userLoginValidators, runValidate, loginUser);
router.post("/logout",userLogoutValidators ,runValidate , logOut);
router.post("/forget-password", forgetPassword);
router.post("/reset-password",verifyToken, resetPassword);

export default router;
