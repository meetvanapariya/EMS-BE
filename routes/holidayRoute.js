import express from "express";
const router = express.Router();

import {
  addHoliday,
  getHoliday,
  editHoliday,
  filterHoliday,
  deleteHoliday,
  getUpcomingHoliday,
} from "../controllers/holidayController.js";
import { verifyToken } from "../middlewares/tokenAuth.js";
import { canAccess, user } from "../middlewares/roleAuth.js";

router.post("/add", verifyToken, canAccess, addHoliday);
router.get("/get", verifyToken, user, getHoliday);
router.patch("/edit/:holiday_id", verifyToken, canAccess, editHoliday);
router.get("/upcoming", verifyToken, user, getUpcomingHoliday);
router.patch("/delete/:holiday_id", verifyToken, canAccess, deleteHoliday);
router.post("/filter", filterHoliday);
export default router;
