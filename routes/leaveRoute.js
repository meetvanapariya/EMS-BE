import express from "express";
const router = express.Router();

import {
    addLeave,
    getLeave,
    editLeave,
    filterLeave,
    deleteLeave
  } from "../controllers/leaveController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";

  
router.post("/add",addLeave);
router.get("/get/:user_id",getLeave)
router.patch("/edit/:leave_id",editLeave)
router.patch("/delete/:leave_id", deleteLeave);


router.post(
  "/filter",
  filterLeave
)
export default router;
