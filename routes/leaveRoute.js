import express from "express";
const router = express.Router();

import {
  addLeave,
  getLeave,
  editLeave,
  filterLeave,
  deleteLeave,
  getCurrentLastLeave,
  filterAdminLeave,
  getLeaveCount
} from "../controllers/leaveController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import { user } from "../middlewares/roleAuth.js";

router.post("/add", addLeave);
router.get("/get/:user_id", getLeave);
router.get("/get-count/:user_id", getLeaveCount);
router.patch("/edit/:leave_id", editLeave);
router.patch("/delete/:leave_id", deleteLeave);
router.get("/next-days-leave", user, getCurrentLastLeave);

router.post("/filter", filterLeave);
router.post("/filterAdmin", filterAdminLeave);
export default router;
