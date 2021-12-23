import express from "express";
const router = express.Router();

import {
    addLeave,
    getLeave,
    editLeave,
    filterLeave
  } from "../controllers/leaveController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";

  
router.post("/add",addLeave);
router.get("/get/:user_id",getLeave)
router.patch("/edit/:leave_id",editLeave)

router.post(
  "/filter",
  filterLeave
)
export default router;
