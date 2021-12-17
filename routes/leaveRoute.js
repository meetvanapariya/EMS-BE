import express from "express";
const router = express.Router();

import {
    addLeave,
    
  } from "../controllers/leaveController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";

  
router.post(
    "/add",
    addLeave
)

export default router;
